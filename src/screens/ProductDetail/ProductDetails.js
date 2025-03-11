import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddToFavourites from '../../components/Favourites/AddtoFavourites'

const ProductDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { product } = route.params;

    // Function to add product to cart in AsyncStorage
    const addToCart = async () => {
        try {
            const existingCart = await AsyncStorage.getItem('cart');
            let cart = existingCart ? JSON.parse(existingCart) : [];

            // Check if the product already exists in the cart
            const productExists = cart.some(item => item.id === product.id);

            if (!productExists) {
                cart.push(product);
                await AsyncStorage.setItem('cart', JSON.stringify(cart));
                Alert.alert("Success", "Product added to cart!");
            } else {
                Alert.alert("Info", "Product is already in the cart.");
            }
        } catch (error) {
            console.error("Error adding to cart", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Product Card */}
            <View style={styles.card}>
                <Image source={{ uri: product?.image_full_url }} style={styles.productImage} />
                
                {/* Product Details */}
                <Text style={styles.productName}>{product?.name}</Text>
                <Text style={styles.productPrice}>₹ {product?.price}</Text>
                <Text style={styles.productDescription}>
                    {product?.description || 'No description available.'}
                </Text>

                {/* Add to Favourites Icon */}
                <View style={styles.favIconContainer}>
                    <AddToFavourites product={product} />
                    {/* <AddToFavourites product={store} isStore={true} /> */}
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.addButton} onPress={addToCart}>
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
                    <Text style={styles.buttonText}>Go to Cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginBottom: 20,
    },
    productImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 15,
    },
    productName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    productPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#28a745',
        marginVertical: 10,
    },
    productDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    addButton: {
        flex: 1,
        backgroundColor: '#28a745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 10,
    },
    cartButton: {
        flex: 1,
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    favIconContainer: {
        position: 'absolute',
        top: 15,
        right: 15,
    }
});

export default ProductDetail;