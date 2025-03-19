import React, { useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useApolloClient, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { v5 as uuidv5 } from 'uuid'
import { v1 as uuidv1 } from 'uuid'
import { profile } from '../apollo/queries'
import { LocationContext } from './Location'
import AuthContext from './Auth'
import analytics from '../utils/analytics'
import { useTranslation } from 'react-i18next'


const UserContext = React.createContext({})

export const UserProvider = props => {
  const Analytics = analytics()

  const { t } = useTranslation()

  const {  token,setToken } = useContext(AuthContext)
  const { location, setLocation } = useContext(LocationContext)
  const [cart, setCart] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [isPickup, setIsPickup] = useState(false)
  const [instructions, setInstructions] = useState('')
  const [dataProfile, setProfile] = useState(null)
  const [formetedProfileData, setFormetedProfileData] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [errorProfile, setErrorProfile] = useState(null)
  const networkStatus='1'

console.log(networkStatus)
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!token) {
        setLoadingProfile(false);
        return;
      }
    
     setLoadingProfile(true);
    
      try {
        const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/customer/info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-localization': 'en', 
          }
        });

        const data = await response.json();
        
        if (response.ok) {
      
          setProfile(data); 
          setFormetedProfileData(data)
        } else {
         
          console.log('Error Status:', response.status);  // Log status code for debugging
          console.log('Error Message:', data);  // Log the response body in case of error
          setErrorProfile(data.message || 'Failed to fetch profile');
        }
      } catch (error) {
        // This will catch network errors (e.g., if the device is offline)
        console.log('Network request failed:', error);
        setErrorProfile(error.message || 'Error fetching profile');
      } finally {
        setLoadingProfile(false); // Set loading to false when the fetch process is done
      }
    };
    
    fetchProfileData();
  }, [token]);



  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      setToken(null)
      if (location.id) {
        setLocation({
          label: t('selectedLocation'),
          latitude: location.latitude,
          longitude: location.longitude,
          deliveryAddress: location.deliveryAddress
        })
      }
    } catch (error) {
      console.log('error on logout', error)
    }
  }
//add to cart
 const addToCart = async () => {
        

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
                    item_id: item.id,
                    quantity: 1, // Adjust quantity as needed
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
        } finally {
            setLoading(false);
        }
    };
    
  
  return (
    <UserContext.Provider
      value={{
        isLoggedIn: !!token && dataProfile && !!dataProfile,
        loadingProfile: loadingProfile,
        errorProfile,
        formetedProfileData,
        logout,
       addToCart,
        networkStatus,
        isPickup,
        setIsPickup,
        instructions,
        setInstructions
      }}>
      {props.children}
    </UserContext.Provider>
  )
}
export const useUserContext = () => useContext(UserContext)
export const UserConsumer = UserContext.Consumer
export default UserContext