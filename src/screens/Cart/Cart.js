import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity,
  useColorScheme
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../context/Auth';
import { theme } from '../../utils/themeColors'; // Import the theme object

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);
  
  // Get the current color scheme (system preference)
  const colorScheme = useColorScheme();
  
  // Use the Dark theme if system preference is dark, otherwise use Pink theme
  const currentTheme = colorScheme === 'dark' ? theme.Dark : theme.Pink;

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const headers = {
        'moduleId': '1',
        'Authorization': `Bearer ${token}`,
        'zoneId': '[3,1]',
        'X-localization': 'en',
        'latitude': '23.793544663762145',
        'longitude': '90.41166342794895'
      };    
      const response = await fetch(`https://6ammart-admin.6amtech.com/api/v1/customer/cart/list`, {
        'method': 'GET',
        headers: headers,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      console.log('Cart data received:', data);

      setCartItems(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      Alert.alert('Error', 'Failed to fetch cart items');
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, { 
      borderColor: currentTheme.borderColor,
      backgroundColor: currentTheme.itemCardColor
    }]}>
      {item.item && item.item.image && (
        <Image
          source={{ uri: `https://6ammart-admin.6amtech.com/storage/app/public/product/${item.item.image}` }}
          style={styles.image}
        />
      )}
      <View style={styles.info}>
        <Text style={[styles.name, { color: currentTheme.fontMainColor }]}>
          {item.item ? item.item.name : 'Unknown Item'}
        </Text>
        <Text style={[styles.price, { color: currentTheme.primary }]}>
          ₹{item.price}
        </Text>
        <Text style={[styles.quantity, { color: currentTheme.fontSecondColor }]}>
          Qty: {item.quantity}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, 
        { backgroundColor: currentTheme.themeBackground }]}>
        <ActivityIndicator size="large" color={currentTheme.primary} />
      </View>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.themeBackground }]}>
        <Text style={[styles.emptyMessage, { color: currentTheme.fontSecondColor }]}>
          Your cart is empty
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.themeBackground }]}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id || index}`}
        ListEmptyComponent={
          <Text style={[styles.emptyMessage, { color: currentTheme.fontSecondColor }]}>
            Your cart is empty
          </Text>
        }
      />

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.addButton, { 
            backgroundColor: currentTheme.buttonBackgroundPink,
            shadowColor: currentTheme.shadowColor
          }]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { 
            color: currentTheme.buttonTextPink
          }]}>Add More Items</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.confirmButton, { 
            backgroundColor: currentTheme.buttonBackground,
            shadowColor: currentTheme.shadowColor
          }]} 
          onPress={() => navigation.navigate('OrderSummary', { cartItems })}
        >
          <Text style={[styles.buttonText, { 
            color: currentTheme.buttonText
          }]}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderRadius: 8,
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0'
  },
  info: {
    marginLeft: 15,
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  price: {
    marginVertical: 5,
    fontWeight: '600'
  },
  quantity: {
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  addButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600'
  }
});

export default CartPage;