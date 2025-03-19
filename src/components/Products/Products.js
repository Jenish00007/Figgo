import React, { useContext } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { modelId } from 'expo-device';
import AddToFavourites from '../Favourites/AddtoFavourites';
import UserContext from '../../context/User';

const Products = ({ item }) => {
  const navigation = useNavigation();
  const{addCartItem}=useContext(UserContext);
  
  // Function to limit the product name to 10 characters
  const getShortenedName = (name) => {
    if (name.length > 10) {
      return name.slice(0, 17) + '...'; // Truncate after 10 characters and add '...'
    }
    return name;
  };
      
  return (
    <View style={styles.container}>
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
              <Text style={styles.cardPriceCurrency}>₹</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
              <TouchableOpacity onPress={() => addCartItem(item)}>
                <Icon style={styles.addIcon} name="add" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  itemWrapper: {
    flex: 1,
    marginBottom: 10,
  },
  itemContainer: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: {
      width: 0,
      height: 11,
    },
    elevation: 24,
    marginBottom: 10,
    width: 150,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 10,
  },
  cardImageBG: {
    width: '100%',
    height: 130,
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
    fontSize: 16,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    marginBottom: 5,
    overflow: 'hidden',
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
  },
  cardPriceCurrency: {
    color: 'black',
    fontSize: 18,
    fontWeight: '700',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  addIcon: {
    marginLeft: 70,
  },
});

export default Products;