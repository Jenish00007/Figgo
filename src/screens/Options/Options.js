import React, { useState, useContext, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  StatusBar,
  Modal,
  FlatList,
  usecurrentTheme,
  StyleSheet
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import UserContext from '../../context/User';
import { theme } from '../../utils/themeColors'; // Import the theme object
import OptionsStyles from './OptionsStyles';
import ThemeContext from '../../ui/ThemeContext/ThemeContext';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { formetedProfileData, logout } = useContext(UserContext);
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  

  // Get styles with theme colors
  const styles = OptionsStyles(currentTheme);
  

  const fullName = formetedProfileData ? 
    `${formetedProfileData.f_name || ''} ${formetedProfileData.l_name || ''}`.trim() : 
    'Welcome';

  // Language selection state
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const languages = [
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'he', name: 'Hebrew', nativeName: 'עברית' },
    { code: 'km', name: 'Khmer', nativeName: 'ខ្មែរ' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
  ];

  const handleLanguageSelect = useCallback((language) => {
    setSelectedLanguage(language.name);
    setLanguageModalVisible(false);
    // Here you would typically save the language preference
    // and potentially update your app's localization context
  }, []);

  // Handle logout
  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.themeBackground }]}>
      
        <StatusBar 
          backgroundColor={theme.Figgo.yellow} 
          barStyle="dark-content"
        />
        
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Profile Section */}
        <View style={[styles.profile, { backgroundColor: currentTheme.itemCardColor }]}>
          <TouchableOpacity 
            style={styles.profileCenter}
            onPress={() => navigation.navigate("Profile")}>
            <View style={styles.profileAvatarWrapper}>
              <Image
                alt="Profile"
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
                }}
                style={[styles.profileAvatar, { borderColor: currentTheme.primary }]} />

              <View style={[styles.profileAction, { backgroundColor: currentTheme.primary, borderColor: currentTheme.itemCardColor }]}>
                <FeatherIcon color="#fff" name="edit-3" size={15} />
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: currentTheme.fontMainColor }]}>{fullName}</Text>
            <Text style={[styles.profileRole, { color: currentTheme.fontSecondColor }]}>Customer</Text>
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.fontSecondColor }]}>General</Text>

          <View style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="mail" size={20} />
            </View>

            <View style={styles.detailContainer}>
              <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Email</Text>
              <Text style={[styles.rowValue, { color: currentTheme.fontSecondColor }]}>
                {formetedProfileData?.email || 'Add email'}
              </Text>
            </View>
          </View>

          <View style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="phone" size={20} />
            </View>

            <View style={styles.detailContainer}>
              <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Phone Number</Text>
              <Text style={[styles.rowValue, { color: currentTheme.fontSecondColor }]}>
                {formetedProfileData?.phone || 'Add phone number'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("SelectLocation")}
            style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="map-pin" size={20} />
            </View>

            <View style={styles.detailContainer} > 
              <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Address</Text>
              <Text style={[styles.rowValue, { color: currentTheme.fontSecondColor }]}>
                {formetedProfileData?.address || 'Add address'}
              </Text>
            </View>

            <FeatherIcon
              color={currentTheme.fontSecondColor}
              name="chevron-right"
              size={20} />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.fontSecondColor }]}>Preferences</Text>

          <TouchableOpacity
            onPress={() => setLanguageModalVisible(true)}
            style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="globe" size={20} />
            </View>

            <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Language</Text>

            <View style={styles.rowSpacer} />
            
            <Text style={[styles.rowValueInline, { color: currentTheme.fontSecondColor }]}>{selectedLanguage}</Text>

            <FeatherIcon
              color={currentTheme.fontSecondColor}
              name="chevron-right"
              size={20} />
          </TouchableOpacity>

          {/* <View style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="moon" size={20} />
            </View>

            <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Dark Mode</Text>

            <View style={styles.rowSpacer} />

            <Switch
              trackColor={{ false: "#e0e0e0", true: currentTheme.primary }}
              thumbColor={"#fff"}
              onValueChange={darkMode => setForm({ ...form, darkMode })}
              value={form.darkMode} />
          </View> */}

          {/* <View style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="at-sign" size={20} />
            </View>

            <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Email Notifications</Text>

            <View style={styles.rowSpacer} />

            <Switch
              trackColor={{ false: "#e0e0e0", true: currentTheme.primary }}
              thumbColor={"#fff"}
              onValueChange={emailNotifications =>
                setForm({ ...form, emailNotifications })
              }
              value={form.emailNotifications} />
          </View> */}

          {/* <View style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="bell" size={20} />
            </View>

            <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Push Notifications</Text>

            <View style={styles.rowSpacer} />

            <Switch
              trackColor={{ false: "#e0e0e0", true: currentTheme.primary }}
              thumbColor={"#fff"}
              onValueChange={pushNotifications =>
                setForm({ ...form, pushNotifications })
              }
              value={form.pushNotifications} />
          </View> */}
        </View>

        
        {/* Help & Support Section with updated content */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.fontSecondColor }]}>Help & Support</Text>

          <TouchableOpacity style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="help-circle" size={20} />
            </View>
            <View style={styles.detailContainer}>
              <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Help & Support</Text>
              <Text style={[styles.rowValue, { color: currentTheme.fontSecondColor }]}>
                Get help with your orders and questions
              </Text>
            </View>
            <FeatherIcon color={currentTheme.fontSecondColor} name="chevron-right" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="info" size={20} />
            </View>
            <View style={styles.detailContainer}>
              <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>About Us</Text>
              <Text style={[styles.rowValue, { color: currentTheme.fontSecondColor }]}>
                Learn about our mission and values
              </Text>
            </View>
            <FeatherIcon color={currentTheme.fontSecondColor} name="chevron-right" size={20} />
          </TouchableOpacity>

          {/* Terms & Conditions with content */}
          <TouchableOpacity style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="file-text" size={20} />
            </View>
            <View style={styles.detailContainer}>
              <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Terms & Conditions</Text>
              <Text style={[styles.rowValue, { color: currentTheme.fontSecondColor }]}>
                View our terms of service
              </Text>
            </View>
            <FeatherIcon color={currentTheme.fontSecondColor} name="chevron-right" size={20} />
          </TouchableOpacity>

          {/* Privacy Policy with content */}
          <TouchableOpacity style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="shield" size={20} />
            </View>
            <View style={styles.detailContainer}>
              <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Privacy Policy</Text>
              <Text style={[styles.rowValue, { color: currentTheme.fontSecondColor }]}>
                Learn how we protect your data
              </Text>
            </View>
            <FeatherIcon color={currentTheme.fontSecondColor} name="chevron-right" size={20} />
          </TouchableOpacity>

          {/* Other policies with content */}
          <TouchableOpacity style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="refresh-cw" size={20} />
            </View>
            <View style={styles.detailContainer}>
              <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Refund Policy</Text>
              <Text style={[styles.rowValue, { color: currentTheme.fontSecondColor }]}>
                View our refund policy
              </Text>
            </View>
            <FeatherIcon color={currentTheme.fontSecondColor} name="chevron-right" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="x-circle" size={20} />
            </View>
            <View style={styles.detailContainer}>
              <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Cancellation Policy</Text>
              <Text style={[styles.rowValue, { color: currentTheme.fontSecondColor }]}>
                View our cancellation policy
              </Text>
            </View>
            <FeatherIcon color={currentTheme.fontSecondColor} name="chevron-right" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.row, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.rowIcon, { backgroundColor: currentTheme.primary }]}>
              <FeatherIcon color="#fff" name="truck" size={20} />
            </View>
            <View style={styles.detailContainer}>
              <Text style={[styles.rowLabel, { color: currentTheme.fontMainColor }]}>Shipping Policy</Text>
              <Text style={[styles.rowValue, { color: currentTheme.fontSecondColor }]}>
                View our shipping policy
              </Text>
            </View>
            <FeatherIcon color={currentTheme.fontSecondColor} name="chevron-right" size={20} />
          </TouchableOpacity>
        </View>
        
        {/* Logout Button */}
        <TouchableOpacity 
          style={[
            styles.accountActionButton, 
            styles.logoutButton,
            { backgroundColor: currentTheme === 'dark' ? 'rgba(255, 59, 48, 0.2)' : 'rgba(255, 59, 48, 0.1)' }
          ]} 
          onPress={handleLogout}
        >
          <FeatherIcon name="log-out" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
       
        {/* Delete Account Button */}
        <TouchableOpacity 
          style={[
            styles.accountActionButton, 
            styles.deleteAccountButton,
            { backgroundColor: currentTheme === 'dark' ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 59, 48, 0.05)' }
          ]} 
          onPress={() => setDeleteModalVisible(true)}
        >
          <FeatherIcon name="trash-2" size={20} color="#FF3B30" />
          <Text style={styles.deleteAccountButtonText}>Delete Account</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: currentTheme.itemCardColor }]}>
            <View style={[styles.modalHeader, { borderBottomColor: currentTheme.borderBottomColor }]}>
              <Text style={[styles.modalTitle, { color: currentTheme.fontMainColor }]}>Select Language</Text>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <FeatherIcon name="x" size={24} color={currentTheme.fontMainColor} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.languageItem,
                    { borderBottomColor: currentTheme.borderBottomColor },
                    selectedLanguage === item.name && [
                      styles.selectedLanguageItem,
                      { backgroundColor: `${currentTheme.primary}20` }
                    ]
                  ]}
                  onPress={() => handleLanguageSelect(item)}
                >
                  <Text style={[styles.languageName, { color: currentTheme.fontMainColor }]}>{item.name}</Text>
                  <Text style={[styles.languageNativeName, { color: currentTheme.fontSecondColor }]}>{item.nativeName}</Text>
                  {selectedLanguage === item.name && (
                    <FeatherIcon name="check" size={20} color={currentTheme.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Update styles to improve spacing and alignment
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  
  detailContainer: {
    flex: 1,
    marginRight: 8,
  },
  
  rowValue: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
});