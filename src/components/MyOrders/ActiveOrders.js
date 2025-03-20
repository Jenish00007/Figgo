import React, { useContext, useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import ThemeContext from '../../ui/ThemeContext/ThemeContext';
import { theme } from '../../utils/themeColors';
import TextDefault from '../Text/TextDefault/TextDefault';
import TextError from '../Text/TextError/TextError';
import { alignment } from '../../utils/alignment';
import { scale } from '../../utils/scaling';
import { useTranslation } from 'react-i18next';
import ConfigurationContext from '../../context/Configuration';
import { calulateRemainingTime } from '../../utils/customFunctions';
import Spinner from '../Spinner/Spinner';
import EmptyView from '../EmptyView/EmptyView';
import AuthContext from '../../context/Auth';

const ActiveOrders = ({ navigation }) => {
  const { t } = useTranslation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = theme[themeContext.ThemeValue];
  const configuration = useContext(ConfigurationContext);
  const { token } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);

  useEffect(() => {
    fetchActiveOrders();
    
    // Set up polling to refresh orders periodically
    const intervalId = setInterval(() => {
      fetchActiveOrders();
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://6ammart-admin.6amtech.com/api/v1/customer/order/running-orders?offset=1&limit=10',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.orders || !Array.isArray(data.orders)) {
        console.error('Invalid API response format:', data);
        setActiveOrders([]);
        return;
      }
      
      // Transform API response to match component requirements
      const transformedOrders = data.orders.map(order => ({
        id: order.id,
        _id: order.id.toString(),
        orderAmount: order.order_amount,
        orderStatus: order.order_status.toUpperCase(),
        created_at: order.created_at,
        schedule_at: order.schedule_at,
        restaurant: {
          name: order.store?.name || 'Restaurant',
          image: order.store?.logo || null
        },
        // Create placeholder items until we fetch details
        items: [{
          quantity: 1,
          title: `Order #${order.id}`
        }]
      }));
      
      setActiveOrders(transformedOrders);
      
      // Fetch detailed information for each order
      transformedOrders.forEach(order => {
        fetchOrderDetails(order.id);
      });
      
      setError(null);
    } catch (err) {
      setError(err);
      console.error('Error fetching active orders:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await fetch(
        `https://6ammart-admin.6amtech.com/api/v1/customer/order/details/${orderId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) return;
      
      const data = await response.json();
      
      if (data.order) {
        // Update the specific order with detailed information
        setActiveOrders(prevOrders => {
          return prevOrders.map(order => {
            if (order.id === orderId) {
              // Extract items from order details if available
              const orderItems = data.order.details || data.order.items || [];
              const items = orderItems.map(item => ({
                quantity: item.quantity || 1,
                title: item.food_name || item.item_name || item.name || 'Item',
                variation: item.variation || null
              }));
              
              return {
                ...order,
                items: items.length > 0 ? items : order.items
              };
            }
            return order;
          });
        });
      }
    } catch (error) {
      console.error(`Error fetching details for order ${orderId}:`, error);
    }
  };

  const emptyView = () => {
    return (
      <EmptyView
        title={t('titleEmptyActiveOrders')}
        description={t('emptyActiveOrdersDesc')}
        buttonText={t('emptyActiveOrdersBtn')}
      />
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.tabButton} onPress={() => {}}>
          <TextDefault 
            H4 
            bold 
            textColor={currentTheme.fontMainColor}>
            {t('Current')}
          </TextDefault>
          <View style={[styles.activeTab, {backgroundColor: currentTheme.main}]} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => {}}>
          <TextDefault 
            H4 
            textColor={currentTheme.fontSecondColor}>
            {t('Past')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <OrderCard
        item={item}
        navigation={navigation}
        currentTheme={currentTheme}
        configuration={configuration}
      />
    );
  };

  if (loading && activeOrders.length === 0) {
    return (
      <Spinner
        size={'small'}
        backColor={currentTheme.themeBackground}
        spinnerColor={currentTheme.main}
      />
    );
  }
  if (error) return <TextError text={error.message} />;

  return (
    <View style={[styles.container, {backgroundColor: currentTheme.themeBackground}]}>
     
     
      <FlatList
        data={activeOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id?.toString() || item?._id || Math.random().toString()}
        ListEmptyComponent={emptyView}
        onRefresh={fetchActiveOrders}
        refreshing={loading}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const OrderCard = ({ item, navigation, currentTheme, configuration }) => {
  const { t } = useTranslation();
  const [orderData, setOrderData] = useState(item);
  
  // Safety check - don't render if crucial data is missing
  if (!orderData) {
    return null;
  }
  
  const remainingTime = calulateRemainingTime(orderData) || 15;
  const orderId = orderData.id || orderData._id;
  const date = new Date();
  const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.cardContainer, {backgroundColor: currentTheme.white}]}
      onPress={() => navigation.navigate('OrderDetail', { _id: orderId })}>
      <View style={styles.cardHeader}>
        {orderData.restaurant && orderData.restaurant.image ? (
          <Image
            style={styles.restaurantLogo}
            source={require("./../../assets/icons/cross.png")}
            resizeMode="contain"
          />
        ) : (
          <View style={[styles.logoPlaceholder, {backgroundColor: currentTheme.secondaryBackground}]}>
            <TextDefault textColor={currentTheme.fontMainColor} center bold>
              {orderData.restaurant?.name?.charAt(0) || 'R'}
            </TextDefault>
          </View>
        )}
        <View style={styles.orderInfoContainer}>
          <TextDefault textColor={currentTheme.fontMainColor} bold>
            {`Order ID: #${orderId}`}
          </TextDefault>
          <TextDefault small textColor={currentTheme.fontSecondColor}>
            {formattedDate}
          </TextDefault>
        </View>
        <View style={[styles.statusBadge, {backgroundColor: currentTheme.secondaryBackground}]}>
          <TextDefault small textColor={currentTheme.statusColor || 'green'}>
            {orderData.orderStatus}
          </TextDefault>
        </View>
      </View>
      <View style={styles.trackButtonContainer}>
        <TouchableOpacity 
          style={[styles.trackButton, {borderColor: currentTheme.statusColor || 'green'}]}
          onPress={() => navigation.navigate('OrderTracking', { orderId })}>
          
          <TextDefault small textColor={currentTheme.statusColor || 'green'}>
            {t('Track Order')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
    paddingVertical: scale(10),
  },
  backButton: {
    padding: scale(5),
  },
  backIcon: {
    width: scale(20),
    height: scale(20),
  },
  placeholderView: {
    width: scale(20),
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabButton: {
    paddingVertical: scale(15),
    marginRight: scale(30),
    alignItems: 'center',
    position: 'relative',
  },
  activeTab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(3),
    borderRadius: scale(3),
  },
  listContent: {
    padding: scale(15),
  },
  cardContainer: {
    borderRadius: scale(8),
    marginBottom: scale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: scale(15),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantLogo: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
  },
  logoPlaceholder: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfoContainer: {
    flex: 1,
    marginLeft: scale(10),
  },
  statusBadge: {
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    borderRadius: scale(5),
  },
  trackButtonContainer: {
    marginTop: scale(15),
    alignItems: 'flex-end',
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(5),
    borderWidth: 1,
  },
  trackIcon: {
    width: scale(16),
    height: scale(16),
    marginRight: scale(5),
  },
});

export default ActiveOrders;