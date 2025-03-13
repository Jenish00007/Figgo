import { useFocusEffect, useNavigation} from '@react-navigation/native'
import { Text } from 'react-native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import {
  FlatList,
  Platform,
  StatusBar,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Item from '../../components/Main/Stores/Item'
import Spinner from '../../components/Spinner/Spinner'
import { LocationContext } from '../../context/Location'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import Analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import navigationService from '../../routes/navigationService'
import ErrorView from '../../components/ErrorView/ErrorView'
import EmptyView from '../../components/EmptyView/EmptyView'
import AsyncStorage from '@react-native-async-storage/async-storage' // Import AsyncStorage for React Native
import AuthContext from '../../context/Auth'
import { ScrollView } from 'react-native-gesture-handler'

function Favourite() {
  const analytics = Analytics()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)
  
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const { token, setToken } = useContext(AuthContext)


  // Network-only fetch function
  const fetchFavouriteRestaurants = useCallback(async () => {
    try {
      setLoading(true)

      const moduleIds = [1, 4]
      const queryString = moduleIds.map(id => `moduleId=${id}`).join('&');
      
      //const token = await AsyncStorage.getItem('token')
      const headers = {
        // 'moduleId': '1',
        'zoneId': '[1]',
        'latitude': location.latitude?.toString() || '23.79354466376145',
        'longitude': location.longitude?.toString() || '90.41166342794895',
        'Authorization': token ? `Bearer ${token}` : '',
        // These headers ensure a fresh request every time
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
      
      const response = await fetch(`https://6ammart-admin.6amtech.com/api/v1/customer/wish-list?${queryString}`, {
        method: 'GET',
        headers: headers,
        // This ensures the browser doesn't use cached data
        //cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch favourite restaurants')
      }

      const result = await response.json()
      console.log('API Response:',result)
      setData(result)
      setError(null)
    } catch (err) {
      console.log('Fetch error:',err)
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [location])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchFavouriteRestaurants()
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchFavouriteRestaurants()
  }, [fetchFavouriteRestaurants])
  
  // Also fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchFavouriteRestaurants()
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(currentTheme.menuBar)
      }
      StatusBar.setBarStyle(
        themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
      )
    }, [fetchFavouriteRestaurants, currentTheme, themeContext.ThemeValue])
  )

  useEffect(() => {
    async function Track() {
      await analytics.track(analytics.events.NAVIGATE_TO_FAVOURITES)
    }
    Track()
  }, [])

  useEffect(() => {
    navigation.setOptions({
      title: t('titleFavourite'),
      headerTitleAlign: 'center',
      headerRight: null,
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        elevation: 0
      },
      headerTitleAlign: 'center',
      headerRight: null,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=""
          backImage={() => (
            <View>
              <MaterialIcons name="arrow-back" size={25} color={currentTheme.newFontcolor} />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [navigation])

  const emptyView = () => {
    return (
      <EmptyView
        title={'titleEmptyFav'}
        description={'emptyFavDesc'}
        buttonText={'emptyFavBtn'}
      />
    )
  }

  const handleRemoveFromWishlist = (itemId) => {
    // Refresh the wishlist data
    fetchFavouriteRestaurants();
  };

  const renderFavouriteItems = () => {
    // If both item and store arrays are empty, show empty view
    if (data.item.length === 0 && data.store.length === 0) {
      return emptyView();
    }

    return (
      <ScrollView>
        {data.store.length > 0 && (
          <View style={styles(currentTheme).sectionContainer}>
            <Text style={styles(currentTheme).sectionTitle}>{t('favouriteStores')}</Text>
            <FlatList
              data={data.store}
              keyExtractor={(item) => `store-${item.id}`}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <Item 
              item={item} 
              isStore={true} 
              isFavourite={data.store.some(favStore => favStore.id === item.id)} 
              onRemoveFromWishlist={handleRemoveFromWishlist}/>}
              ListEmptyComponent={null}
            />
          </View>
        )}
        
        {data.item.length > 0 && (
          <View style={styles(currentTheme).sectionContainer}>
            <Text style={styles(currentTheme).sectionTitle}>{t('favouriteItems')}</Text>
            <FlatList
              data={data.item}
              keyExtractor={(item) => `item-${item.id}`}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <Item 
              item={item} 
              isStore={false} 
              isFavourite={data.item.some(favItem => favItem.id === item.id)} 
              onRemoveFromWishlist={handleRemoveFromWishlist} />}
              ListEmptyComponent={null}
            />
          </View>
        )}
      </ScrollView>
    );
  };

  if (loading && !refreshing) {
    return (
      <Spinner
        backColor={currentTheme.themeBackground}
        spinnerColor={currentTheme.main}
      />
    )
  }
  
  if (error) return <ErrorView />
  
  return (
    <SafeAreaView edges={['bottom']} style={styles(currentTheme).flex}>
      <View 
        style={[styles().flex, styles(currentTheme).container]}
        contentContainerStyle={styles(currentTheme).contentContainer}
      >
        {renderFavouriteItems()}
      </View>
    </SafeAreaView>
  )
}
export default Favourite