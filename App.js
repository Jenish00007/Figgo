import React, { useState, useEffect, useReducer, useRef } from 'react'
import AppContainer from './src/routes'
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import * as Font from 'expo-font'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as SplashScreen from 'expo-splash-screen'
import { getCurrentLocation } from './src/ui/hooks/useLocation'
import { LocationContext } from './src/context/Location'
import AnimatedSplash from './src/components/AnimatedSplash'

import {
  BackHandler,
  Platform,
  StatusBar,
  LogBox,
  StyleSheet,
  ActivityIndicator,
  I18nManager,
  View,
  Text,
  TouchableOpacity
} from 'react-native'
import { ApolloProvider } from '@apollo/client'
import { exitAlert } from './src/utils/androidBackButton'
import FlashMessage from 'react-native-flash-message'
import setupApolloClient from './src/apollo/index'
import ThemeReducer from './src/ui/ThemeReducer/ThemeReducer'
import ThemeContext from './src/ui/ThemeContext/ThemeContext'
import { ConfigurationProvider } from './src/context/Configuration'
import { UserProvider } from './src/context/User'
import { AuthProvider } from './src/context/Auth'
import { theme as Theme } from './src/utils/themeColors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import 'expo-dev-client'
import useEnvVars, { isProduction } from './environment'
import { requestTrackingPermissions } from './src/utils/useAppTrackingTrasparency'
import { OrdersProvider } from './src/context/Orders'
import { MessageComponent } from './src/components/FlashMessage/MessageComponent'
import * as Updates from 'expo-updates'
import ReviewModal from './src/components/Review'
import { NOTIFICATION_TYPES } from './src/utils/enums'
import { useColorScheme } from 'react-native'
import useWatchLocation from './src/ui/hooks/useWatchLocation'

LogBox.ignoreLogs([
  'Warning: ...',
  'Sentry Logger ',
  'Constants.deviceYearClass'
]) // Ignore log notification by message
LogBox.ignoreAllLogs() // Ignore all log notifications


Notifications.setNotificationHandler({
  handleNotification: async notification => {
    return {
      shouldShowAlert: notification?.request?.content?.data?.type !== NOTIFICATION_TYPES.REVIEW_ORDER,
      shouldPlaySound: false,
      shouldSetBadge: false
    }
  }
})

export default function App() {
  const reviewModalRef = useRef()
  const [appIsReady, setAppIsReady] = useState(false)
  const [location, setLocation] = useState(null)
  const notificationListener = useRef()
  const responseListener = useRef()
  const [orderId, setOrderId] = useState()
  const systemTheme = useColorScheme()
  const [theme, themeSetter] = useReducer(ThemeReducer, systemTheme === 'dark' ? 'Dark' : 'Pink')
  const [isUpdating, setIsUpdating] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [locationError, setLocationError] = useState(null)
  const [isInitializingLocation, setIsInitializingLocation] = useState(true)
  useWatchLocation()

  useEffect(() => {
    const loadAppData = async () => {
      try {
        await SplashScreen.preventAutoHideAsync()
        await Font.loadAsync({
          MuseoSans300: require('./src/assets/font/MuseoSans/MuseoSans300.ttf'),
          MuseoSans500: require('./src/assets/font/MuseoSans/MuseoSans500.ttf'),
          MuseoSans700: require('./src/assets/font/MuseoSans/MuseoSans700.ttf')
        })

        // Check if location exists in AsyncStorage first
        const storedLocation = await AsyncStorage.getItem('location')
        if (storedLocation) {
          setLocation(JSON.parse(storedLocation))
          setIsInitializingLocation(false)
          setAppIsReady(true)
          return
        }

        // If no stored location, try to get current location
        const { coords, error, message } = await getCurrentLocation()
        if (!error && coords) {
          try {
            const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
            const response = await fetch(apiUrl)
            const data = await response.json()
            
            if (!data.error) {
              let address = data.display_name
              if (address.length > 21) {
                address = address.substring(0, 21) + '...'
              }
              
              const newLocation = {
                label: 'currentLocation',
                latitude: coords.latitude,
                longitude: coords.longitude,
                deliveryAddress: address
              }
              setLocation(newLocation)
              await AsyncStorage.setItem('location', JSON.stringify(newLocation))
              setIsInitializingLocation(false)
              setAppIsReady(true)
            } else {
              setLocationError('Failed to get address from coordinates')
              setIsInitializingLocation(false)
              setAppIsReady(true)
            }
          } catch (e) {
            console.warn('Error getting address:', e)
            setLocationError('Failed to get address from coordinates')
            setIsInitializingLocation(false)
            setAppIsReady(true)
          }
        } else {
          setLocationError(message)
          setIsInitializingLocation(false)
          setAppIsReady(true)
        }

        BackHandler.addEventListener('hardwareBackPress', exitAlert)
      } catch (e) {
        console.warn('Error in loadAppData:', e)
        setLocationError('Failed to initialize app')
        setIsInitializingLocation(false)
        setAppIsReady(true)
      }
    }

    loadAppData()

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', exitAlert)
    }
  }, [])

  useEffect(() => {
    try {
      themeSetter({ type: systemTheme === 'dark' ? 'Dark' : 'Pink' })
    } catch (error) {
      // Error retrieving data
      console.log('Theme Error : ', error.message)
    }
  }, [systemTheme])

  useEffect(() => {
    if (!appIsReady) return

    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync()
    }

    hideSplashScreen()
  }, [appIsReady])

  useEffect(() => {
    if (!location) return

    const saveLocation = async () => {
      await AsyncStorage.setItem('location', JSON.stringify(location))
    }

    saveLocation()
  }, [location])

  useEffect(() => {
    requestTrackingPermissions()
  }, [])


  const client = setupApolloClient()
  const shouldBeRTL = false;
  if (shouldBeRTL !== I18nManager.isRTL && Platform.OS !== 'web') {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    Updates.reloadAsync();
  }
 
  useEffect(() => {
    // eslint-disable-next-line no-undef
    if (__DEV__) return
      ; (async () => {
        const { isAvailable } = await Updates.checkForUpdateAsync()
        if (isAvailable) {
          try {
            setIsUpdating(true)
            const { isNew } = await Updates.fetchUpdateAsync()
            if (isNew) {
              await Updates.reloadAsync()
            }
          } catch (error) {
            console.log('error while updating app', JSON.stringify(error))
          } finally {
            setIsUpdating(false)
          }
        }
      })()
  }, [])

  if (isUpdating) {
    return (
      <View
        style={[
          styles.flex,
          styles.mainContainer,
          { backgroundColor: Theme[theme].startColor }
        ]}
      >
        <TextDefault textColor={Theme[theme].white} bold>
          Please wait while app is updating
        </TextDefault>
        <ActivityIndicator size='large' color={Theme[theme].white} />
      </View>
    )
  }

  useEffect(() => {
    registerForPushNotificationsAsync()

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      if (notification?.request?.content?.data?.type === NOTIFICATION_TYPES.REVIEW_ORDER) {
        const id = notification?.request?.content?.data?._id
        if (id) {
          setOrderId(id)
          reviewModalRef?.current?.open()
        }
      }
    })

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      if (response?.notification?.request?.content?.data?.type === NOTIFICATION_TYPES.REVIEW_ORDER) {
        const id = response?.notification?.request?.content?.data?._id
        if (id) {
          setOrderId(id)
          reviewModalRef?.current?.open()
        }
      }
    })
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const onOverlayPress = () => {
    reviewModalRef?.current?.close()
  }

  const handleSplashComplete = () => {
    setShowSplash(false)
  }

  if (!appIsReady || showSplash || isInitializingLocation) {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          backgroundColor="#F7CA0F"
          barStyle="dark-content"
        />
        <AnimatedSplash onAnimationComplete={handleSplashComplete} />
      </View>
    )
  }

  if (locationError) {
    return (
      <View style={[styles.flex, styles.mainContainer, { backgroundColor: Theme[theme].startColor }]}>
        <TextDefault textColor={Theme[theme].white} bold style={{ textAlign: 'center', marginBottom: 20 }}>
          {locationError}
        </TextDefault>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: Theme[theme].white }]}
          onPress={async () => {
            try {
              setIsInitializingLocation(true)
              const { coords, error, message } = await getCurrentLocation()
              if (!error && coords) {
                const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
                const response = await fetch(apiUrl)
                const data = await response.json()
                
                if (!data.error) {
                  let address = data.display_name
                  if (address.length > 21) {
                    address = address.substring(0, 21) + '...'
                  }
                  
                  const newLocation = {
                    label: 'currentLocation',
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    deliveryAddress: address
                  }
                  setLocation(newLocation)
                  await AsyncStorage.setItem('location', JSON.stringify(newLocation))
                  setLocationError(null)
                } else {
                  setLocationError('Failed to get address from coordinates')
                }
              } else {
                setLocationError(message)
              }
            } catch (e) {
              console.warn('Error in location retry:', e)
              setLocationError('Failed to get location. Please try again.')
            } finally {
              setIsInitializingLocation(false)
            }
          }}
        >
          <TextDefault textColor={Theme[theme].startColor} bold>
            Enable Location
          </TextDefault>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={client}>
        <ThemeContext.Provider
          value={{ ThemeValue: theme, dispatch: themeSetter }}>
          <StatusBar
            backgroundColor={Theme[theme].newheaderColor}
            barStyle={theme === 'Dark' ? 'light-content' : 'dark-content'}
          />
          <LocationContext.Provider value={{ location, setLocation }}>
            <ConfigurationProvider>
              <AuthProvider>
                <UserProvider>
                  <OrdersProvider>
                    <AppContainer />
                    <ReviewModal ref={reviewModalRef} onOverlayPress={onOverlayPress} theme={Theme[theme]} orderId={orderId} />
                  </OrdersProvider>
                </UserProvider>
              </AuthProvider>
            </ConfigurationProvider>
          </LocationContext.Provider>
          <FlashMessage MessageComponent={MessageComponent} />
        </ThemeContext.Provider>
      </ApolloProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  mainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5
  }
})
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C'
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
    }
  } else {
    alert('Must use physical device for Push Notifications')
  }
}
// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { type: NOTIFICATION_TYPES.REVIEW_ORDER, _id: '65e068b2150aab288f2b821f' }
//     },
//     trigger: { seconds: 10 }
//   })
// }

