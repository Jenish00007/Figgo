import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useUserContext } from './../../context/User';
import AddToFavourites from './../../components/Favourites/AddtoFavourites';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ProductDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { product } = route.params;
    const { addCartItem } = useUserContext();
    
    // State to track current image index for multiple images
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    
    // Determine if we have multiple images or a single image
    const hasMultipleImages = product?.images_full_url && Array.isArray(product.images_full_url) && product.images_full_url.length > 0;
    
    // Images to display - either the array or a single-item array with the one image
    const imagesToDisplay = hasMultipleImages 
        ? product.images_full_url 
        : [product?.image_full_url];
    
    // Handle image change when scrolling horizontally
    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setCurrentImageIndex(index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                
                {/* Product Image Section with Favorite Icon */}
                <View style={styles.imageContainer}>
                    {/* Horizontal ScrollView for images */}
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {imagesToDisplay.map((imageUrl, index) => (
                            <Image 
                                key={`image-${index}`}
                                source={{ uri: imageUrl }} 
                                style={[styles.productImage, { width }]} 
                                resizeMode="cover"
                            />
                        ))}
                    </ScrollView>
                    
                    {/* Indicator dots for multiple images */}
                    {hasMultipleImages && imagesToDisplay.length > 1 && (
                        <View style={styles.indicatorContainer}>
                            {imagesToDisplay.map((_, index) => (
                                <View 
                                    key={`indicator-${index}`} 
                                    style={[
                                        styles.indicator, 
                                        index === currentImageIndex && styles.activeIndicator
                                    ]} 
                                />
                            ))}
                        </View>
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
                    style={styles.addButton} 
                    onPress={() => addCartItem(product)}
                >
                    <MaterialIcons name="add-shopping-cart" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

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
        height: 300,
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 15,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        marginHorizontal: 4,
    },
    activeIndicator: {
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