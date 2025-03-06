import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useCallback, useState } from 'react'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

import AuthContext from '../../context/Auth'

const Notification = () => {

    const themeContext = useContext(ThemeContext)
    const currentTheme = theme[themeContext.ThemeValue]
    //const { token, setToken } = useContext(AuthContext)
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxOSIsImp0aSI6IjMyNjhkYzA5YTQ0YTgwN2M0ZTVmYWFiNDk3MjI5NDRjZDkyOWFkZDg4NmJjMzMzOTFkZjM1ZjI4MjNmZjhiODMwMzRlYWUxZTU0MDRiZmQxIiwiaWF0IjoxNzQxMjQ0NTM5LjkwMjExNywibmJmIjoxNzQxMjQ0NTM5LjkwMjExOSwiZXhwIjoxNzcyNzgwNTM5Ljg5Njg2MSwic3ViIjoiMjkiLCJzY29wZXMiOltdfQ.SFvEduoad2hfAdgUPFTBnxVxm1kLCzuZa8A0Rl7fUJeQaG_nmXtoSrs-wLnnBP4GsiKeVflUVySduoxUIbinwPUIg2PLc4ZnuqbgdVq8ocXWu8J4x4MFoFpHHr00Zd_P4ksIpODi0dM7lxRIEvmJi67wS3wsG6kJSfwstzUNscTO3sDIJtkfma6Qp2JcZQJMjwpMWSWISBYDloNoAcQa0wiSbW2Y2ejXiRCsL1Ab6PqZ5QNnZ1UYI26xI_347h6RaSnifPGo1MEmra2m2od0lM4JY1V4n7h-hkUy7xIJbRTSS_aZKv0zEmnKaD3kalY2KswXHEd8cnaCfWMtcKI2_bcxtQV2lMZAQE9UkeCTXNh2BSvIoZLkX8l4aVcsgr3snq3RwMOXofMp36LEmJwZNc38R7saIe1EDot-3kXUy_jtRjYuFZ1RBnFLdyzKJNWs4P9ptMU0y2i2yZaHFJAkbXLKJmQTwfvC70Y_FrxpMC4ff0rgkWv92AbmV7pvwOUyIDVzHA00yOZlDm-mhM6siFOpQmOeuDJLOYESzs0xDRrbernaAbmmFhg3C6Mj2q5gAmlJIRzAvWml3NMdLq3NpRbLQRYhSN5OVUaz83NNF77KHzKsA_i3L_ETrJSD69LfbIXd3sGenCV-CaX9Cg5a9xMvDXVQ4KbdhmbdjQV43bw"; 
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
 useEffect(() => {
    const fetchData = async () => {
    
        try {
        const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/customer/notifications', {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'zoneId': [1],   
            }
        });
        console.log(token)
    
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.log('Error Status:', response.status);
            console.log('Error Message:', errorData?.message || 'Unknown error');
            return;
        }
        const data = await response.json();
        console.log("Fetched Data:", data);
        setNotifications(data);
        setLoading(false)

        } catch (error) {
        console.error("Fetch Error:", error.message);
        }
    };
    
    fetchData();
 }, [token])

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