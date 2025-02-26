import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Color } from "../../utils/themeColors"; // Adjust this import according to your project structure

export default function Categories({ categories }) {
    const navigation = useNavigation();

    return (
        <View>
            <FlatList
                data={categories}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => navigation.push('SubCategory', { category: item })}
                    >
                        <View style={styles.container}>
                            {/* Circular image */}
                            <View style={styles.iconContainer}>
                            <Image
                                    style={styles.icon}
                                    source={{ uri: item?.image_full_url }} 
                                />
                            </View>
                            <Text style={styles.text}>{item?.name}</Text>
                        </View>
                    </TouchableOpacity>
                )}
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
    }
});
