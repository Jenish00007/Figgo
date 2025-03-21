import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AddToFavourites from '../Favourites/AddtoFavourites';

const OfferCard = ({item}) => {
  
    const navigation = useNavigation();
    const {
        name,
        active,
        address,
        distance,   
        logo_full_url
    } = item;

    // Format distance to match the standardized format
    const formattedDistance = item?.distance ? `${Math.round(item.distance / 1000) || '100+'} km` : 'N/A';

    return (
        <View style={supermarketStyles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Restaurant', { ...item })}>
                <View style={supermarketStyles.header}>
                    <View style={supermarketStyles.headerLeft}>
                        <Image
                            source={{ uri: logo_full_url }}
                            style={supermarketStyles.logoIcon}
                        />
                        <Text style={supermarketStyles.title}>{name}</Text>
                    </View>
                    
                    <AddToFavourites restaurantId={item?.id}/>
                </View>

                <View style={supermarketStyles.addressContainer}>
                    <Image
                        source={require('../../assets/images/home.png')}
                        style={supermarketStyles.locationIcon}
                    />
                    <Text style={supermarketStyles.address}>{address}</Text>
                </View>

                <View style={supermarketStyles.footer}>
                    <View style={supermarketStyles.footerLeft}>
                        <Image
                            source={require('../../assets/images/other.png')}
                            style={supermarketStyles.distanceIcon}
                        />
                        <Text style={supermarketStyles.distance}>{formattedDistance}</Text>
                    </View>
                    {!active && (
                        <View style={supermarketStyles.closedBadge}>
                            <Text style={supermarketStyles.closedText}>Closed</Text>
                        </View>
                    )}
                    {active && (
                        <View style={[supermarketStyles.closedBadge, supermarketStyles.openBadge]}>
                            <Text style={supermarketStyles.openText}>Open</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default OfferCard;

const supermarketStyles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    newBadge: {
        backgroundColor: '#2E7D32',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    newText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    heartIcon: {
        width: 20,
        height: 20,
    },
    logoIcon: {
        width: 54,
        height: 54,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    locationIcon: {
        width: 20,
        height: 20,
    },
    address: {
        fontSize: 14,
        color: '#666666',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    distanceIcon: {
        width: 16,
        height: 16,
        tintColor: '#F7CA0F',
    },
    distance: {
        fontSize: 12,
        color: '#666666',
    },
    closedBadge: {
        backgroundColor: '#E0E0E0',
        borderRadius: 25,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    closedText: {
        color: '#666666',
        fontSize: 12,
        fontWeight: '600',
    },
    openBadge: {
        backgroundColor: '#FFF8E1',
    },
    openText: {
        color: '#F7CA0F',
        fontSize: 12,
        fontWeight: '600',
    },
});