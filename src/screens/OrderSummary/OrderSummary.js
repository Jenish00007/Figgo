import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserContext } from './../../context/User';
import OrderSummaryStyles from './OrderSummaryStyles';
import PaymentMethod from '../../components/Payment/PaymentMethod' // Import the new PaymentMethod component

const OrderSummary = ({ route }) => {
  // Get cart data from navigation params
  const { cartItems: navigationCartItems } = route.params || {};
  
  const { cart, clearCart, updateCart } = useUserContext();
  const navigation = useNavigation();
  
  // Initialize with navigation params if available, otherwise use context
  const [cartItems, setCartItems] = useState(navigationCartItems || (cart?.items || []));
  const [totalAmount, setTotalAmount] = useState(0);
  const [activeSection, setActiveSection] = useState('address');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Form state for new address
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    addressType: 'Home',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Load cart items and addresses from context/navigation and storage
  useEffect(() => {
    // If cart items were passed from navigation, use those
    if (navigationCartItems) {
      setCartItems(navigationCartItems);
      calculateTotalAmount(navigationCartItems);
    } else {
      // Otherwise fetch from context
      refreshCartData();
    }
    
    // Load saved addresses
    loadAddresses();
  }, []);

  // Function to refresh cart data from context
  const refreshCartData = () => {
    if (cart && cart.items) {
      setCartItems(cart.items);
      
      // Calculate total amount
      calculateTotalAmount(cart.items);
    }
  };

  // Calculate total amount from cart items
  const calculateTotalAmount = (items) => {
    if (!Array.isArray(items)) {
      setTotalAmount(0);
      return;
    }
    
    const total = items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  };

  // Listen for cart updates from context
  useEffect(() => {
    if (!navigationCartItems && cart && cart.items) {
      setCartItems(cart.items);
      calculateTotalAmount(cart.items);
    }
  }, [cart]);

  // Load addresses from AsyncStorage
  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem('addresses');
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
        
        // If there's at least one address, select the first one by default
        if (parsedAddresses.length > 0) {
          setSelectedAddress(parsedAddresses[0]);
        }
      }
    } catch (error) {
      console.error('Error loading addresses', error);
    }
  };

  // Save a new address
  const saveAddress = async () => {
    // Validate the form
    if (!newAddress.name || !newAddress.phone || !newAddress.pincode || 
        !newAddress.address || !newAddress.city || !newAddress.state) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const address = { ...newAddress, id: Date.now().toString() };
      const updatedAddresses = [...addresses, address];
      
      await AsyncStorage.setItem('addresses', JSON.stringify(updatedAddresses));
      setAddresses(updatedAddresses);
      setSelectedAddress(address);
      setShowAddressForm(false);
      
      // Reset form
      setNewAddress({
        name: '',
        phone: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        addressType: 'Home',
      });
      
      Alert.alert('Success', 'Address saved successfully');
    } catch (error) {
      console.error('Error saving address', error);
      Alert.alert('Error', 'Failed to save address');
    }
  };

  // Handle address selection
  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
  };

  // Handle payment method selection
  const handleSelectPayment = (method) => {
    setPaymentMethod(method);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setNewAddress({ ...newAddress, [field]: value });
  };

  // Handle checkout completion
  const handlePlaceOrder = async () => {
    // Refresh cart data one more time before placing order
    if (!navigationCartItems) {
      refreshCartData();
    }
    
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }
    
    if (!paymentMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }
    
    try {
      // Create order object
      const order = {
        id: Date.now().toString(),
        items: cartItems,
        totalAmount,
        address: selectedAddress,
        paymentMethod,
        date: new Date().toISOString(),
        status: 'Placed'
      };
      
      // Save order to AsyncStorage
      const storedOrders = await AsyncStorage.getItem('orders');
      const orders = storedOrders ? JSON.parse(storedOrders) : [];
      orders.push(order);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart using context if we're using context
      if (!navigationCartItems && clearCart) {
        clearCart();
      }
      
      // Navigate to order confirmation
      navigation.navigate('OrderConfirmation', { order });
    } catch (error) {
      console.error('Error placing order', error);
      Alert.alert('Error', 'Failed to place order');
    }
  };

  // Progress to next section
  const proceedToNext = () => {
    if (activeSection === 'address') {
      if (!selectedAddress) {
        Alert.alert('Error', 'Please select or add a delivery address');
        return;
      }
      setActiveSection('payment');
    } else if (activeSection === 'payment') {
      handlePlaceOrder();
    }
  };

  // Go back to previous section
  const goBack = () => {
    if (activeSection === 'payment') {
      setActiveSection('address');
    } else {
      navigation.goBack();
    }
  };

  // Import styles
  const styles = OrderSummaryStyles;

  return (
    <View style={styles.container}>
      {/* Checkout Progress Bar */}
      <View style={styles.progressBar}>
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, { backgroundColor: '#2874f0' }]}>
            <Text style={styles.stepNumber}>1</Text>
          </View>
          <Text style={[styles.stepText, { color: '#2874f0' }]}>Delivery Address</Text>
        </View>
        <View style={[styles.progressLine, activeSection === 'payment' || activeSection === 'summary' ? styles.activeLine : {}]} />
        <View style={styles.progressStep}>
          <View style={[styles.stepCircle, activeSection === 'payment' || activeSection === 'summary' ? styles.activeStep : {}]}>
            <Text style={styles.stepNumber}>2</Text>
          </View>
          <Text style={[styles.stepText, activeSection === 'payment' || activeSection === 'summary' ? { color: '#2874f0' } : {}]}>Payment Method</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Address Section */}
        {activeSection === 'address' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Delivery Address</Text>
            
            {/* Address List */}
            {addresses.map((address) => (
              <TouchableOpacity 
                key={address.id} 
                style={[
                  styles.addressCard,
                  selectedAddress?.id === address.id && styles.selectedAddressCard
                ]}
                onPress={() => handleSelectAddress(address)}
              >
                <View style={styles.addressTypeContainer}>
                  <Text style={styles.addressType}>{address.addressType}</Text>
                </View>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressDetails}>
                  {address.address}, {address.locality}, {address.city}, {address.state} - {address.pincode}
                </Text>
                <Text style={styles.addressPhone}>Phone: {address.phone}</Text>
                
                {selectedAddress?.id === address.id && (
                  <View style={styles.selectedCheckmark}>
                    <Icon name="check-circle" size={24} color="#2874f0" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
            
            {/* Add New Address Button */}
            {!showAddressForm ? (
              <TouchableOpacity 
                style={styles.addAddressButton} 
                onPress={() => setShowAddressForm(true)}
              >
                <Icon name="add" size={24} color="#2874f0" />
                <Text style={styles.addAddressText}>Add New Address</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.addressForm}>
                <Text style={styles.formTitle}>Add New Address</Text>
                
                <View style={styles.formRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Full Name *"
                    value={newAddress.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Phone Number *"
                    keyboardType="phone-pad"
                    value={newAddress.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                  />
                </View>
                
                <View style={styles.formRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Pincode *"
                    keyboardType="number-pad"
                    value={newAddress.pincode}
                    onChangeText={(text) => handleInputChange('pincode', text)}
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="Locality"
                    value={newAddress.locality}
                    onChangeText={(text) => handleInputChange('locality', text)}
                  />
                </View>
                
                <TextInput
                  style={styles.input}
                  placeholder="Address (House No, Building, Street, Area) *"
                  multiline
                  numberOfLines={3}
                  value={newAddress.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                />
                
                <View style={styles.formRow}>
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="City/Town *"
                    value={newAddress.city}
                    onChangeText={(text) => handleInputChange('city', text)}
                  />
                  <TextInput
                    style={[styles.input, styles.halfInput]}
                    placeholder="State *"
                    value={newAddress.state}
                    onChangeText={(text) => handleInputChange('state', text)}
                  />
                </View>
                
                <View style={styles.addressTypeSelector}>
                  <Text style={styles.addressTypeLabel}>Address Type:</Text>
                  <View style={styles.addressTypeOptions}>
                    <TouchableOpacity
                      style={[
                        styles.addressTypeOption,
                        newAddress.addressType === 'Home' && styles.activeAddressType
                      ]}
                      onPress={() => handleInputChange('addressType', 'Home')}
                    >
                      <Text style={newAddress.addressType === 'Home' ? styles.activeAddressTypeText : styles.addressTypeOptionText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.addressTypeOption,
                        newAddress.addressType === 'Work' && styles.activeAddressType
                      ]}
                      onPress={() => handleInputChange('addressType', 'Work')}
                    >
                      <Text style={newAddress.addressType === 'Work' ? styles.activeAddressTypeText : styles.addressTypeOptionText}>Work</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.formButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => setShowAddressForm(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton} 
                    onPress={saveAddress}
                  >
                    <Text style={styles.saveButtonText}>Save Address</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
        
        {/* Payment Method Section - Now using the PaymentMethod component */}
        {activeSection === 'payment' && (
          <PaymentMethod
            selectedMethod={paymentMethod}
            onSelectMethod={handleSelectPayment}
          />
        )}
        
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Price Details</Text>
          <View style={styles.summaryRow}>
            <Text>Price ({cartItems.length} items)</Text>
            <Text>₹{totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Delivery Charges</Text>
            <Text style={styles.freeDelivery}>FREE</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalText}>₹{totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Bottom Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>₹{totalAmount.toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.proceedButton} onPress={proceedToNext}>
          <Text style={styles.proceedButtonText}>
            {activeSection === 'address' ? 'Continue' : 'Place Order'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderSummary;