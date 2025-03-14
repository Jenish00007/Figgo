import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './styles';
import UserContext from '../../context/User';
import { theme } from '../../utils/themeColors'
import { scale } from '../../utils/scaling'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

function BottomTab({ screen }) {
  const navigation = useNavigation();
  const { isLoggedIn, cartCount, orders } = useContext(UserContext);

  const getIconColor = (currentScreen) => {
    return screen === currentScreen ? theme.Figgo.yellow : theme.Dark.darkGrayText;
  };

  const getTextStyle = (currentScreen) => {
    return screen === currentScreen ? styles.activeText : styles.inactiveText;
  };

  return (
    <View style={styles.footerContainer}>
      {/* Home Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MainLanding')}
        style={styles.footerBtnContainer}
      >
        <MaterialCommunityIcons
          name="home" // Solid green icon
          size={scale(20)}
          color={getIconColor('HOME')}
        />
        <Text style={getTextStyle('HOME')}>Home</Text>
      </TouchableOpacity>

      {/* Cart Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Favourite')}
        style={styles.footerBtnContainer}
      >
        <View style={styles.imgContainer}>
          <SimpleLineIcons
            name="heart" // Solid green icon
            size={scale(20)}
            color={getIconColor('WhereToGo')}
          />


          {cartCount > 0 && (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </View>
        <Text style={getTextStyle('WhereToGo')}>Favourite</Text>
      </TouchableOpacity>


      {/* Cart Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Cart')}
        style={styles.footerBtnContainer}
      >
        <MaterialCommunityIcons
          name="cart"
          size={scale(20)}
          color={getIconColor('FAVOURITES')}
        />
        <Text style={getTextStyle('FAVOURITES')}>Cart</Text>
      </TouchableOpacity>

      {/* Favourites Icon */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MyOrders')}
        style={styles.footerBtnContainer}
      >
        <MaterialCommunityIcons
          name="note"
          size={scale(20)}
          color={getIconColor('FAVOURITES')}
        />
        <Text style={getTextStyle('FAVOURITES')}>Orders</Text>
      </TouchableOpacity>

      {/* Profile Icon */}
      <TouchableOpacity
        onPress={() => {
          if (isLoggedIn) {
            navigation.navigate('Options');
          } else {
            navigation.navigate('Login');
          }
        }}
        style={styles.footerBtnContainer}
      >
        <View style={styles.profileContainer}>
          <MaterialCommunityIcons
            name="menu"
            size={scale(20)}
            color={getIconColor('PROFILE')}
          />

        </View>
        <Text style={getTextStyle('PROFILE')}>Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

export default BottomTab;
