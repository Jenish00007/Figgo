/* eslint-disable react/display-name */
import React, {
  useRef,
  useContext,
  useLayoutEffect,
  useState,
  useEffect
} from 'react'
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Platform,
  RefreshControl, FlatList
} from 'react-native'
import {
  MaterialIcons,
  SimpleLineIcons,
  AntDesign,
  MaterialCommunityIcons
} from '@expo/vector-icons'
import { useQuery, useMutation } from '@apollo/client'
import {
  useCollapsibleSubHeader,
  CollapsibleSubHeaderAnimator
} from 'react-navigation-collapsible'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import gql from 'graphql-tag'
import { useLocation } from '../../ui/hooks'
import Search from '../../components/Main/Search/Search'
import Item from '../../components/Main/Stores/Item'
import UserContext from '../../context/User'
import { getCuisines, restaurantListPreview } from '../../apollo/queries'
import { selectAddress } from '../../apollo/mutations'
import { scale } from '../../utils/scaling'
import styles from './styles'
import TextError from '../../components/Text/TextError/TextError'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import navigationOptions from '../Main/navigationOptions'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { LocationContext } from '../../context/Location'
import { ActiveOrdersAndSections } from '../../components/Main/ActiveOrdersAndSections'
import { alignment } from '../../utils/alignment'
import analytics from '../../utils/analytics'
import { useTranslation } from 'react-i18next'
import Filters from '../../components/Filter/FilterSlider'
import { FILTER_TYPE } from '../../utils/enums'
import CustomHomeIcon from '../../assets/SVG/imageComponents/CustomHomeIcon'
import CustomOtherIcon from '../../assets/SVG/imageComponents/CustomOtherIcon'
import CustomWorkIcon from '../../assets/SVG/imageComponents/CustomWorkIcon'
import CustomApartmentIcon from '../../assets/SVG/imageComponents/CustomApartmentIcon'
import ErrorView from '../../components/ErrorView/ErrorView'
import Spinner from '../../components/Spinner/Spinner'
import MainModalize from '../../components/Main/Modalize/MainModalize'

import { escapeRegExp } from '../../utils/regex'
import CarouselSlider from '../../components/Slider/Slider'
import Categories from '../../components/Categories/Categories'
import BottomTab from '../../components/BottomTab/BottomTab'
import StoreCard from '../../components/StoreCard/StoreCard'
import ProductCard from '../../components/ProductCard/ProductCard'

import HighlightCard from '../../components/HighlightCard/HighlightCard'
import { SupermarketCard } from '../../components/SupermarketCard/SupermarketCard'
import OfferCard from '../../components/OfferCard/OfferCard'
import NearByStore from '../../components/NearByStore/NearByStore'
import Products from '../../components/Products/Products'
import CategoryListView from '../../components/NearByShop/CategoryListView'
import { MainRestaurantCard } from '../../components/Main/MainRestaurantCard'



const RESTAURANTS = gql`
  ${restaurantListPreview}
`
const SELECT_ADDRESS = gql`
  ${selectAddress}
`

const GET_CUISINES = gql`
  ${getCuisines}
`

export const FILTER_VALUES = {
  Sort: {
    type: FILTER_TYPE.RADIO,
    values: ['Relevance (Default)', 'Fast Delivery', 'Distance'],
    selected: []
  },
  Offers: {
    selected: [],
    type: FILTER_TYPE.CHECKBOX,
    values: ['Free Delivery', 'Accept Vouchers', 'Deal']
  },
  Rating: {
    selected: [],
    type: FILTER_TYPE.CHECKBOX,
    values: ['3+ Rating', '4+ Rating', '5 star Rating']
  }
}

function Menu({ route, props }) {
  const Analytics = analytics()
  const { selectedType, moduleId } = route.params
  const { t } = useTranslation()
  const [busy, setBusy] = useState(false)
  const { loadingOrders, isLoggedIn, profile } = useContext(UserContext)
  const { location, setLocation } = useContext(LocationContext)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    // Example of your filters structure
    popular: { type: 'checkbox', values: ['Option 1', 'Option 2'], selected: [] },
    latest: { type: 'radio', values: ['Option A', 'Option B'], selected: [] },
    topOffer: { type: 'checkbox', values: ['Offer 1', 'Offer 2'], selected: [] },
  });
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [restaurantData, setRestaurantData] = useState([])
  const [sectionData, setSectionData] = useState([])
  const modalRef = useRef(null)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { getCurrentLocation } = useLocation()
  const locationData = location

  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [supermarkets, setSupermarkets] = useState([]);
  const [nearbymarkets, setNearbymarkets] = useState([]);
  const [nearbymarketsOffer, setNearbymarketsOffer] = useState([]);
  const [popularItem, setPopularItem] = useState([]);
  const [specialItem, setSpecialItem] = useState([]);
  const [allStores, setAllStore] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data, refetch, networkStatus, loading, error } = useQuery(
    RESTAURANTS,
    {
      variables: {
        longitude: location.longitude || null,
        latitude: location.latitude || null,
        shopType: selectedType || null,
        ip: null
      },
      onCompleted: data => {
        setRestaurantData(data.nearByRestaurantsPreview.restaurants)
        setSectionData(data.nearByRestaurantsPreview.sections)
      },
      fetchPolicy: 'network-only'
    }
  )
  const [mutate, { loading: mutationLoading }] = useMutation(SELECT_ADDRESS, {
    onError
  })

  const { data: allCuisines } = useQuery(GET_CUISINES)

  const newheaderColor = currentTheme.newheaderColor

  const {
    onScroll /* Event handler */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */,
    translateY
  } = useCollapsibleSubHeader()

  //Search Placeholder Text Changes
  const searchPlaceholderText =
    selectedType === 'restaurant' ? t('searchRestaurant') : t('searchGrocery')
  const menuPageHeading =
    selectedType === 'restaurant' ? t('allRestaurant') : t('allGrocery')
  const emptyViewDesc =
    selectedType === 'restaurant' ? t('noRestaurant') : t('noGrocery')

  //Theme setup android and ios
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.newheaderColor)
    }
    StatusBar.setBarStyle('dark-content')
  })

  //Track Analytics
  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_MAIN)
    }
    Track()
  }, [])

  //Model open
  const onOpen = () => {
    const modal = modalRef.current
    if (modal) {
      modal.open()
    }
  }


  //App Layout Theme 
  useLayoutEffect(() => {
    navigation.setOptions(
      navigationOptions({
        headerMenuBackground: currentTheme.main,
        horizontalLine: currentTheme.headerColor,
        fontMainColor: currentTheme.darkBgFont,
        iconColorPink: currentTheme.black,
        open: onOpen,
        icon: 'back'
      })
    )
  }, [navigation, currentTheme])

  function onError(error) {
    console.log(error)
  }

  const addressIcons = {
    House: CustomHomeIcon,
    Office: CustomWorkIcon,
    Apartment: CustomApartmentIcon,
    Other: CustomOtherIcon
  }

  const setAddressLocation = async address => {
    setLocation({
      _id: address._id,
      label: address.label,
      latitude: Number(address.location.coordinates[1]),
      longitude: Number(address.location.coordinates[0]),
      deliveryAddress: address.deliveryAddress,
      details: address.details
    })
    mutate({ variables: { id: address._id } })
    modalRef.current.close()
  }

  //Location Fetch
  const setCurrentLocation = async () => {
    setBusy(true)
    const { error, coords } = await getCurrentLocation()

    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.log('Reverse geocoding request failed:', data.error)
        } else {
          let address = data.display_name
          if (address.length > 21) {
            address = address.substring(0, 21) + '...'
          }

          if (error) navigation.navigate('SelectLocation')
          else {
            modalRef.current.close()
            setLocation({
              label: 'currentLocation',
              latitude: coords.latitude,
              longitude: coords.longitude,
              deliveryAddress: address
            })
            setBusy(false)
          }
          // console.log(address)
        }
      })
      .catch(error => {
        console.error('Error fetching reverse geocoding data:', error)
      })
  }


  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/banners?featured=1', {
          method: 'GET', // GET request method
          headers: {
            'Content-Type': 'application/json', // Ensures the server knows we're sending JSON
            'zoneId': '[1]', // Pass zoneId in the headers
            'moduleId': moduleId
          }
        });

        const json = await response.json();

        if (json?.banners && json.banners.length > 0) {
          setBanners(json.banners); // Set the fetched banners in the state
          // console.log(json);
        } else {
          console.log('No banners found or invalid response');
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, [moduleId]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/categories', {
          method: 'GET', // GET request method
          headers: {
            'Content-Type': 'application/json', // Ensures the server knows we're sending JSON
            'zoneId': '[1]', // Pass zoneId in the headers
            'moduleId': moduleId
          }
        });
        const json = await response.json();
        // console.log(json);
        if (json?.length > 0) {
          setCategories(json);
        } else {
          console.log('No categories found or invalid response');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [moduleId]);

  // Fetch data from the API
  useEffect(() => {
    const fetchSupermarkets = async () => {
      try {
        const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/stores/latest?type=all', {
          method: 'GET', // GET request method
          headers: {
            'Content-Type': 'application/json', // Ensures the server knows we're sending JSON
            'zoneId': '[1]', // Pass zoneId in the headers
            'moduleId': moduleId
          }
        });
        const json = await response.json();

        // Check if data is valid before updating state
        if (json?.stores && json.stores.length > 0) {
          setSupermarkets(json.stores);
          // console.log(json)
        } else {
          console.log('No supermarket data found');
        }
      } catch (error) {
        console.error('Error fetching supermarkets:', error);
      }
    };

    fetchSupermarkets()
  }, [moduleId]);

  // Fetch data from the API
  useEffect(() => {
    const fetchNearbymarkets = async () => {
      try {
        const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/stores/popular?type=all', {
          method: 'GET', // GET request method
          headers: {
            'Content-Type': 'application/json', // Ensures the server knows we're sending JSON
            'zoneId': '[1]', // Pass zoneId in the headers
            'moduleId': moduleId
          }
        });
        const json = await response.json();

        // Check if data is valid before updating state
        if (json?.stores && json.stores.length > 0) {
          setNearbymarkets(json.stores);
          // console.log(json)
        } else {
          console.log('No supermarket data found');
        }
      } catch (error) {
        console.error('Error fetching supermarkets:', error);
      }
    };

    fetchNearbymarkets()
  }, [moduleId]);

  // Fetch data from the API
  useEffect(() => {
    const fetchNearbymarketsOffer = async () => {
      try {
        const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/stores/top-offer-near-me', {
          method: 'GET', // GET request method
          headers: {
            'Content-Type': 'application/json', // Ensures the server knows we're sending JSON
            'zoneId': '[1]', // Pass zoneId in the headers
            'moduleId': moduleId
          }
        });
        const json = await response.json();

        // Check if data is valid before updating state
        if (json?.stores && json.stores.length > 0) {
          setNearbymarketsOffer(json.stores);
          // console.log(json)
        } else {
          console.log('No Nearby data found');
        }
      } catch (error) {
        console.error('Error fetching supermarkets:', error);
      }
    };

    fetchNearbymarketsOffer()
  }, [moduleId]);

  // Fetch data from the API
  useEffect(() => {
    const fetchPopularItem = async () => {
      try {
        const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/items/popular?type=all', {
          method: 'GET', // GET request method
          headers: {
            'Content-Type': 'application/json',
            'zoneId': '[1]',
            'moduleId': moduleId
          }
        });
        const json = await response.json();

        // Check if data is valid before updating state
        if (json?.products && json.products.length > 0) {
          setPopularItem(json.products);
          // console.log(json)
        } else {
          console.log('No Popular data found');
        }
      } catch (error) {
        console.error('Error fetching supermarkets:', error);
      }
    };

    fetchPopularItem()
  }, [moduleId]);

  // Fetch data from the API
  useEffect(() => {
    const fetchSpecialItem = async () => {
      try {
        const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/items/popular?type=all', {
          method: 'GET', // GET request method
          headers: {
            'Content-Type': 'application/json',
            'zoneId': '[1]',
            'moduleId': moduleId
          }
        });
        const json = await response.json();

        // Check if data is valid before updating state
        if (json?.products && json.products.length > 0) {
          setSpecialItem(json.products);
          // console.log(json)
        } else {
          console.log('No Popular data found');
        }
      } catch (error) {
        console.error('Error fetching supermarkets:', error);
      }
    };

    fetchSpecialItem()
  }, [moduleId]);



  //Filter Store Listing
  const fetchData = async (category) => {
    let url = '';
    switch (category) {
      case 'popular':
        url = 'https://6ammart-admin.6amtech.com/api/v1/stores/popular?type=all';
        break;
      case 'latest':
        url = 'https://6ammart-admin.6amtech.com/api/v1/stores/latest?type=all';
        break;
      case 'top-offer':
        url = 'https://6ammart-admin.6amtech.com/api/v1/stores/top-offer-near-me';
        break;
      default:
        url = 'https://6ammart-admin.6amtech.com/api/v1/stores/get-stores/all?store_type=all';
        break;
    }

    try {
      const response = await fetch(url, {
        method: 'GET', // GET request method
        headers: {
          'Content-Type': 'application/json',
          'zoneId': '[1]',
          'moduleId': moduleId
        }
      });
      const data = await response.json();
      setAllStore(data?.stores);
    } catch (error) {
      console.error("Error fetching stores data:", error);
    }
  };

  const applyFilters = (filter) => {
    setSelectedFilter(filter);

    // Trigger the corresponding API call based on filter
    switch (filter) {
      case 'popular':
        fetchData('popular');
        break;
      case 'latest':
        fetchData('latest');
        break;
      case 'top-offer':
        fetchData('top-offer');
        break;
      default:
        fetchData('all');
        break;
    }
  };

  useEffect(() => {
    fetchData('all');
  }, []);

  // Header
  const modalHeader = () => (
    <View style={[styles().addNewAddressbtn]}>
      <View style={styles(currentTheme).addressContainer}>
        <TouchableOpacity
          style={[styles(currentTheme).addButton]}
          activeOpacity={0.7}
          onPress={setCurrentLocation}
          disabled={busy}
        >
          <View style={styles().addressSubContainer}>
            {
              busy ? <Spinner size='small' /> : (
                <>
                  <SimpleLineIcons name="target" size={scale(18)} color={currentTheme.black} />
                  <View style={styles().mL5p} />
                  <TextDefault bold>{t('currentLocation')}</TextDefault>
                </>
              )
            }
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )

  //App not Available in YourArea
  const emptyView = () => {
    if (loading || mutationLoading || loadingOrders) return loadingScreen()
    else {
      return (
        <View style={styles().emptyViewContainer}>
          <View style={styles(currentTheme).emptyViewBox}>
            <TextDefault bold H4 center textColor={currentTheme.fontMainColor}>
              {t('notAvailableinYourArea')}
            </TextDefault>
            <TextDefault textColor={currentTheme.fontMainColor} center>
              {emptyViewDesc}
            </TextDefault>
          </View>
        </View>
      )
    }
  }

  //Footer Modal
  const modalFooter = () => (
    <View style={styles().addNewAddressbtn}>
      <View style={styles(currentTheme).addressContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles(currentTheme).addButton}
          onPress={() => {
            if (isLoggedIn) {
              navigation.navigate('AddNewAddress', { ...locationData })
            } else {
              const modal = modalRef.current
              modal?.close()
              navigation.navigate({ name: 'CreateAccount' })
            }
          }}>
          <View style={styles().addressSubContainer}>
            <AntDesign
              name="pluscircleo"
              size={scale(20)}
              color={currentTheme.black}
            />
            <View style={styles().mL5p} />
            <TextDefault bold>{t('addAddress')}</TextDefault>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles().addressTick}></View>
    </View>
  )
  // console.log(filters);
  // Loading Animation 
  function loadingScreen() {
    return (
      <View style={styles(currentTheme).screenBackground}>
        <View style={styles(currentTheme).searchbar}>
          <Search
            search={''}
            setSearch={() => { }}
            newheaderColor={newheaderColor}
            placeHolder={searchPlaceholderText}
          />
        </View>

        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={300}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={300}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={300}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
      </View>
    )
  }

  if (error) return <ErrorView />
  if (loading) return loadingScreen()

  //Search Function
  const searchAllShops = searchText => {
    const data = [];
    const escapedSearchText = escapeRegExp(searchText);
    const regex = new RegExp(escapedSearchText, 'i');

    allStores?.forEach((store) => {
      if (store.name && regex.test(store.name)) {
        data.push(store);
      }
    });
    return data;
  }



  return (
    <>
      <SafeAreaView
        edges={['bottom', 'left', 'right']}
        style={[styles().flex, { backgroundColor: 'black' }]}>
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          <View style={styles().flex}>
            <View style={styles().mainContentContainer}>
              <View style={[styles().flex, styles().subContainer]}>
                {/* Search Bar Section */}
                <View style={styles(currentTheme).searchbar}>
                  <Search
                    setSearch={setSearch}
                    search={search}
                    newheaderColor={newheaderColor}
                    placeHolder={searchPlaceholderText}
                  />
                </View>

                {search ? (
                  <View style={styles().searchList}>
                    <Animated.FlatList
                      contentInset={{
                        top: containerPaddingTop
                      }}
                      contentContainerStyle={{
                        paddingTop:
                          Platform.OS === 'ios' ? 0 : containerPaddingTop
                      }}
                      contentOffset={{
                        y: -containerPaddingTop
                      }}
                      onScroll={onScroll}
                      scrollIndicatorInsets={{
                        top: scrollIndicatorInsetTop
                      }}
                      showsVerticalScrollIndicator={false}
                      ListEmptyComponent={emptyView()}
                      keyExtractor={(item) => item.id.toString()}
                      refreshControl={
                        <RefreshControl
                          progressViewOffset={containerPaddingTop}
                          colors={[currentTheme.iconColorPink]}
                          refreshing={networkStatus === 4}
                          onRefresh={() => {
                            if (networkStatus === 7) {
                              refetch()
                            }
                          }}
                        />
                      }
                      data={searchAllShops(search)}

                      renderItem={({ item }) => <Item item={item} />}
                    />
                  </View>
                ) : (
                  < ScrollView
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}>
                    {/* Banners Section */}
                    <View style={{ padding: 10 }}>
                      {banners.length > 0 ? (
                        <CarouselSlider banners={banners} />
                      ) : (
                        <TextDefault style={styles().loadingText}>Loading banners...</TextDefault>
                      )}
                    </View>

                    {/* Categories Section */}
                    <TextDefault style={styles().sectionTitle}>Categories</TextDefault>
                    <Categories categories={categories} />

                    {/* Nearby Stores Section */}
                    <TextDefault style={styles().sectionTitle}>Nearby Stores</TextDefault>


                    <FlatList
                      data={supermarkets}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item, index }) => (
                        <CategoryListView data={{ item, index }} />
                      )}
                      keyExtractor={(item) => item.id.toString()}
                    />



                    {/* Top Offers Section */}
                    <TextDefault style={styles().sectionTitle}>Top Offers near me 🔥</TextDefault>
                    <FlatList
                      data={nearbymarketsOffer}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <OfferCard
                          item={item}

                        />
                      )}
                      keyExtractor={(item) => item.id.toString()}
                    />
                    {/* Popular Items Section */}
                    <TextDefault style={styles().sectionTitle}>Most Popular Items 🔥</TextDefault>
                    <FlatList
                      data={popularItem}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => <Products
                        name={item?.name}
                        price={item?.price}
                        image_full_url={item?.image_full_url}
                      />}
                      keyExtractor={(item) => item.id.toString()}
                    />
                    {/* New on Figgo Section */}
                    <TextDefault style={styles().sectionTitle}>New on Figgo</TextDefault>
                    <FlatList
                      data={nearbymarkets}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <NearByStore
                          item={item}
                        />
                      )}
                      keyExtractor={(item) => item.id.toString()}
                    />

                    {/* Filters Section */}
                    <Filters
                      filters={filters}
                      setFilters={setFilters}
                      applyFilters={applyFilters}
                    />
                    <Animated.FlatList
                      contentInset={{ top: containerPaddingTop }}
                      contentContainerStyle={{
                        paddingTop: Platform.OS === 'ios' ? 0 : containerPaddingTop
                      }}
                      contentOffset={{ y: -containerPaddingTop }}
                      onScroll={onScroll}
                      scrollIndicatorInsets={{ top: scrollIndicatorInsetTop }}
                      showsVerticalScrollIndicator={false}
                      ListEmptyComponent={emptyView()}
                      keyExtractor={(item, index) => index.toString()}
                      refreshControl={
                        <RefreshControl
                          progressViewOffset={containerPaddingTop}
                          colors={[currentTheme.iconColorPink]}
                          refreshing={networkStatus === 4}
                          onRefresh={() => {
                            if (networkStatus === 7) {
                              refetch()
                            }
                          }}
                        />
                      }
                      data={search ? searchAllShops(search) : allStores}
                      renderItem={({ item }) => <Item item={item} />}
                    />
                  </ScrollView>
                )}
              </View>
            </View>
          </View>

          {/* Modal */}
          <MainModalize
            modalRef={modalRef}
            currentTheme={currentTheme}
            isLoggedIn={isLoggedIn}
            addressIcons={addressIcons}
            modalHeader={modalHeader}
            modalFooter={modalFooter}
            setAddressLocation={setAddressLocation}
            profile={profile}
            location={location}
          />
        </View>
      </SafeAreaView >
      <BottomTab screen="HOME" />
    </>
  )
}

export default Menu
