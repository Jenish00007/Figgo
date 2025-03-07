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
  
  //const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxOSIsImp0aSI6Ijg1NjRlYWE2YjU1MzNlZDRhOWNjZjM5OTQwZGExYTA5NTBhYWJjZjdhYzVkMTA3MGQ2NDQwNzE2N2IxN2RkZTE5OTkyNWQzZDNkODJjYmQ5IiwiaWF0IjoxNzQxMjUzMTE2Ljg4MjQ0OCwibmJmIjoxNzQxMjUzMTE2Ljg4MjQ1MSwiZXhwIjoxNzcyNzg5MTE2Ljg3ODUwMiwic3ViIjoiMzIiLCJzY29wZXMiOltdfQ.DlOX8MynZbowWs0mQX9wTIKIJkRDY_f9JhaHQrNTw6L8hLLtavfCZSisXwFu3yajjGZfvwXBDXHZmQq7c24G5CmrM3lTs_tJA06Dh_sBviwSXvk8cZ0ID9B0s9MqNqIEV7WO9W9SsnUtOex-T7XPKcan4PChuGQG2IcwI-OSh7SAKXUmr4mc6TEZGpCvupI3M2G3HLGoSO8s1OeK-srGc5l7Ida0lUsgYaxubNUl8MP_p3W7TNkYbM0ZUVe2ckIpfWM5sCwsp7V46Fb63VzrkY-HWJjk3fkWPp6hNcBxJTStHdbKOhTDkOm_9kVKt9W_G3heyoBKk7G7f7Bwwb0jTS1WGj4TspYec2j5RAwl5oORzXWtqNDF9mC0vxL3C1-28_9VsB1E82V1gaKkWEt4Q1RQ059WCbDgAuZdS2jFsqL7fxCm3seTAfi7VWFYqeIK_GSM84wdAPq-sztaQl_zGvCAAASeXAy4_9T7SBcoJ5RVX_CZWgoGpT1dU-9Sa8pMLBx2qDbojiypjyHMGGdMtCOZfS4Cc0Bvd4TkxYwobx595ubMiJ6d2plp-2oFdYUQ1vDlvTGXoiv_x9Wg8oa7ZDgkX4wW8DnwEndA2KwKY8zbg-As6ug4T2E9Eu8qBj8zb_ndNwvXVvVxVYLK0pn_tHqhFjrKknLVLyqTMNWNnK4"; 
  
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