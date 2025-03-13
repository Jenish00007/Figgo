import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../context/Auth';

const CartPage = (profile) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);

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
      const response = await fetch(`https://6ammart-admin.6amtech.com/api/v1/customer/cart/list?guest_id=${profile.guest_id}`, {
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
    <View style={styles.card}>
      {item.item && item.item.image && (
        <Image
          source={{ uri: `https://6ammart-admin.6amtech.com/storage/app/public/product/${item.item.image}` }}
          style={styles.image}
        />
      )}
      <View style={styles.info}>
        <Text style={styles.name}>{item.item ? item.item.name : 'Unknown Item'}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
        <Text style={styles.quantity}>Qty: {item.quantity}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyMessage}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id || index}`}
        ListEmptyComponent={<Text style={styles.emptyMessage}>Your cart is empty</Text>}
      />

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Add More Items</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={() => navigation.navigate('OrderSummary', { cartItems })}
        >
          <Text style={styles.buttonText}>Confirm Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  card: {
    flexDirection: 'row',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingBottom: 10
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
    color: '#2E7D32',
    marginVertical: 5
  },
  quantity: {
    color: '#666'
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
    color: '#666'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  addButton: {
    flex: 1,
    backgroundColor: '#546E7A',
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center'
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default CartPage;