import React, { useContext, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, ScrollView, SafeAreaView, StatusBar, FlatList, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useUserContext } from './../../context/User';
import AddToFavourites from './../../components/Favourites/AddtoFavourites';
import { MaterialIcons } from '@expo/vector-icons';
import AuthContext from '../../context/Auth';
import { LocationContext } from '../../context/Location';
import UserContext from '../../context/User';

const { width } = Dimensions.get('window');

const ProductDetail = (profile) => {
    const route = useRoute();
    const navigation = useNavigation();
    const { product } = route.params;
    const { location } = useContext(LocationContext);
    const { token } = useContext(AuthContext);
    const { isLoggedIn } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    
    const flatListRef = useRef(null);
    
    // Check if the product has multiple images
    const hasMultipleImages = product?.images_full_url && product.images_full_url.length > 0;
    const images = hasMultipleImages ? product.images_full_url : [product?.image_full_url];

    // Handle image change when dots are clicked
    const handleImageChange = (index) => {
        setActiveImageIndex(index);
        flatListRef.current?.scrollToIndex({ animated: true, index });
    };

    // Function to handle scroll end to update the active dot indicator
    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        if (index !== activeImageIndex) {
            setActiveImageIndex(index);
        }
    };

    //const { addCartItem } = useUserContext();
    const addToCart = async () => {
        if (!isLoggedIn) {
            navigation.navigate('Login');
            return;
        }

        setLoading(true);

        try {
            const headers = {
                'moduleId': '1',
                'zoneId': '[1]',
                'latitude': location?.latitude?.toString() || '23.79354466376145',
                'longitude': location?.longitude?.toString() || '90.41166342794895',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            const response = await fetch(`https://6ammart-admin.6amtech.com/api/v1/customer/cart/add?guest_id=${profile.guest_id}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    item_id: product.id,
                    quantity: 1, // Adjust quantity as needed
                    price: product.price,
                    name: product.name,
                    image: product.image_full_url,
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
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                
                {/* Product Image Section with Favorite Icon */}
                <View style={styles.imageContainer}>
                    {hasMultipleImages ? (
                        <>
                            <FlatList
                                ref={flatListRef}
                                data={images}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={handleScroll}
                                keyExtractor={(item, index) => `image_${index}`}
                                renderItem={({ item }) => (
                                    <Image 
                                        source={{ uri: item }} 
                                        style={[styles.productImage, { width }]}
                                        resizeMode="cover"
                                    />
                                )}
                            />
                            
                            {/* Dot indicators for image carousel */}
                            <View style={styles.dotContainer}>
                                {images.map((_, index) => (
                                    <TouchableOpacity 
                                        key={index} 
                                        style={[
                                            styles.dot, 
                                            activeImageIndex === index && styles.activeDot
                                        ]}
                                        onPress={() => handleImageChange(index)}
                                    />
                                ))}
                            </View>
                        </>
                    ) : (
                        <Image 
                            source={{ uri: product?.image_full_url }} 
                            style={styles.productImage} 
                            resizeMode="cover"
                        />
                    )}
                    <View style={styles.favIconContainer}>
                        <AddToFavourites product={product} />
                    </View>
                </View>
                
                {/* Product Information Section */}
                <View style={styles.infoSection}>
                    <View style={styles.nameAndPrice}>
                        <Text style={styles.productName}>{product?.name}</Text>
                        <Text style={styles.productPrice}>₹{product?.price}</Text>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.productDescription}>
                            {product?.description || 'No description available for this product.'}
                        </Text>
                    </View>
                </View>
            </ScrollView>
            
            {/* Fixed bottom action buttons */}
            <View style={styles.bottomActions}>
                <TouchableOpacity 
                    style={styles.cartButton} 
                    onPress={() => navigation.navigate('Cart')}
                >
                    <MaterialIcons name="shopping-cart" size={20} color="#fff" />
                    <Text style={styles.buttonText}>View Cart</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.addButton, loading && { opacity: 0.7 }]}  
                    onPress={addToCart}
                    disabled={loading}
                >
                    <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
                    <Text style={styles.buttonText}>{loading ? "Adding..." : "Add to Cart"}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// Styles remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
    },
    scrollView: {
        flex: 1,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#ffffff',
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    dotContainer: {
        position: 'absolute',
        bottom: 15,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        margin: 4,
    },
    activeDot: {
        backgroundColor: '#ffffff',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    favIconContainer: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 8,
        elevation: 5,
    },
    infoSection: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 100,
    },
    nameAndPrice: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    productName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222222',
        flex: 1,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2E7D32',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555555',
        marginBottom: 8,
    },
    descriptionContainer: {
        marginBottom: 20,
    },
    productDescription: {
        fontSize: 14,
        lineHeight: 22,
        color: '#666666',
    },
    bottomActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 8,
    },
    cartButton: {
        flex: 1,
        backgroundColor: '#546E7A',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginRight: 10,
    },
    addButton: {
        flex: 1.5,
        backgroundColor: '#2E7D32',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default ProductDetail;