import { useFocusEffect } from '@react-navigation/native'
import React, { useContext, useCallback, useState } from 'react'
import {
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

// Components
import Products from '../../components/Products/Products'
import NewRestaurantCard from './../../components/Main/FeaturedStores/NewRestaurantCard'
import Spinner from '../../components/Spinner/Spinner'
import ErrorView from '../../components/ErrorView/ErrorView'
import EmptyView from '../../components/EmptyView/EmptyView'

// Context
import { LocationContext } from '../../context/Location'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import AuthContext from '../../context/Auth'

// Utils
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'

const { width } = Dimensions.get('window')

function Favourite() {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)
  const { token } = useContext(AuthContext)
  
  // State
  const [favoriteData, setFavoriteData] = useState({ 
    item: [], 
    store: [] 
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('stores') // Default to 'stores' tab

  // Network-only fetch function
  const fetchFavouriteData = useCallback(async () => {
    try {
      setLoading(true)

      const moduleIds = [1, 4]
      const queryString = moduleIds.map(id => `moduleId=${id}`).join('&')
      
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
        throw new Error('Failed to fetch favourite data')
      }

      const result = await response.json()
      setFavoriteData(result)
      setError(null)
    } catch (err) {
      console.log('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [location, token])

  const handleRemoveFromWishlist = () => {
    // Refresh data after removing from wishlist
    fetchFavouriteData()
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchFavouriteData()
  }

  // Fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchFavouriteData()
    }, [fetchFavouriteData])
  )

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
  
  return (
    <SafeAreaView edges={['bottom']} style={[styles.flex, { backgroundColor: currentTheme.themeBackground }]}>
      {/* Tab Headers */}
      <View style={styles.tabContainer}>
        <TabButton 
          title={t('Stores')} 
          isActive={activeTab === 'stores'} 
          onPress={() => setActiveTab('stores')} 
        />
        <TabButton 
          title={t('Items')} 
          isActive={activeTab === 'items'} 
          onPress={() => setActiveTab('items')} 
        />
      </View>
      
      {/* Content Area */}
      <View style={[styles.flex, { backgroundColor: currentTheme.themeBackground }]}>
        {/* Stores Tab */}
        {activeTab === 'stores' && (
          favoriteData.store && favoriteData.store.length > 0 ? (
            <FlatList
              data={favoriteData.store}
              keyExtractor={(item) => `store-${item.id}`}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.storeCardContainer}>
                  <NewRestaurantCard 
                    {...item}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                    isFavorite={true}
                    theme={currentTheme}
                  />
                </View>
              )}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <EmptyView
              title={'noFavoriteStores'}
              description={'emptyFavStoresDesc'}
              buttonText={'emptyFavBtn'}
            />
          )
        )}
        
        {/* Items Tab */}
        {activeTab === 'items' && (
          favoriteData.item && favoriteData.item.length > 0 ? (
            <FlatList
              data={favoriteData.item}
              keyExtractor={(item) => `item-${item.id}`}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Products 
                  item={item} 
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                  isFavorite={true}
                  theme={currentTheme}
                />
              )}
              contentContainerStyle={styles.listContainer}
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
    justifyContent: 'space-between',
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
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  storeCardContainer: {
    marginBottom: 16,
    width: '100%',
    height: 'auto', // Changed from fixed height to auto
    minHeight: 150, // Adding minimum height instead
    backgroundColor: 'transparent', // Changed from black to transparent
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  }
});

export default Favourite