import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Products = ({ products }) => {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {products?.map((item, index) => (
                <View key={item._id} >
                    <TouchableOpacity
                        onPress={() => navigation.push('ProductDetail', { product: item })}
                    >
                        <View style={styles.itemContainer}>
                            <ImageBackground
                                  source={{ uri: item?.image_full_url}}
                                style={styles.cardImageBG}
                                resizeMode="cover"
                            >
                                {/* <View style={styles.cardRatingContainer}>
                                    <FontAwesome name='heart-o' color={Color.colorTomato} size={18} />
                                </View> */}
                            </ImageBackground>
                            <Text style={styles.cardTitle}>{item?.name}</Text>
                            {/* <Text style={styles.cardSubtitle}><Ionicons name="location-sharp" size={14} color={Color.colorTomato} />Address</Text> */}
                            <View style={styles.cardFooterRow}>
                                <Text style={styles.cardPriceCurrency}>₹</Text>
                                <Text style={styles.cardPrice}>{item?.price}</Text>
                                {/* <TouchableOpacity>
                                    <FontAwesome6 style={{ marginLeft: 60 }} name="heart" size={24} color="black" />
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
 
    container: {
        flexDirection: 'row',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        gap: 20,
        marginTop: 10
    },
    itemContainer: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        elevation: 24,
     
        marginTop: 10
    },
    cardLinearGradientContainer: {
        //padding: 0,
        // backgroundColor: Colors.WHITE,
        // width: 150,
    },
    cardImageBG: {
        width: 130,
        height: 130,
        marginBottom: 5,
        overflow: 'hidden',
    },
    // cardRatingContainer: {
    //     flexDirection: 'row',
    //     backgroundColor: Colors.WHITE,
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     gap: 10,
    //     paddingHorizontal: 10,
    //     position: 'absolute',
    //     borderBottomLeftRadius: 50,
    //     borderTopRightRadius: 0,
    //     top: 0,
    //     right: 0,
    // },
    cardRatingText: {
        color: 'red',
        lineHeight: 22,
        fontSize: 14,
    },
    cardTitle: {
        color: 'black',
        fontSize: 16,
        width: 130,
        height: 20
    },
    cardSubtitle: {
        color: 'black',
        fontSize: 10,
    },
    cardFooterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    cardPriceCurrency: {
        color: 'black',
        fontSize: 18,
        fontWeight: '700'
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: '700'
    },
});

export default Products;