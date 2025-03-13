import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { modelId } from 'expo-device';

const Products = ({ name,image_full_url,price }) => {
  const navigation = useNavigation();

  // Function to limit the product name to 10 characters
  const getShortenedName = (name) => {
    if (name.length > 10) {
      return name.slice(0, 17) + '...'; // Truncate after 10 characters and add '...'
    }
    return name;
  };
  
  const item={name,image_full_url,price}

  return (
    <View style={styles.container}>
     
        <View style={styles.itemWrapper}>
          <TouchableOpacity
            onPress={() => navigation.push('ProductDetail',{product:item })}
          >
            <View style={styles.itemContainer}>
              <ImageBackground
                source={{ uri: item.image_full_url }}
                style={styles.cardImageBG}
                resizeMode="cover"
              >
                {/* Optional: Add Rating Icon or other components here */}
              </ImageBackground>
              <Text style={styles.cardTitle}>{getShortenedName(item.name)}</Text>
              <View style={styles.cardFooterRow}>
                <Text style={styles.cardPriceCurrency}>₹</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
                <TouchableOpacity>
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
    width:150,
  
  },
  cardImageBG: {
    width: '100%', // Ensure the image fills the card width
    height: 130, // Fixed height for the image
    marginBottom: 10, // Adjust margin to create space between image and text
    borderRadius: 8, // Optionally, add rounded corners to the image
    overflow: 'hidden',
  },
  cardTitle: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold', // Make title bold for better emphasis
    width: '100%',
    textAlign: 'center',
    marginBottom: 5, // Space between title and footer
    overflow: 'hidden', // Ensure text truncates properly
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start', // Ensure price and icon are spaced out
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
