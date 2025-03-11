import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Categories({ categories }) {
  const navigation = useNavigation();

  // Function to handle animation for each category item
  const handleAnimation = (index) => {
    const translateX = new Animated.Value(50); // Initialize animation value
    const opacity = new Animated.Value(0); // Initialize opacity

    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        delay: index * (300 / 4), // Delay based on index
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * (300 / 4), // Delay based on index
        useNativeDriver: true,
      }),
    ]).start();

    return { translateX, opacity };
  };

  return (
    <View>
      <FlatList
        data={categories}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({ item, index }) => {
          const { translateX, opacity } = handleAnimation(index);

          return (
            <TouchableOpacity
              onPress={() => navigation.push('SubCategory', { category: item })}
            >
              <Animated.View
                style={[
                  styles.container,
                  {
                    transform: [{ translateX }], // Applying animation
                    opacity: opacity, // Applying animation
                  },
                ]}
              >
                {/* Circular image */}
                <View style={styles.iconContainer}>
                  <Image
                    style={styles.icon}
                    source={{ uri: item?.image_full_url }}
                  />
                </View>
                <Text style={styles.text}>{item?.name}</Text>
              </Animated.View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id.toString()} // Use a unique key for each item
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    backgroundColor: '#F5F5F5', // You might need to ensure this is defined correctly in your themeColors file
    padding: 10,
    borderRadius: 10, // Ensures the container is circular
    justifyContent: 'center',
    alignItems: 'center', // Centers the image inside the container
  },
  container: {
    alignItems: 'center',
    padding: 10,
    width: 100,
  },
  icon: {
    width: 50, // Adjust the size of the image
    height: 50, // Adjust the size of the image
    borderRadius: 20, // Makes the image circular by setting it to half of width/height
  },
  text: {
    marginTop: 5, // Adding a margin for better spacing between icon and text
    fontSize: 14, // You can adjust the font size according to your needs
  },
});
