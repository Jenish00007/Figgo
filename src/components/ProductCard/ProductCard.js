// components/ProductCard.js
import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export const ProductCard = ({ 
  item,
  discount,
  onAddToCart,
  imageUrl,
  title,
  originalPrice,
  price,
  unit
}) => {
  // Handle unit display
  const getUnitDisplay = () => {
    if (!unit) return '';
    if (typeof unit === 'string') return unit;
    if (typeof unit === 'object' && unit.translations) {
      // Get the first translation or fallback to empty string
      const firstTranslation = Object.values(unit.translations)[0];
      return firstTranslation?.name || '';
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Offer label on the left */}
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discount}% OFF</Text>
          </View>
        )}

        {/* Heart icon on the right */}
        <TouchableOpacity>
          <Icon name="heart" size={24} color="#FF6347" style={styles.heartIcon} />
        </TouchableOpacity>
      </View>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.productImage} 
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.unit}>{getUnitDisplay()}</Text>
      <View style={styles.priceContainer}>
        {discount > 0 && (
          <Text style={styles.originalPrice}>₹ {originalPrice}</Text>
        )}
        <Text style={styles.price}>₹ {price}</Text>
      </View>

      {/* Add Icon at the bottom-right */}
      <TouchableOpacity 
        style={styles.addIconContainer}
        onPress={onAddToCart}
      >
        <Icon name="plus" size={20} color="#fff" style={styles.addIcon} />
      </TouchableOpacity>
    </View>
  );
};

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
    marginHorizontal: 8,
    width: '100%',
    height: 280,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    zIndex: 1,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
  addIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#FF6347',
    borderRadius: 20,
    padding: 8,
    elevation: 3,
  },
  addIcon: {
    alignSelf: 'center',
  },
});

