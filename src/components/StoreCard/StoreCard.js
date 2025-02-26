// components/StoreCard.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { styles } from './commonStyles'; // Assuming common styles are defined in this file

const StoreCard = () => (
  <View style={styles.container}>
    <View style={styles.iconContainer}>
      <Image source={require('../../assets/images/ItemsList/2.png')} style={styles.icon} />
    </View>
    <View style={styles.contentContainer}>
      <Text style={styles.distance}>10+ km From You</Text>
      <Text style={styles.title}>Sk General Store</Text>
      <Text style={styles.price}>Start From $ 0.00</Text>
    </View>
    <TouchableOpacity style={styles.heartContainer}>
      <Image source={require('../../assets/icons/fullHeart.png')} style={styles.heartIcon} />
    </TouchableOpacity>
  </View>
);

export default StoreCard; // Default export
