import {
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native'
import React, { useState, useContext, useEffect, useRef } from 'react'
import {
  View,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
  Image,
  Dimensions,
  SectionList, FlatList
} from 'react-native'
import Animated, {
  useSharedValue,
  Easing as EasingNode,
  withTiming,
  withRepeat,
  useAnimatedStyle
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import ImageHeader from '../../components/Restaurant/ImageHeader'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import ConfigurationContext from '../../context/Configuration'
import UserContext from '../../context/User'
import { useRestaurant } from '../../ui/hooks'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { scale } from '../../utils/scaling'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import { DAYS } from '../../utils/enums'
import { MaterialIcons } from '@expo/vector-icons'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'

const { height } = Dimensions.get('screen')
const moduleId = '1'
const TOP_BAR_HEIGHT = height * 0.05
const HEADER_MAX_HEIGHT = height * 0.4
const HEADER_MIN_HEIGHT = height * 0.07 + TOP_BAR_HEIGHT


function Restaurant(props) {

  const Analytics = analytics()
  const { t } = useTranslation()
  const scrollRef = useRef(null)
  const flatListRef = useRef(null)
  const navigation = useNavigation()
  const route = useRoute()
  const propsData = route.params
  const translationY = useSharedValue(0)
  const themeContext = useContext(ThemeContext)

  const currentTheme = theme[themeContext.ThemeValue]
  const configuration = useContext(ConfigurationContext)
  const [selectedLabel, selectedLabelSetter] = useState(0)
  const [buttonClicked, buttonClickedSetter] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [storeDetailsByAll, setStoreDetailsByAll] = useState([])
  const [storeDetailsById, setStoreDetailsById] = useState([])
  const [storeItemSearch, setStoreItemSearch] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [loading, setSearchLoading] = useState(false);
  const {
    restaurant: restaurantCart,
    setCartRestaurant,
    cartCount,
    addCartItem,
    addQuantity,
    clearCart,
    checkItemCart
  } = useContext(UserContext)

  const { data } = useRestaurant(
    propsData._id
  )



 

  

  const searchHandler = () => {
    setSearchOpen(!searchOpen)
    setShowSearchResults(!showSearchResults)
  }

  const searchPopupHandler = () => {
    setSearchOpen(!searchOpen)
    setSearch('')
    translationY.value = 0
  }


  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_RESTAURANTS)
    }
    Track()
  }, [])


  const isOpen = () => {
    if (storeDetailsByAll) {
      if (storeDetailsByAll?.current_opening_time?.length < 1) return false
      const date = new Date()
      const day = date.getDay()
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const todaysTimings = storeDetailsByAll?.current_opening_time?.find(
        (o) => o.day === DAYS[day]
      )
      if (todaysTimings === undefined) return false
      const times = todaysTimings.times.filter(
        (t) =>
          hours >= Number(t.startTime[0]) &&
          minutes >= Number(t.startTime[1]) &&
          hours <= Number(t.endTime[0]) &&
          minutes <= Number(t.endTime[1])
      )
      return times?.length > 0
    } else {
      return false
    }
  }

  const onPressItem = async (food) => {
    if (!storeDetailsByAll?.status === 1  || !isOpen()) {
      Alert.alert(
        '',
        t('restaurantClosed'),
        [
          {
            text: t('backToRestaurants'),
            onPress: () => {
              navigation.goBack()
            },
            style: 'cancel'
          },
          {
            text: t('seeMenu'),
            onPress: () => console.log('see menu')
          }
        ],
        { cancelable: false }
      )
      return
    }
    if (!restaurantCart || food.restaurant === restaurantCart) {
      await addToCart(food, food.restaurant !== restaurantCart)
    } else if (food.restaurant !== restaurantCart) {
      Alert.alert(
        '',
        t('clearCartText'),
        [
          {
            text: t('Cancel'),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel'
          },
          {
            text: t('okText'),
            onPress: async () => {
              await addToCart(food, true)
            }
          }
        ],
        { cancelable: false }
      )
    }
  }

 

  const addToCart = async (food, clearFlag) => {
  
  }

  function tagCart(itemId) {
    if (checkItemCart) {
     
    }
    return null
  }

  const scaleValue = useSharedValue(1)

  const scaleStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }]
  }))



  const scrollToSection = (index) => {
    if (scrollRef.current != null) {
      scrollRef.current.scrollToLocation({
        animated: true,
        sectionIndex: index,
        itemIndex: 0,
        viewOffset: -(HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT),
        viewPosition: 0
      })
    }
  }

  

  function changeIndex(index) {
    if (selectedLabel !== index) {
      selectedLabelSetter(index)
      buttonClickedSetter(true)
      scrollToSection(index)
      scrollToNavbar(index)
    }
  }

  function scrollToNavbar(value = 0) {
    if (flatListRef.current != null) {
      flatListRef.current.scrollToIndex({
        animated: true,
        index: value,
        viewPosition: 0.5
      })
    }
  }


  const iconColor = currentTheme.white
  const iconBackColor = currentTheme.white
  const iconRadius = scale(15)
  const iconSize = scale(20)
  const iconTouchHeight = scale(30)
  const iconTouchWidth = scale(30)

  useEffect(() => {
    handleItemPress();
  }, [moduleId]);

    const handleItemPress = async (ShopcategoriId) => {
      try {
        const response = await fetch(`https://6ammart-admin.6amtech.com/api/v1/items/latest?store_id=${propsData.id}&category_id=${ShopcategoriId}&offset=1&limit=13&type=all`, {
          method: 'GET', // GET request method
          headers: {
            'Content-Type': 'application/json', // Ensures the server knows we're sending JSON
            'zoneId': '[1]', // Pass zoneId in the headers
            'moduleId': moduleId
          }
        });
        const json = await response.json();


        setStoreDetailsById(json.products);
        console.log(propsData.id);
        
        console.log(ShopcategoriId);
      } catch (error) {
        console.error('Error fetching fetchStoreDetailsById:', error);
      }
    };



  useEffect(() => {
    const fetchStoreDetailsByAll = async () => {
      try {
        const response = await fetch(`https://6ammart-admin.6amtech.com/api/v1/stores/details/${propsData.id}`, {
          method: 'GET', // GET request method
          headers: {
            'Content-Type': 'application/json', // Ensures the server knows we're sending JSON
            'zoneId': '[1]', // Pass zoneId in the headers
            'moduleId': moduleId
          }
        });

        const json = await response.json();
        // console.log(json)

        setStoreDetailsByAll(json.category_details);
      } catch (error) {
        console.error('Error fetching fetchStoreDetailsByAll:', error);
      }
    };

    fetchStoreDetailsByAll();
  }, [moduleId]);
 
  useEffect(() => {
    // Fetch function
    const fetchStoreItemSearch = async () => {
      if (search.length > 0) { // Optional: Only search if there's something in the search input
        setSearchLoading(true); // Show loading spinner if necessary
        try {
          const response = await fetch(
            `https://6ammart-admin.6amtech.com/api/v1/items/search?store_id=${propsData.id}&name=${search}&offset=1&limit=10&type=all&category_id=0`, 
            {
              method: 'GET', // GET request method
              headers: {
                'Content-Type': 'application/json', 
                'zoneId': '[1]',
                'moduleId': moduleId
              }
            }
          );
          const json = await response.json();
          setStoreItemSearch(json.products);
        } catch (error) {
          console.error('Error fetching store items:', error);
        } finally {
          setSearchLoading(false); // Hide loading spinner
        }
      }
    };

    // Call fetchStoreItemSearch whenever `search` or `moduleId` changes
    fetchStoreItemSearch();
  }, [search, moduleId]);

  return (
    <>
      <SafeAreaView style={styles(currentTheme).flex}>
        <Animated.View style={styles(currentTheme).flex}>
          <ImageHeader
            ref={flatListRef}
            iconColor={iconColor}
            iconSize={iconSize}
            onItemPress={handleItemPress} 
            iconBackColor={iconBackColor}
            iconRadius={iconRadius}
            iconTouchWidth={iconTouchWidth}
            iconTouchHeight={iconTouchHeight}
            restaurantName={propsData?.name ?? data?.restaurant?.name}
            restaurantId={propsData.id}
            restaurantImage={propsData?.logo_full_url ?? data?.restaurant?.logo_full_url}
            restaurant={propsData}
            topaBarData={storeDetailsByAll}
            changeIndex={changeIndex}
            selectedLabel={selectedLabel}
            minimumOrder={propsData?.minimum_order ?? data?.restaurant?.minimum_order}
            tax={propsData?.tax ?? data?.restaurant?.tax}
            searchOpen={searchOpen}
            showSearchResults={showSearchResults}
            setSearch={setSearch}
            search={search}
            searchHandler={searchHandler}
            searchPopupHandler={searchPopupHandler}
            translationY={translationY}
          />

          {showSearchResults || searchOpen ? (
            <ScrollView
              style={{
                flexGrow: 1,
                marginTop: TOP_BAR_HEIGHT,
                backgroundColor: currentTheme.themeBackground,
              }}
            >
              <FlatList
              data={storeItemSearch}
              keyExtractor={(item, index) => String(index)}
              contentContainerStyle={{
                flexGrow: 1,
                
              }}
              renderItem={({ item, index }) => (
                <View key={index}>
                  <TouchableOpacity
                    style={styles(currentTheme).searchDealSection}
                    activeOpacity={0.7}
                    onPress={() => {
                      console.log(item.id); // Log the id
                      onPressItem({
                        ...item,
                        categoryid: item.id,
                      });
                    }}

                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View style={styles(currentTheme).deal}>
                        {item?.image_full_url ? (
                          <Image
                            style={{
                              height: scale(60),
                              width: scale(60),
                              borderRadius: 30,
                            }}
                            source={{ uri: item.image_full_url }}
                          />
                        ) : null}
                        <View style={styles(currentTheme).flex}>
                          <View style={styles(currentTheme).dealDescription}>
                            <TextDefault
                              textColor={currentTheme.fontMainColor}
                              style={styles(currentTheme).headerText}
                              numberOfLines={1}
                              bolder
                            >
                              {item.name}
                            </TextDefault>
                    
                            <View style={styles(currentTheme).dealPrice}>
                              <TextDefault
                                numberOfLines={1}
                                textColor={currentTheme.fontMainColor}
                                style={styles(currentTheme).priceText}
                                bolder
                                small
                              >
                                {configuration.currencySymbol}{' '}
                                {parseFloat(item.price).toFixed(2)}
                              </TextDefault>
                              {item?.discount > 0 && (
                                <TextDefault
                                  numberOfLines={1}
                                  textColor={currentTheme.fontSecondColor}
                                  style={styles().priceText}
                                  small
                                  lineOver
                                >
                                  {configuration.currencySymbol}{' '}
                                  {(
                                    item.price + item.discount
                                  ).toFixed(2)}
                                </TextDefault>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles().addToCart}>
                        <MaterialIcons
                          name="add"
                          size={scale(20)}
                          color={currentTheme.black}
                        />
                      </View>
                    </View>
                    {tagCart(item.id)}
                  </TouchableOpacity>
                </View>
              )}
            />
            </ScrollView>
          ) : (
            <FlatList
              data={storeDetailsById}
              keyExtractor={(item, index) => String(index)}
              contentContainerStyle={{
                flexGrow: 1,
                paddingTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
                marginTop: HEADER_MIN_HEIGHT,
              }}
              renderItem={({ item, index }) => (
                <View key={index}>
                  <TouchableOpacity
                    style={styles(currentTheme).searchDealSection}
                    activeOpacity={0.7}
                    onPress={() => {
                      console.log(item.id); // Log the id
                      onPressItem({
                        ...item,
                        categoryid: item.id,
                      });
                    }}

                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <View style={styles(currentTheme).deal}>
                        {item?.image_full_url ? (
                          <Image
                            style={{
                              height: scale(60),
                              width: scale(60),
                              borderRadius: 30,
                            }}
                            source={{ uri: item.image_full_url }}
                          />
                        ) : null}
                        <View style={styles(currentTheme).flex}>
                          <View style={styles(currentTheme).dealDescription}>
                            <TextDefault
                              textColor={currentTheme.fontMainColor}
                              style={styles(currentTheme).headerText}
                              numberOfLines={1}
                              bolder
                            >
                              {item.name}
                            </TextDefault>
                            <View style={styles(currentTheme).dealPrice}>
                              <TextDefault
                                numberOfLines={1}
                                textColor={currentTheme.fontMainColor}
                                style={styles(currentTheme).priceText}
                                bolder
                                small
                              >
                                {configuration.currencySymbol}{' '}
                                {parseFloat(item.price).toFixed(2)}
                              </TextDefault>
                              {item?.discount > 0 && (
                                <TextDefault
                                  numberOfLines={1}
                                  textColor={currentTheme.fontSecondColor}
                                  style={styles().priceText}
                                  small
                                  lineOver
                                >
                                  {configuration.currencySymbol}{' '}
                                  {(
                                    item.price + item.discount
                                  ).toFixed(2)}
                                </TextDefault>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles().addToCart}>
                        <MaterialIcons
                          name="add"
                          size={scale(20)}
                          color={currentTheme.black}
                        />
                      </View>
                    </View>
                    {tagCart(item.id)}
                  </TouchableOpacity>
                </View>
              )}
            />


          )}


          {cartCount > 0 && (
            <View style={styles(currentTheme).buttonContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles(currentTheme).button}
                onPress={() => navigation.navigate('Cart')}
              >
                <View style={styles().buttontLeft}>
                  <Animated.View
                    style={[
                      styles(currentTheme).buttonLeftCircle,
                      {
                        width: circleSize,
                        height: circleSize,
                        borderRadius: radiusSize
                      },
                      scaleStyles
                    ]}
                  >
                    <Animated.Text
                      style={[styles(currentTheme).buttonTextLeft, fontStyles]}
                    >
                      {cartCount}
                    </Animated.Text>
                  </Animated.View>
                </View>
                <TextDefault
                  style={styles().buttonText}
                  textColor={currentTheme.buttonTextPink}
                  uppercase
                  center
                  bolder
                  small
                >
                  {t('viewCart')}
                </TextDefault>
                <View style={styles().buttonTextRight} />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </>
  )
}

export default Restaurant
