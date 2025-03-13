import React, { useContext, useState, useEffect } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import styles from './styles'
import ConfigurationContext from '../../../context/Configuration'
import { useNavigation } from '@react-navigation/native'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import { AntDesign, Ionicons, MaterialIcons, Feather } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import { DAYS } from '../../../utils/enums'
import { profile, FavouriteRestaurant } from '../../../apollo/queries'
import { addFavouriteRestaurant } from '../../../apollo/mutations'
import UserContext from '../../../context/User'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import Spinner from '../../Spinner/Spinner'
import { FlashMessage } from '../../../ui/FlashMessage/FlashMessage'
import { useTranslation } from 'react-i18next'
import { LocationContext } from '../../../context/Location'
import AuthContext from '../../../context/Auth'
import { Delete } from 'lucide-react-native'

// const ADD_FAVOURITE = gql`
//   ${addFavouriteRestaurant}
// `
// const PROFILE = gql`
//   ${profile}
// `
// const FAVOURITERESTAURANTS = gql`
//   ${FavouriteRestaurant}
// `

function Item(props) {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { profile } = useContext(UserContext)
  const heart = profile ? profile.favourite.includes(props.item._id) : false
  const item = props.item
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)
  const { token, setToken } = useContext(AuthContext)

  // const [mutate, { loading: loadingMutation }] = useMutation(ADD_FAVOURITE, {
  //   onCompleted,
  //   refetchQueries: [PROFILE, FAVOURITERESTAURANTS]
  // })

  const [isFavourite, setIsFavourite] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setIsFavourite(isFavourite);
    }
  }, [isFavourite]); 

  // Function to handle adding/removing from wishlist
  const toggleWishlist = async () => {
    if (loading) return; 
    setLoading(true);

    try {
      let url 
      const method = isFavourite ? 'DELETE' : 'POST'; // Change as needed
       if (props.isStore) {
        url = isFavourite
          ? `https://6ammart-admin.6amtech.com/api/v1/customer/wish-list/remove?store_id=${props.item.id}`
          : `https://6ammart-admin.6amtech.com/api/v1/customer/wish-list/add?store_id=${props.item.id}`;
      } else {
        // Use item_id for items
        url = isFavourite
          ? `https://6ammart-admin.6amtech.com/api/v1/customer/wish-list/remove?item_id=${props.item.id}`
          : `https://6ammart-admin.6amtech.com/api/v1/customer/wish-list/add?item_id=${props.item.id}`;
      }
      const headers = {
        'moduleId': '1',
        'zoneId': '[1]',
        'latitude': location?.latitude?.toString() || '23.79354466376145',
        'longitude': location?.longitude?.toString() || '90.41166342794895',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }  

      const response = await fetch(url, {
        method: method,
        headers: headers,
      });

    // Check if response is JSON before parsing
      const responseData = await response.json();
      console.log("API Response:", responseData);
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update wishlist');
      }
      
      setIsFavourite((prev) => !prev);
      FlashMessage({ message: responseData.message });
      
      if (isFavourite && props.onRemoveFromWishlist) {
        props.onRemoveFromWishlist(item.id);
      }
    } catch (error) {     
      console.error('Wishlist update error:', error);
      FlashMessage({ message: 'Something went wrong', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = (itemId) => {
    setData((prevData) => ({
      ...prevData,
      item: prevData.item.filter((item) => item.id !== itemId),
    }));
  };

  const { isAvailable, openingTimes } = item
  const isOpen = () => {
    const date = new Date()
    const day = date.getDay()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const todaysTimings = openingTimes.find(o => o.day === DAYS[day])
    if (todaysTimings === undefined) return false
    const times = todaysTimings.times.filter(
      t =>
        hours >= Number(t.startTime[0]) &&
        minutes >= Number(t.startTime[1]) &&
        hours <= Number(t.endTime[0]) &&
        minutes <= Number(t.endTime[1])
    )
    return times.length > 0
  }

  function onCompleted() {
    FlashMessage({ message: t('favouritelistUpdated') })
  }
  return (
    <TouchableOpacity
      style={{ padding: scale(10) }}
      activeOpacity={1}
      onPress={() => navigation.navigate('Restaurant', { ...item })}>
      <View key={item.id} style={styles().mainContainer}>
        <View style={[styles(currentTheme).restaurantContainer]}>
          <View style={styles().imageContainer}>
            <Image
              resizeMode="cover"
              source={{ uri: item.image_full_url || item.cover_photo_full_url }}
              style={styles().img}
            />
            <View style={styles().overlayRestaurantContainer}>
              <TouchableOpacity
                activeOpacity={0}
                disabled={loading}
                style={styles(currentTheme).favOverlay}
                onPress={ toggleWishlist
                  //() => profile ? mutate({ variables: { id: item.id } }) : null
                }>
                {loading ? (
                  <Spinner size={'small'} backColor={'transparent'} spinnerColor={currentTheme.iconColorDark} />
                ) : (
                  <AntDesign
                    name={isFavourite  ? 'heart' : 'hearto'}
                    size={scale(15)}
                    color={isFavourite ? 'red' : 'black'} 
                    style={{ opacity: 1 }} 
                    onPress={toggleWishlist} 
                  />
                )}
              </TouchableOpacity>
              {/*    {(!isAvailable || !isOpen()) && (
                <View style={{ ...styles().featureOverlay, top: 40 }}>
                  <TextDefault
                    style={[
                      styles(currentTheme).featureText,
                      {
                        ...alignment.MTxSmall,
                        ...alignment.PLsmall,
                        ...alignment.PRsmall,
                        ...alignment.PTxSmall,
                        ...alignment.PBxSmall
                      }
                    ]}
                    textColor={currentTheme.fontWhite}
                    numberOfLines={1}
                    small
                    bold
                    uppercase>
                    {t('Closed')}
                  </TextDefault>
                </View>
              )}
*/}


              {/*    <View style={styles(currentTheme).deliveryRestaurantOverlay}>
                <TextDefault
                  textColor={currentTheme.fontMainColor}
                  numberOfLines={1}
                  small
                  bolder
                  center>
                  {item.deliveryTime + ' '}
                  {t('min')}
                </TextDefault>
              </View> */}
            </View>
          </View>
          <View style={styles().descriptionContainer}>
            <View style={styles().aboutRestaurant}>
              <TextDefault
                style={{ width: '77%' }}
                H4
                numberOfLines={1}
                textColor={currentTheme.fontThirdColor}
                bolder>
                {item.name}
              </TextDefault>
              <View style={[styles().aboutRestaurant, { width: '23%' }]}>
                <Feather name="star" size={18} color={currentTheme.newIconColor} />
                <TextDefault
                  textColor={currentTheme.fontThirdColor}

                  H4
                  bolder
                  style={{ marginLeft: scale(2), marginRight: scale(5) }}
                >
                  {item.avg_rating}
                </TextDefault>
                <TextDefault
                  textColor={currentTheme.fontNewColor}
                  style={{ marginLeft: scale(2) }}

                  H5>
                  ({item.rating_count})
                </TextDefault>
              </View>
            </View>
            <TextDefault
              style={styles().offerCategoty}
              numberOfLines={1}
              bold
              Normal
              textColor={currentTheme.fontNewColor}
            >
              {item?.address}
            </TextDefault>
            <View style={styles().priceRestaurant}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  justifyContent: 'center',
                  marginRight: 18
                }}>
                <AntDesign name="clockcircleo" size={16}
                  color={currentTheme.fontNewColor} />
                <TextDefault
                  textColor={currentTheme.fontNewColor}
                  numberOfLines={1}
                  bold
                  Normal>
                  {item.delivery_time}

                </TextDefault>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  justifyContent: 'center',
                  marginRight: 10
                }}>
                {/* <MaterialIcons name="directions-bike" size={16}
                color={currentTheme.fontNewColor}/> */}
                {/* <TextDefault
                  style={styles().offerCategoty}
                  textColor={currentTheme.fontNewColor}
                numberOfLines={1}
                bold
                Normal>
                  {configuration.currencySymbol + '' + item.minimumOrder}{' '}
                </TextDefault> */}
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Item