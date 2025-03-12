import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PaymentMethod = ({ selectedMethod, onSelectMethod }) => {
  // Payment method options
  const paymentOptions = [
    { id: 'upi', icon: 'account-balance-wallet', label: 'UPI' },
    { id: 'card', icon: 'credit-card', label: 'Credit / Debit Card' },
    { id: 'netbanking', icon: 'account-balance', label: 'Net Banking' },
    { id: 'cod', icon: 'money', label: 'Cash on Delivery' }
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Select Payment Method</Text>
      
      {/* Payment Options */}
      {paymentOptions.map(option => (
        <TouchableOpacity 
          key={option.id}
          style={[
            styles.paymentOption, 
            selectedMethod === option.id && styles.selectedPayment
          ]} 
          onPress={() => onSelectMethod(option.id)}
        >
          <Icon name={option.icon} size={24} color="#2874f0" />
          <Text style={styles.paymentOptionText}>{option.label}</Text>
          {selectedMethod === option.id && (
            <Icon name="check-circle" size={20} color="#2874f0" style={styles.checkIcon} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedPayment: {
    borderColor: '#2874f0',
    backgroundColor: '#f5f8ff',
  },
  paymentOptionText: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 'auto',
  }
});

export default PaymentMethod;