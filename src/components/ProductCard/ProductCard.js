// components/ProductCard.js
import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Assuming styles are defined here
export const ProductCard = () => (
  <View style={styles.container}>
    <View style={styles.header}>
      {/* Offer label on the left */}
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>9.0% OFF</Text>
      </View>

      {/* Heart icon on the right */}
      <TouchableOpacity>
        <Image source={require('../../assets/icons/fullHeart.png')} style={styles.heartIcon} />
      </TouchableOpacity>
    </View>
    <Image source={require('../../assets/images/ItemsList/2.png')} style={styles.productImage} />
    <Text style={styles.title}>Barilla Orzo Pasta</Text>
    <Text style={styles.unit}>(Pack)</Text>
    <View style={styles.priceContainer}>
      <Text style={styles.originalPrice}>$ 46.00</Text>
      <Text style={styles.price}>$ 43.70</Text>
    </View>

    {/* Add Icon at the bottom-right */}
    <TouchableOpacity style={styles.addIconContainer}>
      <Icon name="plus" size={20} color="#fff" style={styles.addIcon} />
    </TouchableOpacity>
  </View>
);

// Define the styles here
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    width: 180,
    height: 280, // Ensure container has enough space for the bottom icon
    position: 'relative', // Needed for absolute positioning of the add icon
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensure both elements are spaced apart
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: '#FF6347',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  heartIcon: {
    width: 24,
    height: 24,
    tintColor: '#FF6347', // Heart icon color
    position: 'absolute',
    top: 10,
    right: 10, // Position the heart icon to the right
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  unit: {
    fontSize: 12,
    color: '#757575',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#BDBDBD',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    color: '#008800',
    fontWeight: 'bold',
  },

  // Style for Add Icon at bottom-right
  addIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FF6347', // Add icon background color
    borderRadius: 20,
    padding: 8,
    elevation: 3, // Adding some shadow for better visibility on white background
  },
  addIcon: {
    alignSelf: 'center',
  },
});

