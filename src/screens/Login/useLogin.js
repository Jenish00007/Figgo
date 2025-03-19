// useLogin.js
import { useState, useContext } from 'react'
import { Alert } from 'react-native'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import * as Notifications from 'expo-notifications'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import AuthContext from '../../context/Auth'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import AsyncStorage from '@react-native-async-storage/async-storage'
const API_URL = 'https://6ammart-admin.6amtech.com/api/v1/auth/login'

export const useLogin = () => {
  const navigation = useNavigation()
  const [input, setInput] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)
  const [inputError, setInputError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [loading, setLoading] = useState(false)

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { setTokenAsync } = useContext(AuthContext)
  const { t } = useTranslation()

  const isPhoneNumber = (value) => {
    // You can adjust this regex based on your phone number format requirements
    const phoneRegex = /^\+?[\d\s-]{10,}$/
    return phoneRegex.test(value)
  }

  const isEmail = (value) => {
    const emailRegex = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(value)
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      setTokenAsync(null)
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  function validateCredentials() {
    let result = true
    setInputError(null)
    setPasswordError(null)

    if (!input) {
      setInputError(t('pleaseEnterEmailOrPhone'))
      result = false
    } else if (!isEmail(input) && !isPhoneNumber(input)) {
      setInputError(t('invalidEmailOrPhone'))
      result = false
    }

    if (!password) {
      setPasswordError(t('passErr1'))
      result = false
    }

    return result
  }

  async function loginAction() {
    if (!validateCredentials()) return

    setLoading(true)
    try {
      let notificationToken = null
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        if (existingStatus === 'granted') {
          notificationToken = (
            await Notifications.getExpoPushTokenAsync({
              projectId: Constants.expoConfig.extra.eas.projectId
            })
          ).data
        }
      }
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_or_phone: input,
          password: password,
          login_type: 'manual',
          field_type: isPhoneNumber(input) ? 'phone' : 'email',
          alreadyInApp: false
        })
      })
      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401 || data.message === 'Unauthenticated') {
          // Clear token and trigger logout
          await logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error(data.message || 'Login failed')
      }
    

      // Assuming the API returns a token
      if (data.token) {
        await setTokenAsync(data.token)
       
        navigation.navigate({
          name: 'Main',
          merge: true
        })
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      FlashMessage({
        message: error.message || t('errorWhileLogging')
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    input,
    setInput,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    inputError,
    passwordError,
    loading,
    loginAction,
    currentTheme
  }
}