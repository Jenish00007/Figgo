// components/ProductCard.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { styles } from './commonStyles';
export const ProductCard = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>9.0% OFF</Text>
        </View>
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
    </View>
  );