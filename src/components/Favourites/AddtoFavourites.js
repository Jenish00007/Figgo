import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationContext } from '../../context/Location'
import AuthContext from '../../context/Auth'


const AddToFavourites = ({ product }) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const { location } = useContext(LocationContext)
    const { token, setToken } = useContext(AuthContext)
    // API URL
    const API_URL = `https://6ammart-admin.6amtech.com/api/v1/customer/wish-list/add`;

    // Function to Add to Favourites
    const addToFavourites = async () => {
        try {
            const headers = {
                'moduleId': '1',
                'zoneId': '[1]',
                'latitude': location?.latitude?.toString() || '23.79354466376145',
                'longitude': location?.longitude?.toString() || '90.41166342794895',
                'Authorization': token ? `Bearer ${token}`: '',
                'Content-Type': 'application/json',
                
              }
            const body = JSON.stringify({ item_id: product.id });
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: headers,
                body: body,
            });

            const result = await response.json();
            console.log("The Api Response for add item", result,"id", product.id)
            
            if (response.status === 200) {
                setIsFavourite(!isFavourite); 
                if (!isFavourite) {
                    Alert.alert("Success", "Product added to Favourites.");
                } else {
                    Alert.alert("Removed", "Product removed from Favourites.");
                }
            } else {
                Alert.alert("Error", result.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Error adding to favourites:", error);
            Alert.alert("Error", "Failed to add to Favourites.");
        }
    };

    return (
        <TouchableOpacity onPress={addToFavourites}>
            <Ionicons
                name={isFavourite ? 'heart' : 'heart-outline'}
                size={28}
                color={isFavourite ? 'red' : 'gray'}
            />
        </TouchableOpacity>
    );
};

export default AddToFavourites;