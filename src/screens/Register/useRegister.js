import { useState, useContext } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { emailRegex, passRegex, nameRegex, phoneRegex } from '../../utils/regex'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

const useRegister = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const route = useRoute()

  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('Lastname')
  const [email, setEmail] = useState(route.params?.email || '')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(true)

  const [firstnameError, setFirstnameError] = useState(null)
  const [lastnameError, setLastnameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [phoneError, setPhoneError] = useState(null)
  const [countryCode, setCountryCode] = useState('IN')
  const [country, setCountry] = useState({
    callingCode: ['91'],
    cca2: 'IN',
    currency: ['INR'],
    flag: 'flag-in',
    name: 'India',
    region: 'Asia',
    subregion: 'Southern Asia'
  })

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const validateCredentials = () => {
    let result = true
    setEmailError(null)
    setPasswordError(null)
    setPhoneError(null)
    setFirstnameError(null)
    setLastnameError(null)

    if (!email) {
      setEmailError(t('emailErr1'))
      result = false
    } else if (!emailRegex.test(email.trim())) {
      setEmailError(t('emailErr2'))
      result = false
    }

    if (!password) {
      setPasswordError(t('passErr1'))
      result = false
    } else if (passRegex.test(password) !== true) {
      setPasswordError(t('passErr2'))
      result = false
    }

    if (!phone) {
      setPhoneError(t('mobileErr1'))
      result = false
    } else if (!phoneRegex.test(phone)) {
      setPhoneError(t('mobileErr2'))
      result = false
    }

    if (!firstname) {
      setFirstnameError(t('firstnameErr1'))
      result = false
    } else if (!nameRegex.test(firstname)) {
      setFirstnameError(t('firstnameErr2'))
      result = false
    }

    if (!lastname) {
      setLastnameError(t('lastnameErr1'))
      result = false
    } else if (!nameRegex.test(lastname)) {
      setLastnameError(t('lastnameErr2'))
      result = false
    }
    return result
  }

  const registerAction = async () => {
    if (validateCredentials()) {
      try {
        const requestData = {
          f_name: firstname,
          l_name: lastname,
          phone: `+${country.callingCode[0]}${phone}`,
          email: email.toLowerCase().trim(),
          password: password,
          ref_code: '',
          cm_firebase_token: '',
          guest_id: '',
          name: `${firstname} ${lastname}`
        }

        const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/auth/sign-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-localization': 'en',
          },
          body: JSON.stringify(requestData),
        })

        const data = await response.json()

        if (response.ok) {
          FlashMessage({
            message: t('registrationSuccess'),
          })
          navigation.replace('Login', {
            email: email.toLowerCase().trim()
          })
        } else {
          FlashMessage({
            message: data?.errors?.[0]?.message || data?.message || t('registrationFailed'),
          })
        }
      } catch (error) {
        FlashMessage({
          message: t('networkError'),
        })
      }
    }
  }

  const onCountrySelect = (country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }

  return {
    email,
    setEmail,
    emailError,
    firstname,
    setFirstname,
    firstnameError,
    lastname,
    setLastname,
    lastnameError,
    password,
    setPassword,
    passwordError,
    phone,
    setPhone,
    phoneError,
    showPassword,
    setShowPassword,
    country,
    countryCode,
    registerAction,
    onCountrySelect,
    themeContext,
    currentTheme
  }
}

export default useRegister
