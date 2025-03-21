import React, { useContext } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { modelId } from 'expo-device';
import AddToFavourites from '../Favourites/AddtoFavourites';
import UserContext from '../../context/User';
import { LocationContext } from '../../context/Location';
import AuthContext from '../../context/Auth';
import ConfigurationContext from '../../context/Configuration';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 30) / 2; // 30 is total horizontal padding (15 on each side)

const Products = ({ item, horizontal = true }) => {
  const navigation = useNavigation();
  const { isLoggedIn } = useContext(UserContext);
  const { location } = useContext(LocationContext);
  const { token } = useContext(AuthContext);
  const configuration = useContext(ConfigurationContext);
  
  // Function to limit the product name to 10 characters
  const getShortenedName = (name) => {
    if (name.length > 10) {
      return name.slice(0, 17) + '...'; // Truncate after 10 characters and add '...'
    }
    return name;
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }

    // Check if product is in stock
    if (item?.stock <= 0) {
      Alert.alert("Out of Stock", "This product is currently unavailable.");
      return;
    }

    try {
      const headers = {
        'moduleId': '1',
        'zoneId': '[1]',
        'latitude': location?.latitude?.toString() || '23.79354466376145',
        'longitude': location?.longitude?.toString() || '90.41166342794895',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // List cart Items
      const cartResponse = await fetch(`https://6ammart-admin.6amtech.com/api/v1/customer/cart/list`, {
        'method': 'GET',
        headers: headers,
      });
      const cartItems = await cartResponse.json();
      const isProductInCart = cartItems?.some(cartItem => cartItem.item_id === item.id);

      if (isProductInCart) {
        Alert.alert("Info", "This product is already in your cart.");
        return;
      }

      const response = await fetch(`https://6ammart-admin.6amtech.com/api/v1/customer/cart/add`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          item_id: item.id,
          quantity: 1,
          price: item.price,
          name: item.name,
          image: item.image_full_url,
          model: "Item"
        }),
      });

      const result = await response.text();
      console.log("Add to Cart Response:", result);

      if (response.ok) {
        Alert.alert("Success", "Product added to cart successfully!");
      } else {
        Alert.alert("Error", result.message || "Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "An error occurred while adding to cart.");
    }
  };

  return (
    <View style={styles.itemWrapper}>
      <TouchableOpacity
        onPress={() => navigation.push('ProductDetail',{product:item })}
      >
        <View style={styles.itemContainer}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={{ uri: item.image_full_url }}
              style={styles.cardImageBG}
              resizeMode="cover"
            >
              <View style={styles.favoritePosition}>
                <AddToFavourites product={item}/>
              </View>
            </ImageBackground>
          </View>
          <Text style={styles.cardTitle}>{getShortenedName(item.name)}</Text>
          <View style={styles.cardFooterRow}>
            <View style={styles.priceContainer}>
              <Text style={styles.cardPriceCurrency}>₹</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
              {item?.discount > 0 && (
                <Text style={styles.discountedPrice}>
                  ₹{(parseFloat(item.price) + parseFloat(item.discount)).toFixed(2)}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={handleAddToCart}>
              <Icon style={styles.addIcon} name="add-circle" size={24} color="#F7CA0F" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  itemWrapper: {
    width: COLUMN_WIDTH,
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  itemContainer: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    elevation: 24,
    height: 220, // Fixed height for consistent card size
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 8,
    height: 120, // Fixed height for image container
  },
  cardImageBG: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  favoritePosition: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
  },
  cardTitle: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    marginBottom: 8,
    overflow: 'hidden',
    height: 40, // Fixed height for title
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto', // Push to bottom of container
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardPriceCurrency: {
    color: 'black',
    fontSize: 15,
    fontWeight: '700',
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '700',
  },
  discountedPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#666',
    marginLeft: 5,
  },
  addIcon: {
    marginLeft: 5,
  },
});

export default Products;