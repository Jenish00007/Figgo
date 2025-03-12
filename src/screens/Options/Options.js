import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  ActivityIndicator,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AuthContext from './../../context/Auth'; // Keep original import

export default function Example() {
  const navigation = useNavigation();
  const { token } = useContext(AuthContext);  // Keep original token from Context

  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });
  
  const [userData, setUserData] = useState({
    name: '',
    address: '', 
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  // Keep the original fetch function as requested
  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/customer/info', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Fixed the template literal
          'Content-Type': 'application/json',
          'X-localization': 'en'
        }
      });

      if (!response.ok) {
        console.log('Error Status:', response.status);
        setError('Failed to fetch profile');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log("Profile Data:", data);

      // Keep original data setting
      setUserData({
        name: `${data.f_name} ${data.l_name}`,    // Fixed the template literal
        address: data.address || 'Address not available'
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
      setLoading(false);
    }
  }, [token]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.profile}>
        <TouchableOpacity
          onPress={() => {
            // handle onPress
          }}>
          <View style={styles.profileAvatarWrapper}>
            <Image
              alt=""
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
              }}
              style={styles.profileAvatar} />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Profile")
              }}>
              <View style={styles.profileAction}>
                <FeatherIcon color="#fff" name="edit-3" size={15} />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View>
          {loading ? (
            <ActivityIndicator size="small" color="#007bff" style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <Text style={styles.profileName}>{userData.name}</Text>
              <Text style={styles.profileAddress}>{userData.address}</Text>
            </>
          )}
        </View>
      </View>

      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
              <FeatherIcon color="#fff" name="globe" size={20} />
            </View>

            <Text style={styles.rowLabel}>Language</Text>

            <View style={styles.rowSpacer} />

            <FeatherIcon
              color="#C6C6C6"
              name="chevron-right"
              size={20} />
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
              <FeatherIcon color="#fff" name="moon" size={20} />
            </View>

            <Text style={styles.rowLabel}>Dark Mode</Text>

            <View style={styles.rowSpacer} />

            <Switch
              onValueChange={darkMode => setForm({ ...form, darkMode })}
              value={form.darkMode} />
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SelectLocation')
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
              <FeatherIcon
                color="#fff"
                name="navigation"
                size={20} />
            </View>
         
            <Text style={styles.rowLabel}>Location</Text>

            <View style={styles.rowSpacer} />

            <FeatherIcon
              color="#C6C6C6"
              name="chevron-right"
              size={20} />
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
              <FeatherIcon color="#fff" name="at-sign" size={20} />
            </View>

            <Text style={styles.rowLabel}>Email Notifications</Text>

            <View style={styles.rowSpacer} />

            <Switch
              onValueChange={emailNotifications =>
                setForm({ ...form, emailNotifications })
              }
              value={form.emailNotifications} />
          </View>

          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#38C959' }]}>
              <FeatherIcon color="#fff" name="bell" size={20} />
            </View>

            <Text style={styles.rowLabel}>Push Notifications</Text>

            <View style={styles.rowSpacer} />

            <Switch
              onValueChange={pushNotifications =>
                setForm({ ...form, pushNotifications })
              }
              value={form.pushNotifications} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
              <FeatherIcon color="#fff" name="flag" size={20} />
            </View>

            <Text style={styles.rowLabel}>Report Bug</Text>

            <View style={styles.rowSpacer} />

            <FeatherIcon
              color="#C6C6C6"
              name="chevron-right"
              size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
              <FeatherIcon color="#fff" name="mail" size={20} />
            </View>

            <Text style={styles.rowLabel}>Contact Us</Text>

            <View style={styles.rowSpacer} />

            <FeatherIcon
              color="#C6C6C6"
              name="chevron-right"
              size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}
            style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
              <FeatherIcon color="#fff" name="star" size={20} />
            </View>

            <Text style={styles.rowLabel}>Rate in App Store</Text>

            <View style={styles.rowSpacer} />

            <FeatherIcon
              color="#C6C6C6"
              name="chevron-right"
              size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /** Profile */
  profile: {
    padding: 24,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAction: {
    position: 'absolute',
    right: -4,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: '#007bff',
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: '#414d63',
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: '#989898',
    textAlign: 'center',
  },
  /** Section */
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  /** Row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: '#0c0c0c',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  /** Loading and Error States */
  loader: {
    marginTop: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
});