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
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  ActivityIndicator
} from 'react-native';
import styles from './styles'
import { theme } from '../../utils/themeColors'
import { Ionicons, Feather } from '@expo/vector-icons';
import Products from '../../components/Products/Products';
import NewRestaurantCard from '../../components/Main/FeaturedStores/NewRestaurantCard';
import { useNavigation } from '@react-navigation/native';
import BottomTab from '../../components/BottomTab/BottomTab';
import Search from '../../components/Main/Search/Search';
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import NewFiggoStore from '../../components/NewFiggoStore/NewFiggoStore';

const SubCategory = ({ route }) => {
  const { category } = route.params;
  const menucategoryId = category.id;

  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState([]); // Store products in state
  const [loading, setLoading] = useState(true); // Loading state to show spinner
  const [error, setError] = useState(null); // Error state for handling any fetch errors
  const [stores, setStores] = useState([]); // Store stores data
  const [subcat, setSubcat] = useState([]); // Subcategories data
  const [subcatId, setSubcatId] = useState(null); // Track selected subcategory ID
  const [contentType, setContentType] = useState('products'); // 'products' or 'stores'
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [isSearching, setIsSearching] = useState(false); // Flag to show search results
  
  const moduleId = 1;
  const baseUrl = 'https://6ammart-admin.6amtech.com';
  const navigation = useNavigation();
  const themeContext = useContext(ThemeContext);
  const currentTheme = theme[themeContext.ThemeValue];
  const [search, setSearch] = useState('');
  const newheaderColor = currentTheme.newheaderColor;
  const searchPlaceholderText = 'Search Items';

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcat = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${baseUrl}/api/v1/categories/childes/${menucategoryId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              zoneId: '[1]',
              moduleId: moduleId
            }
          }
        );

        const json = await response.json();
        if (json && json.length > 0) {
          setSubcat(json); // Set the fetched subcategories
        } else {
          console.log('No subcategories found');
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setError('Error fetching subcategories');
      } finally {
        setLoading(false);
      }
    };

    fetchSubcat();
  }, [moduleId, menucategoryId]);

  // Fetch products based on subcategory or default category
  useEffect(() => {
    if (contentType === 'products' && !isSearching) {
      fetchProducts();
    }
  }, [subcatId, contentType, isSearching]);

  // Fetch stores based on subcategory or default category
  useEffect(() => {
    if (contentType === 'stores' && !isSearching) {
      fetchStores();
    }
  }, [subcatId, contentType, isSearching]);

  // Search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== '') {
        fetchSearchResults(search);
      } else {
        setIsSearching(false);
        if (contentType === 'products') {
          fetchProducts();
        } else {
          fetchStores();
        }
      }
    }, 500); // Debounce search for 500ms

    return () => clearTimeout(timer);
  }, [search, contentType]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoryId = subcatId || menucategoryId;
      const response = await fetch(
        `${baseUrl}/api/v1/categories/items/${categoryId}?limit=10&offset=1&type=all`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            zoneId: '[1]',
            moduleId: moduleId
          }
        }
      );

      const json = await response.json();
      if (json?.products && json?.products.length > 0) {
        setProducts(json?.products);
      } else {
        setProducts([]);
        console.log('No products found or invalid response');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const categoryId = subcatId || menucategoryId;
      const response = await fetch(
        `${baseUrl}/api/v1/categories/stores/${categoryId}?limit=10&offset=1&type=all`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            zoneId: '[1]',
            moduleId: moduleId
          }
        }
      );

      const json = await response.json();
      if (json?.stores && json?.stores.length > 0) {
        setStores(json?.stores);
      } else {
        setStores([]);
        console.log('No stores found or invalid response');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
      setError('Error fetching stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async (text) => {
    if (text.trim() === "") {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setLoading(true);
    const categoryId = subcatId || menucategoryId;

    try {
      let url;
      if (contentType === 'products') {
        url = `${baseUrl}/api/v1/items/search?name=${text}&category_id=${categoryId}&type=all&offset=1&limit=50`;
      } else {
        url = `${baseUrl}/api/v1/stores/search?name=${text}&category_id=${categoryId}&type=all&offset=1&limit=50`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          zoneId: '[1]',
          moduleId: moduleId,
        },
      });

      const json = await response.json();
      
      if (contentType === 'products') {
        if (json?.products && json?.products.length > 0) {
          setProducts(json.products);
        } else {
          setProducts([]);
        }
      } else {
        if (json?.stores && json?.stores.length > 0) {
          setStores(json.stores);
        } else {
          setStores([]);
        }
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Error fetching search results');
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoryNames = () => {
    const tabs = ['All'];
    if (subcat && subcat.length > 0) {
      subcat.forEach((subcategory) => {
        if (subcategory.name) {
          tabs.push(subcategory.name);
        }
      });
    }
    return tabs;
  };

  const tabs = getSubcategoryNames();

  const handleTabPress = (tab) => {
    if (tab === 'All') {
      setSubcatId(null);
    } else {
      const subcategory = subcat.find((item) => item.name === tab);
      if (subcategory) {
        setSubcatId(subcategory.id);
      }
    }
    setActiveTab(tab);
    // Reset search when changing tabs
    if (search.trim() !== '') {
      setSearch('');
      setIsSearching(false);
    }
  };

  const handleContentTypeChange = (type) => {
    setContentType(type);
    // Reset search when switching between items and stores
    if (search.trim() !== '') {
      setSearch('');
      setIsSearching(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearch(text);

  };

  console.log(search)
  return (
    <>
      <SafeAreaView
        edges={['bottom', 'left', 'right']}
        style={[styles().flex, { backgroundColor: 'black' }]}>
        <View style={[styles().flex, styles(currentTheme).screenBackground]}>
          <View style={styles().flex}>
            <View style={styles().mainContentContainer}>

              {/* Search Bar Section */}
              <View style={styles(currentTheme).searchbar}>
                <Search
                  setSearch={handleSearchChange}
                  search={search}
                  newheaderColor={newheaderColor}
                  placeHolder={contentType === 'products' ? 'Search Items' : 'Search Stores'}
                />
              </View>

              {/* Category Tabs */}
              <View style={styles().tabContainer}>
                {tabs.map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles().tab, 
                      activeTab === tab && {
                        ...styles().activeTab,
                        backgroundColor: '#F7CA0F'
                      }
                    ]}
                    onPress={() => handleTabPress(tab)}
                  >
                    <Text
                      style={[
                        styles().tabText,
                        activeTab === tab && {
                          ...styles().activeTabText,
                          color: '#000000'
                        }
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* List Header */}
              <View style={[styles().listHeader, { 
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                paddingHorizontal: 20,
                marginTop: 10
              }]}>
                <View style={{ 
                  flex: 1, 
                  alignItems: 'center', 
                  flexDirection: 'row', 
                  justifyContent: 'center',
                  paddingHorizontal: 20
                }}>
                  <Text
                    style={[
                      styles().itemHeaderText,
                      { 
                        marginRight: 60,
                        minWidth: 50,
                        textAlign: 'center',
                        color: currentTheme.fontSecondColor
                      },
                      contentType === 'products' ? {
                        ...styles().activeHeaderText,
                        color: '#F7CA0F'
                      } : styles().inactiveHeaderText
                    ]}
                    onPress={() => handleContentTypeChange('products')}
                  >
                    Items
                  </Text>
                  <Text
                    style={[
                      styles().storesHeaderText,
                      {
                        minWidth: 50,
                        textAlign: 'center',
                        color: currentTheme.fontSecondColor
                      },
                      contentType === 'stores' ? {
                        ...styles().activeStoresText,
                        color: '#F7CA0F'
                      } : styles().inactiveHeaderText
                    ]}
                    onPress={() => handleContentTypeChange('stores')}
                  >
                    Stores
                  </Text>
                </View>
              </View>

              {/* Green Indicator */}
              <View
                style={[
                  styles().indicator,
                  {
                    width: 45,
                    height: 2,
                    alignSelf: 'center',
                    marginTop: 5,
                    backgroundColor: '#F7CA0F',
                    transform: [{ translateX: contentType === 'stores' ? 55 : -55 }]
                  }
                ]}
              />

              {/* Loading State */}
              {loading && (
                <View style={styles().loadingContainer}>
                  <ActivityIndicator size="large" color="#008800" />
                </View>
              )}

              {/* Error State */}
              {error && (
                <View style={styles().errorContainer}>
                  <Text style={styles().errorText}>{error}</Text>
                </View>
              )}

              {/* Content Rendering */}
              {!loading && !error && (
                contentType === 'products' ? (
                  <FlatList
                    key={`products-grid`}
                    data={products}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    columnWrapperStyle={{ 
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                      marginBottom: 10
                    }}
                    contentContainerStyle={{ 
                      padding: 10,
                      paddingBottom: 20
                    }}
                    renderItem={({ item }) => (
                      <View style={{ 
                        width: '48%', // Slightly less than 50% to account for spacing
                        marginBottom: 10
                      }}>
                        <Products
                          item={item}
                          horizontal={false}
                        />
                      </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={
                      <View style={[styles().emptyContainer, { 
                        padding: 20,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }]}>
                        <Text style={[styles().emptyText, {
                          fontSize: 16,
                          color: currentTheme.fontSecondColor
                        }]}>No products found</Text>
                      </View>
                    }
                  />
                ) : (
                  <FlatList
                    key={`stores-list`}
                    vertical={true}
                    style={[styles().storesList, { 
                      padding: 16,
                      marginTop: 5
                    }]}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    data={stores}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) =>  <NewFiggoStore
                    item={item}
                    
                  />}
                    ListEmptyComponent={
                      <View style={styles().emptyContainer}>
                        <Text style={styles().emptyText}>No stores found</Text>
                      </View>
                    }
                  />
                )
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
      <BottomTab screen="HOME" />
    </>
  );
};

export default SubCategory;