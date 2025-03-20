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
        console.log("Data       ",data)
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

  const clearCart = async () => {
  
    console.log('clearCart')
  }

  const addQuantity = async (key, quantity = 1) => {
  
    console.log('addQuantity')
  }

  const deleteItem = async key => {
    
    console.log('deleteItem')
  }

  const removeQuantity = async key => {
   
    console.log('removeQuantity')
  }

  const checkItemCart = itemId => {
  
    console.log('checkItemCart')
  }
  
  const numberOfCartItems = () => {
 
  }

  const addCartItem = async (
    id,
    variation,
    quantity = 1,
    addons = [],
    clearFlag,
    specialInstructions = ''
  ) => {
   
  }

  const updateCart = async cart => {

  }

  const setCartRestaurant = async id => {

  }
  return (
    <UserContext.Provider
      value={{
        isLoggedIn: !!token && dataProfile && !!dataProfile,
        loadingProfile: loadingProfile,
        errorProfile,
        formetedProfileData,
        logout,
        cart,
        cartCount: numberOfCartItems(),
        clearCart,
        updateCart,
        addQuantity,
        removeQuantity,
        addCartItem,
        checkItemCart,
        deleteItem,
        restaurant,
        setCartRestaurant,
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