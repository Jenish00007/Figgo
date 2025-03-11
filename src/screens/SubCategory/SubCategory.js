import React, { useState, useEffect } from 'react';
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
import { Ionicons, Feather } from '@expo/vector-icons';
import Products from '../../components/Products/Products';
import NewRestaurantCard from '../../components/Main/FeaturedStores/NewRestaurantCard';
import { useNavigation } from '@react-navigation/native';
import BottomTab from '../../components/BottomTab/BottomTab';

const SubCategory = ({ route }) => {
  const { category } = route.params;
  const menucategoryId = 102; // Default category ID

  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState([]); // Store products in state
  const [loading, setLoading] = useState(true); // Loading state to show spinner
  const [error, setError] = useState(null); // Error state for handling any fetch errors
  const [stores, setStores] = useState([]); // Store stores data
  const [subcat, setSubcat] = useState([]); // Subcategories data
  const [subcatId, setSubcatId] = useState(null); // Track selected subcategory ID
  const moduleId = 1;
  const navigation = useNavigation(); 

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcat = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://6ammart-admin.6amtech.com/api/v1/categories/childes/${menucategoryId}`,
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
  }, [moduleId]);

  // Fetch products based on subcategory or default category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categoryId = activeTab === 'All' ? menucategoryId : subcatId;
        const response = await fetch(
          `https://6ammart-admin.6amtech.com/api/v1/categories/items/${categoryId}?limit=10&offset=1&type=all`,
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

    fetchProducts();
  }, [subcatId, activeTab, moduleId]);

  // Fetch stores based on subcategory or default category
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const categoryId = activeTab === 'All' ? menucategoryId : subcatId;
        const response = await fetch(
          `https://6ammart-admin.6amtech.com/api/v1/categories/stores/${categoryId}?limit=10&offset=1&type=all`,
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

    fetchStores();
  }, [subcatId, activeTab, moduleId]);

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
  const contentType = activeTab === 'Stores' ? 'stores' : 'products';

  return (
    <>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      {/* <View style={styles.header}>
       
        <Text style={styles.headerTitle}>
          {category && category.name ? category.name : 'Category'}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={24} onPress={() => navigation.navigate('SearchPage')} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton}>
            <Feather name="shopping-cart" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View> */}

   
      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => {
              // Don't switch to "Item" tab when clicking "All" under "Stores"
              if (tab === 'All') {
                setActiveTab('Stores'); // Stay on "Stores" tab
                setSubcatId(null); // Reset subcatId for "All" tab
              } else {
                setActiveTab(tab); // Switch to the selected subcategory tab
                const subcategory = subcat.find((item) => item.name === tab);
                if (subcategory) {
                  setSubcatId(subcategory.id); // Set the subcatId for the selected subcategory
                }
              }
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List Header */}
      <View style={styles.listHeader}>
        <Text
          style={[
            styles.itemHeaderText,
            contentType === 'stores' ? styles.inactiveHeaderText : {}
          ]}
          onPress={() => setActiveTab('Item')}
        >
          Item
        </Text>
        <Text
          style={[
            styles.storesHeaderText,
            contentType === 'stores' ? styles.activeStoresText : {}
          ]}
          onPress={() => setActiveTab('Stores')}
        >
          Stores
        </Text>
      </View>

      {/* Green Indicator */}
      <View
        style={[
          styles.indicator,
          contentType === 'stores' ? { marginLeft: 'auto', marginRight: 16 } : {}
        ]}
      />

      {/* Loading State */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#008800" />
        </View>
      )}

      {/* Error State */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Content Rendering */}
      {contentType === 'products' ? (
        <Products products={products} />
      ) : (
        <FlatList
          horizontal={true}
          style={styles.storesList}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={stores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <NewRestaurantCard {...item} />}
        />
      )}

      {/* Bottom Navigation Indicator */}
      {/* <View style={styles.bottomIndicator} /> */}
      
    </SafeAreaView>
    <BottomTab screen="HOME" />
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    padding: 8,
    marginRight: 8,
  },
  cartButton: {
    padding: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#E8F5E9',
  },
  tabText: {
    color: '#757575',
    fontSize: 14,
  },
  activeTabText: {
    color: '#000',
    fontWeight: '500',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  itemHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#008800',
  },
  storesHeaderText: {
    fontSize: 16,
    color: '#BDBDBD',
  },
  indicator: {
    width: 40,
    height: 3,
    backgroundColor: '#008800',
    marginLeft: 16,
  },
  bottomIndicator: {
    width: 100,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  storesList: {
    marginTop: 16,
  }
});

export default SubCategory;
