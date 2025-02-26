// Login.js
import React, { useLayoutEffect } from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './styles'
import Spinner from '../../components/Spinner/Spinner'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import { FontAwesome, SimpleLineIcons } from '@expo/vector-icons'
import { useLogin } from './useLogin'
import screenOptions from './screenOptions'
import { useTranslation } from 'react-i18next'

function Login(props) {
  const {
    input,
    setInput,
    password,
    setPassword,
    inputError,
    passwordError,
    loading,
    loginAction,
    currentTheme,
    showPassword,
    setShowPassword
  } = useLogin()
  const { t } = useTranslation()

  useLayoutEffect(() => {
    props.navigation.setOptions(
      screenOptions({
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.newFontcolor,
        iconColor: currentTheme.newIconColor,
        navigation: props.navigation
      })
    )
  }, [props.navigation])

  return (
    <SafeAreaView
      edges={['bottom', 'left', 'right']}
      style={styles(currentTheme).safeAreaViewStyles}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles().flex}>
        <ScrollView
          style={styles().flex}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}>
          <View style={styles(currentTheme).mainContainer}>
            <View style={styles().subContainer}>
              <View style={styles().logoContainer}>
                <SimpleLineIcons name="envelope" size={30} color={currentTheme.newIconColor} />
              </View>
              <View>
                <TextDefault
                  H3
                  bolder
                  textColor={currentTheme.newFontcolor}
                  style={{
                    ...alignment.MTlarge,
                    ...alignment.MBmedium
                  }}>
                  {t('Email or Phone')}
                </TextDefault>
              </View>
              <View style={styles().form}>
                <View>
                  <View>
                    <TextInput
                      placeholder={t('Email or Phone')}
                      style={[
                        styles(currentTheme).textField,
                        inputError ? styles(currentTheme).errorInput : {}
                      ]}
                      placeholderTextColor={currentTheme.fontSecondColor}
                      value={input}
                      onChangeText={e => setInput(e.trim())}
                      keyboardType="email-address"
                    />
                    {inputError && (
                      <TextDefault
                        style={styles().error}
                        bold
                        textColor={currentTheme.textErrorColor}>
                        {inputError}
                      </TextDefault>
                    )}
                  </View>
                
                  <View style={styles().passwordField}>
                    <TextInput
                      secureTextEntry={showPassword}
                      placeholder={t('password')}
                      style={[
                        styles(currentTheme).textField,
                        styles().passwordInput,
                        passwordError ? styles(currentTheme).errorInput : {}
                      ]}
                      placeholderTextColor={currentTheme.fontSecondColor}
                      value={password}
                      onChangeText={e => setPassword(e)}
                    />
                    <FontAwesome
                      onPress={() => setShowPassword(!showPassword)}
                      name={showPassword ? 'eye' : 'eye-slash'}
                      size={24}
                      color={
                        passwordError === null
                          ? currentTheme.newFontcolor
                          : currentTheme.textErrorColor
                      }
                      style={[styles().eyeBtn]}
                    />
                  </View>
                  {passwordError && (
                    <View>
                      <TextDefault
                        style={styles().error}
                        bold
                        textColor={currentTheme.textErrorColor}>
                        {passwordError}
                      </TextDefault>
                    </View>
                  )}
                  <TouchableOpacity
                    style={alignment.MBsmall}
                    activeOpacity={0.7}
                    onPress={() =>
                      props.navigation.navigate('ForgotPassword', { input })
                    }>
                    <TextDefault
                      textColor={currentTheme.main}
                      style={alignment.MTsmall}
                      bolder>
                      {t('forgotPassword')}
                    </TextDefault>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={loginAction}
                    activeOpacity={0.7}
                    style={styles(currentTheme).btn}>
                    <TextDefault
                      H4
                      textColor={currentTheme.black}
                      bold>
                      {loading ? (
                        <Spinner
                          backColor='transparent'
                          spinnerColor={currentTheme.white}
                          size="small"
                        />
                      ) : (
                        t('loginBtn')
                      )}
                    </TextDefault>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Login