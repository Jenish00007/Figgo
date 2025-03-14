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
              <Icon
                name="favorite" 
                size={20}
                color="red"
              />

            </View>
            <View style={{ flexDirection: 'row', paddingRight: 16 }}>
              <View style={styles.addIconView}>
                <Icon name="place" size={20} color="white" />
              </View>
              <Text style={[styles.textStyle, styles.moneyText]}>
                10 Km
              </Text>
              {!item.active && (
                <View style={styles.closedBadge}>
                  <Text style={styles.closedText}>Closed</Text>
                </View>
              )}
              {item?.active && (
                <View style={styles.closedBadge}>
                  <Text style={styles.closedText}>Open</Text>
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
    flex: 1,
    fontFamily: 'WorkSans-SemiBold',
    color: '#FFD700',
  },
  addIconView: {
    padding: 4,
    backgroundColor: '#FFD700',
    borderRadius: 8,
  },
});

export default CategoryListView;
