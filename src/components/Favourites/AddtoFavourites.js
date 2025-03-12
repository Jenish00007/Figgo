import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationContext } from '../../context/Location';
import AuthContext from '../../context/Auth';

const AddToFavourites = ({ product, restaurantId }) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(false);
    const { location } = useContext(LocationContext);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            checkFavouriteStatus();
        }
    }, [token, product?.id, restaurantId]);


    //To check whether the product is in wishlist or not
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
                const itemList = restaurantId ? result?.store || [] : result?.item || [];
                const isInWishlist = itemList.some(item => item.id === (restaurantId || product?.id));
                setIsFavourite(isInWishlist);
            }
        } catch (error) {
            console.error("Error checking favourite status:", error);
        }
    };

    const toggleFavourites = async () => {
        if (loading || !token) {
            if (!token) {
                Alert.alert("Please Login", "You need to be logged in to add items to favorites.");
            }
            return;
        }
        setLoading(true);
        try {
            const idKey = restaurantId ? 'store_id' : 'item_id';
            const idValue = restaurantId || product?.id;
            const endpoint = isFavourite
                ? `https://6ammart-admin.6amtech.com/api/v1/customer/wish-list/remove?${idKey}=${idValue}`
                : `https://6ammart-admin.6amtech.com/api/v1/customer/wish-list/add?${idKey}=${idValue}`;
            const method = isFavourite ? 'DELETE' : 'POST';
            const headers = {
                'moduleId': '1',
                'zoneId': '[1]',
                'latitude': location?.latitude?.toString() || '23.79354466376145',
                'longitude': location?.longitude?.toString() || '90.41166342794895',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };

            const response = await fetch(endpoint, {
                method: method,
                headers: headers,
            });
            const text = await response.text();
            console.log("Api response:", text, "With", idKey, ":", idValue );
            const result = JSON.parse(text);

            if (response.ok) {
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
