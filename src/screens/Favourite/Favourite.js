import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useContext, useEffect, useState, useCallback } from 'react'
import {
  FlatList,
  Platform,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Item from '../../components/Main/Stores/Item'
import Spinner from '../../components/Spinner/Spinner'
import { LocationContext } from '../../context/Location'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import Analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import navigationService from '../../routes/navigationService'
import ErrorView from '../../components/ErrorView/ErrorView'
import EmptyView from '../../components/EmptyView/EmptyView'
import AuthContext from '../../context/Auth'

function Favourite() {
  const analytics = Analytics()
  const { t } = useTranslation()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)
  
  const [data, setData] = useState({ store: [], item: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const { token } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('store') // Default to 'store' tab

  // Network-only fetch function
  const fetchFavouriteRestaurants = useCallback(async () => {
    try {
      setLoading(true)

      const moduleIds = [1, 4]
      const queryString = moduleIds.map(id => `moduleId=${id}`).join('&');
      
      const headers = {
        'zoneId': '[1]',
        'latitude': location.latitude?.toString() || '23.79354466376145',
        'longitude': location.longitude?.toString() || '90.41166342794895',
        'Authorization': token ? `Bearer ${token}` : '',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
      
      const response = await fetch(`https://6ammart-admin.6amtech.com/api/v1/customer/wish-list?${queryString}`, {
        method: 'GET',
        headers: headers,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch favourite restaurants')
      }

      const result = await response.json()
      console.log('API Response:', result)
      setData(result)
      setError(null)
    } catch (err) {
      console.log('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [location, token])

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
  }, [navigation, currentTheme, t])

  const handleRemoveFromWishlist = (itemId) => {
    // Refresh the wishlist data
    fetchFavouriteRestaurants();
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
  
  const TabButton = ({ title, isActive, onPress }) => (
    <TouchableOpacity
      style={[
        styles.tabButton, 
        { borderBottomColor: isActive ? currentTheme.yellow || '#FFD700' : 'transparent' }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.tabButtonText, 
        { color: isActive ? currentTheme.newFontcolor : currentTheme.fontSecondColor || '#888888' }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
  
  // Check if both lists are empty
  if ((!data.store || data.store.length === 0) && (!data.item || data.item.length === 0)) {
    return (
      <SafeAreaView edges={['bottom']} style={[styles.flex, { backgroundColor: currentTheme.themeBackground }]}>
        <View style={styles.tabContainer}>
          <TabButton 
            title={t('Stores')} 
            isActive={activeTab === 'store'} 
            onPress={() => setActiveTab('store')} 
          />
          <TabButton 
            title={t('Items')} 
            isActive={activeTab === 'item'} 
            onPress={() => setActiveTab('item')} 
          />
        </View>
        <View style={[styles.flex, { backgroundColor: currentTheme.themeBackground }]}>
          <EmptyView
            title={activeTab === 'store' ? 'noFavoriteStores' : 'noFavoriteItems'}
            description={activeTab === 'store' ? 'emptyFavStoresDesc' : 'emptyFavItemsDesc'}
            buttonText={'emptyFavBtn'}
          />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView edges={['bottom']} style={[styles.flex, { backgroundColor: currentTheme.themeBackground }]}>
      <View style={styles.tabContainer}>
        <TabButton 
          title={t('Stores')} 
          isActive={activeTab === 'store'} 
          onPress={() => setActiveTab('store')} 
        />
        <TabButton 
          title={t('Items')} 
          isActive={activeTab === 'item'} 
          onPress={() => setActiveTab('item')} 
        />
      </View>
      
      <View style={[styles.flex, { backgroundColor: currentTheme.themeBackground }]}>
        {activeTab === 'store' ? (
          data.store && data.store.length > 0 ? (
            <FlatList
              data={data.store}
              keyExtractor={(item) => `store-${item.id}`}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Item 
                  item={item} 
                  isStore={true} 
                  isFavourite={true}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                />
              )}
              ListEmptyComponent={
                <EmptyView
                  title={'noFavoriteStores'}
                  description={'emptyFavStoresDesc'}
                  buttonText={'emptyFavBtn'}
                />
              }
            />
          ) : (
            <EmptyView
              title={'noFavoriteStores'}
              description={'emptyFavStoresDesc'}
              buttonText={'emptyFavBtn'}
            />
          )
        ) : (
          data.item && data.item.length > 0 ? (
            <FlatList
              data={data.item}
              keyExtractor={(item) => `item-${item.id}`}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Item 
                  item={item} 
                  isStore={false} 
                  isFavourite={true}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                />
              )}
              ListEmptyComponent={
                <EmptyView
                  title={'noFavoriteItems'}
                  description={'emptyFavItemsDesc'}
                  buttonText={'emptyFavBtn'}
                />
              }
            />
          ) : (
            <EmptyView
              title={'noFavoriteItems'}
              description={'emptyFavItemsDesc'}
              buttonText={'emptyFavBtn'}
            />
          )
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8'
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 3
  },
  tabButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 20
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#888'
  },
  orderButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  }
});

export default Favourite