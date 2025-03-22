import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AddToFavourites from '../Favourites/AddtoFavourites';

// CategoryListView component
const CategoryListView = ({ data }) => {
  // Check if data is properly passed
  if (!data) {
    return null;  // If data is undefined or null, return nothing or handle accordingly
  }

  const { index, item } = data;  // Destructure index and item from data

  // Ensure item is defined before rendering
  if (!item) {
    return null;  // If item is undefined, return nothing or handle accordingly
  }
 const navigation = useNavigation();

  const translateX = useRef(new Animated.Value(50));
  const opacity = useRef(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX.current, {
        toValue: 0,
        duration: 300,
        delay: index * (300 / 4),
        useNativeDriver: true,
      }),
      Animated.timing(opacity.current, {
        toValue: 1,
        duration: 300,
        delay: index * (300 / 4),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);
  const formattedDistance = item?.distance ? `${Math.round(item?.distance / 1000) || '100+'} km` : 'N/A';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacity.current,
          transform: [{ translateX: translateX.current }],
        },
      ]}
    >

      <TouchableOpacity onPress={() => navigation.navigate('Restaurant', { ...item })} style={{ height: 134, width: 280 }} touchOpacity={0.6} >
        <View style={styles.bgColorView} />
        <View style={{ ...StyleSheet.absoluteFillObject, flexDirection: 'row' }}>
          <View style={{ paddingVertical: 24, paddingLeft: 16, }}>
            <Image
              style={{ flex: 1, borderRadius: 16, aspectRatio: 1.0, }}
              source={{ uri: item?.logo_full_url }}
            />
          </View>
          <View style={{ flex: 1, paddingLeft: 16, paddingVertical: 16 }}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.lessionCountRatingContainer}>
              <Text style={[styles.textStyle, { flex: 1, fontSize: 16 }]}>
                {item?.name}
              </Text>
              <Text style={styles.textStyle}>{item?.rating}</Text>
              <AddToFavourites restaurantId={item?.id}/>

            </View>
            <View style={{ flexDirection: 'row', paddingRight: 16, alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={styles.locationContainer}>
                <View style={styles.addIconView}>
                  <Icon name="place" size={20} color="white" />
                </View>
                <Text style={[styles.textStyle, styles.moneyText]}>
                  {formattedDistance}
                </Text>
              </View>
              {!item.active && (
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Closed</Text>
                </View>
              )}
              {item?.active && (
                <View style={[styles.statusBadge, styles.openBadge]}>
                  <Text style={[styles.statusText, styles.openText]}>Open</Text>
                </View>
              )}
            </View>

          </View>
        </View>
      </TouchableOpacity>
    
    </Animated.View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: { borderRadius: 16, overflow: 'hidden' },
  bgColorView: {
    flex: 1,
    marginLeft: 55,
    borderRadius: 10,
    backgroundColor: '#F3FAFA',
  },
  closedBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  closedText: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '600',
  },
  title: {
    fontSize: 16,
    fontFamily: 'WorkSans-SemiBold',
    letterSpacing: 0.27,
    color: '#17262A',
  },
  lessionCountRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    paddingBottom: 8,
  },
  textStyle: {
    fontSize: 18,
    fontFamily: 'WorkSans-Regular',
    letterSpacing: 0.27,
    color: 'black',
  },
  moneyText: {
    fontFamily: 'WorkSans-SemiBold',
    color: '#666666',
    fontSize: 14,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  statusText: {
    color: '#666666',
    fontSize: 10,
    fontWeight: '600',
  },
  openBadge: {
    backgroundColor: '#FFF8E1',
  },
  openText: {
    color: '#F7CA0F',
  },
  addIconView: {
    padding: 4,
    backgroundColor: '#F7CA0F',
    borderRadius: 8,
    marginRight: 4,
  },
});

export default CategoryListView;
