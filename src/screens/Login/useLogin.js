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
    // Phone number should be in format +91XXXXXXXXXX
    const phoneRegex = /^\+91\d{10}$/
    return phoneRegex.test(value)
  }

  function validateCredentials() {
    let result = true
    setInputError(null)
    setPasswordError(null)

    if (!input) {
      setInputError(t('pleaseEnterPhoneNumber'))
      result = false
    } else if (!isPhoneNumber(input)) {
      setInputError(t('invalidPhoneNumber'))
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
          field_type: 'phone',
          alreadyInApp: false
        })
      })

      const data = await response.json()
      if (!response.ok) {
        if (response.status === 401 || data.message === 'Unauthenticated') {
          await logout()
          throw new Error('Session expired. Please login again.')
        }
        throw new Error(data.message || 'Login failed')
      }

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

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      await AsyncStorage.removeItem('user')
      setTokenAsync(null)
      navigation.navigate('Login')
    } catch (error) {
      console.error('Error during logout:', error)
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
    currentTheme,
    themeContext
  }
}