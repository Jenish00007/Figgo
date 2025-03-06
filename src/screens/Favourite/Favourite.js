import { useQuery } from '@apollo/client'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import gql from 'graphql-tag'
import React, { useContext, useEffect, useState, useCallback, useLayoutEffect } from 'react'
import {
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FavouriteRestaurant } from '../../apollo/queries'
import EmptyCart from '../../assets/SVG/imageComponents/EmptyCart'
import Item from '../../components/Main/Stores/Item'
import Spinner from '../../components/Spinner/Spinner'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import TextError from '../../components/Text/TextError/TextError'
import { LocationContext } from '../../context/Location'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import screenOptions from './screenOptions'
import styles from './styles'
import Analytics from '../../utils/analytics'
import { HeaderBackButton } from '@react-navigation/elements'
import { MaterialIcons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import navigationService from '../../routes/navigationService'
import ErrorView from '../../components/ErrorView/ErrorView'
import EmptyView from '../../components/EmptyView/EmptyView'

import AuthContext from '../../context/Auth'


// const RESTAURANTS = gql`
//   ${FavouriteRestaurant}
// `

function Favourite() {
  const analytics = Analytics()

  const { t } = useTranslation()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)
  // const { data, refetch, networkStatus, loading, error } = useQuery(
  //   RESTAURANTS,
  //   {
  //     variables: {
  //       longitude: location.longitude || null,
  //       latitude: location.latitude || null
  //     },
  //     fetchPolicy: 'network-only'
  //   }
  // )
  const { token, setToken } = useContext(AuthContext)
  
  //const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxOSIsImp0aSI6IjMyNjhkYzA5YTQ0YTgwN2M0ZTVmYWFiNDk3MjI5NDRjZDkyOWFkZDg4NmJjMzMzOTFkZjM1ZjI4MjNmZjhiODMwMzRlYWUxZTU0MDRiZmQxIiwiaWF0IjoxNzQxMjQ0NTM5LjkwMjExNywibmJmIjoxNzQxMjQ0NTM5LjkwMjExOSwiZXhwIjoxNzcyNzgwNTM5Ljg5Njg2MSwic3ViIjoiMjkiLCJzY29wZXMiOltdfQ.SFvEduoad2hfAdgUPFTBnxVxm1kLCzuZa8A0Rl7fUJeQaG_nmXtoSrs-wLnnBP4GsiKeVflUVySduoxUIbinwPUIg2PLc4ZnuqbgdVq8ocXWu8J4x4MFoFpHHr00Zd_P4ksIpODi0dM7lxRIEvmJi67wS3wsG6kJSfwstzUNscTO3sDIJtkfma6Qp2JcZQJMjwpMWSWISBYDloNoAcQa0wiSbW2Y2ejXiRCsL1Ab6PqZ5QNnZ1UYI26xI_347h6RaSnifPGo1MEmra2m2od0lM4JY1V4n7h-hkUy7xIJbRTSS_aZKv0zEmnKaD3kalY2KswXHEd8cnaCfWMtcKI2_bcxtQV2lMZAQE9UkeCTXNh2BSvIoZLkX8l4aVcsgr3snq3RwMOXofMp36LEmJwZNc38R7saIe1EDot-3kXUy_jtRjYuFZ1RBnFLdyzKJNWs4P9ptMU0y2i2yZaHFJAkbXLKJmQTwfvC70Y_FrxpMC4ff0rgkWv92AbmV7pvwOUyIDVzHA00yOZlDm-mhM6siFOpQmOeuDJLOYESzs0xDRrbernaAbmmFhg3C6Mj2q5gAmlJIRzAvWml3NMdLq3NpRbLQRYhSN5OVUaz83NNF77KHzKsA_i3L_ETrJSD69LfbIXd3sGenCV-CaX9Cg5a9xMvDXVQ4KbdhmbdjQV43bw"
  const [data, setData] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchfavorite = async () => {
    try {
      const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/customer/wish-list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          //'moduleId': 1,
          'zoneId': [1],   
          //'latitude': 23.793544663762145,
          //'longitude': 90.41166342794895
        }
      });
      console.log("Token", token)

      if (!response.ok) {
        console.log('Error Status:', response.status);  
        console.log('Error Message:', response.message || data);  
        //setError(data.message || 'Failed to fetch profile')
      }
      const data = await response.json();

      console.log("Filtered Data:", data);
      // const filteredData = data.item.map(item => ({
      //   id: item.id,
      //   name: item.name
      // }));

      setData(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Error fetching profile');
      setLoading(false);
    }
  };

  if (token) {
    fetchfavorite();
  }                                                         
}, [token]);
  

  // useEffect(() => {
  //   async function Track() {
  //     await analytics.track(analytics.events.NAVIGATE_TO_FAVOURITES)
  //   }
  //   Track()
  // }, [])
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })

  // useEffect(() => {
  //   navigation.setOptions({
  //     title: t('titleFavourite'),
  //     headerTitleAlign: 'center',
  //     headerRight: null,
  //     headerTitleStyle: {
  //       color:currentTheme.newFontcolor,
  //       fontWeight: 'bold'
  //     },
  //     headerTitleContainerStyle: {
  //       marginTop: '2%',
  //       paddingLeft: scale(25),
  //       paddingRight: scale(25),
  //       height: '75%',
  //       marginLeft: 0
  //     },
  //     headerStyle: {
  //       backgroundColor: currentTheme.newheaderBG,
  //       elevation: 0
  //     },
  //     headerTitleAlign: 'center',
  //     headerRight: null,
  //     headerLeft: () => (
  //       <HeaderBackButton
  //         truncatedLabel=""
  //         backImage={() => (
  //           <View>
  //             <MaterialIcons name="arrow-back" size={25} color={currentTheme.newFontcolor} />
  //           </View>
  //         )}
  //         onPress={() => {
  //           navigationService.goBack()
  //         }}
  //       />
  //     )
  //   })
  // }, [navigation])

  const emptyView = () => {
    return (
      <EmptyView
        title={'titleEmptyFav'}
        description={'emptyFavDesc'}
        buttonText={'emptyFavBtn'}
      />
    )
  }

  if (loading)
    return (
      <Spinner
        backColor={currentTheme.themeBackground}
        spinnerColor={currentTheme.main}
      />
    )
  if (error) return <ErrorView />
  return (
    <SafeAreaView edges={['bottom']} style={styles(currentTheme).flex}>
      <FlatList
        //data={data ? data?.userFavourite : []}
        data={Array.isArray(data?.userFavourite) ? data.userFavourite : []}
        keyExtractor={(item, index) => item._id}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        //refreshing={networkStatus === 4}
        //onRefresh={() => networkStatus === 7 && refetch()}
        onRefresh={fetchfavorite}
        style={[styles().flex, styles(currentTheme).container]}
        contentContainerStyle={styles(currentTheme).contentContainer}
        ListEmptyComponent={emptyView()}
        ListHeaderComponent={null}
        renderItem={({ item }) => <Item item={item} />}
      />
    </SafeAreaView>
  )
}

export default Favourite
