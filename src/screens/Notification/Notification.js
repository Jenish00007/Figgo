import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useCallback, useState } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { LocationContext } from '../../context/Location'

import AuthContext from '../../context/Auth'

function Notification () {

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)
    
  const { token, setToken } = useContext(AuthContext)
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Network-only fetch function
  const fetchNotification = useCallback(async () => {
    try {
      setLoading(true)

      // Get the auth token
      //const token = await AsyncStorage.getItem('token')
      
      // Headers based on the screenshot with cache control headers
      const headers = {
        'moduleId': '1',
        'zoneId': '[1]',
        'latitude': location.latitude?.toString() || '23.79354466376145',
        'longitude': location.longitude?.toString() || '90.41166342794895',
        'Authorization': token ? `Bearer ${token}` : '',
        // These headers ensure a fresh request every time
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
      
      const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/customer/notifications', {
        method: 'GET',
        headers: headers,
        // This ensures the browser doesn't use cached data
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch Notifcation')
      }

      const result = await response.json()
      console.log('API Response:',result)
      setNotifications(result)
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
    fetchNotification()
  }

  // Fetch data when component mounts
  useEffect(() => {
    fetchNotification()
  }, [fetchNotification])

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.themeBackground }]}>
     {notifications.length === 0 ? (
      <Text style={[styles.message, { color: currentTheme.newFontcolor }]}>
        No Orders Yet
      </Text> ) : (
                <FlatList
                data={notifications}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 15, borderBottomWidth: 1, borderColor: '#ddd' }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.data.title}</Text>
                    <Text style={{ fontSize: 14, color: 'gray' }}>{item.data.description}</Text>
                    </View>
                )}
                />
            )}
    </View>
  )
}

export default Notification

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})