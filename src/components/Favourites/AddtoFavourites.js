import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationContext } from '../../context/Location';
import AuthContext from '../../context/Auth';

const AddToFavourites = ({ product, isStore = false }) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(false);
    const { location } = useContext(LocationContext);
    const { token } = useContext(AuthContext);

    // Check if product is already in favorites on component mount
    useEffect(() => {
        if (token) {
            checkFavouriteStatus();
        }
    }, [token, product?.id]);

    // Function to check if the product is already in favorites
    const checkFavouriteStatus = async () => {
        if (!token) return;
        
        try {
            const headers = {
                'moduleId': '1',
                'zoneId': '[1]',
                'latitude': location?.latitude?.toString() || '23.79354466376145',
                'longitude': location?.longitude?.toString() || '90.41166342794895',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/customer/wish-list', {
                method: 'GET',
                headers: headers,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Wishlist response:", result);
                // Add this at the beginning of toggleFavourites
                console.log("Toggle favorites for:", isStore ? "Store" : "Item", product.id);
                
                // Check the correct path in the API response
                const itemList = isStore ? result?.store || [] : result?.item || [];
                
                // Check if the current product is in the wishlist
                const isInWishlist = itemList.some(item => item.id === product?.id);
                console.log("PRoduct Token", token)
                setIsFavourite(isInWishlist);
            }
        } catch (error) {
            console.error("Error checking favourite status:", error);
        }
    };

    // Function to toggle favorites
    const toggleFavourites = async () => {
        if (loading || !token) {
            if (!token) {
                Alert.alert("Please Login", "You need to be logged in to add items to favorites.");
            }
            return;
        }
        
        setLoading(true);
        
        try {
            // Determine whether to add or remove from wishlist based on current state
            const endpoint = isFavourite
                ? `https://6ammart-admin.6amtech.com/api/v1/customer/wish-list/remove?${isStore ? 'store_id' : 'item_id'}=${product?.id}`
                : `https://6ammart-admin.6amtech.com/api/v1/customer/wish-list/add?${isStore ? 'store_id' : 'item_id'}=${product?.id}`;
                
            const method = isFavourite ? 'DELETE' : 'POST';
            
            const headers = {
                'moduleId': '1',
                'zoneId': '[1]',
                'latitude': location?.latitude?.toString() || '23.79354466376145',
                'longitude': location?.longitude?.toString() || '90.41166342794895',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            };
            
            const response = await fetch(endpoint, {
                method: method,
                headers: headers,
            });

            const result = await response.json();
            console.log(`${isFavourite ? 'Remove from' : 'Add to'} favourites response:`, result,"id is", product.id);
           
            if (response.ok) {
                // Only update state if API call was successful
                setIsFavourite(!isFavourite);
                Alert.alert(
                    isFavourite ? "Removed" : "Success",
                    isFavourite ? "Removed from Favourites." : "Added to Favourites."
                );
            } else {
                Alert.alert("Error", result.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error toggling favourites:", error);
            Alert.alert("Error", "Failed to update Favourites.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity onPress={toggleFavourites} disabled={loading}>
            <Ionicons
                name={isFavourite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavourite ? 'red' : 'gray'}
            />
        </TouchableOpacity>
    );
};

export default AddToFavourites;