import React, {
  useState,
  useRef,
  useContext,
  useLayoutEffect,
  useEffect
} from 'react'
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  Modal,
  Pressable
} from 'react-native'
import { TextField, OutlinedTextField } from 'react-native-material-textfield'
import { scale } from '../../utils/scaling'
import ChangePassword from './ChangePassword'
import { theme } from '../../utils/themeColors'
import UserContext from '../../context/User'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import styles from './styles'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import {
  useFocusEffect,
  useNavigation,
  useRoute
} from '@react-navigation/native'
import analytics from '../../utils/analytics'
import { Feather } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { HeaderBackButton } from '@react-navigation/elements'
import navigationService from '../../routes/navigationService'
import { useTranslation } from 'react-i18next'
import Spinner from '../../components/Spinner/Spinner'



function Profile(props) {
  const Analytics = analytics()
  const navigation = useNavigation()
  const route = useRoute()
  const { params } = route
  const { t } = useTranslation()
  const refName = useRef()
  const [nameError, setNameError] = useState('')
  const [toggleEmailView, setToggleEmailView] = useState(true)
  const [toggleNameView, setToggleNameView] = useState(params?.editName)
  const [toggleView, setToggleView] = useState(true)
  const [modelVisible, setModalVisible] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const {  formetedProfileData, logout } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const backScreen = props.route.params ? props.route.params.backScreen : null
  
  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(currentTheme.menuBar)
    }
    StatusBar.setBarStyle(
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    )
  })
 
  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: t('titleProfile'),
      headerRight: null,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.newheaderBG,
        elevation: 0
      },
      passChecker: showPass,
      closeIcon: toggleView,
      closeModal: setToggleView,
      modalSetter: setModalVisible,
      passwordButton: setShowPass,
      headerLeft: () => (
        <HeaderBackButton
          truncatedLabel=''
          backImage={() => (
            <View>
              <MaterialIcons
                name='arrow-back'
                size={25}
                color={currentTheme.newIconColor}
              />
            </View>
          )}
          onPress={() => {
            navigationService.goBack()
          }}
        />
      )
    })
  }, [props.navigation, showPass, toggleView])

  useEffect(() => {
    if (backScreen) {
      viewHideAndShowName()
      viewHideAndShowEmail()
    }
  }, [backScreen])

  function viewHideAndShowName() {
    setToggleNameView((prev) => !prev)
  }
  function viewHideAndShowEmail() {
    setToggleEmailView((prev) => !prev)
  }


  


  const handleNamePress = () => {
    viewHideAndShowName()
  }
  const handleNamePressUpdate = async () => {
    await updateName()
    viewHideAndShowName()
  }


  function changeNameTab() {
    return (
      <>
        <View style={styles(currentTheme).containerInfo}>
          <TextDefault
            textColor={currentTheme.iconColor}
            style={{ fontSize: scale(13) }}
            bolder
          >
            {formetedProfileData?.f_name || 'No name available'}
          </TextDefault>
        </View>
      </>
    )
  }

  function changeEmailTab() {
    return (
      <>
        <View style={styles(currentTheme).containerInfo}>
          <View style={styles(currentTheme).flexRow}>
            <TextDefault
              style={{ fontSize: scale(13) }}
              textColor={currentTheme.iconColor}
              bolder
            >
              {formetedProfileData?.email}
            </TextDefault>
          </View>
          {formetedProfileData !== '' && (
            <View
              style={[
                styles().verifiedButton,
                {
                  backgroundColor: formetedProfileData?.is_email_verified
                    ? currentTheme.newheaderColor
                    : currentTheme.buttonText
                }
              ]}
            >
             <TextDefault
                textColor={
                  formetedProfileData?.is_email_verified
                    ? currentTheme.color4
                    : currentTheme.white
                }
                bold
              >
                {formetedProfileData?.is_email_verified ? t('verified') : t('unverified')}
              </TextDefault>
            </View>
          )}
        </View>
      </>
    )
  }

  function changePasswordTab() {
    return (
      <>
        <View style={styles(currentTheme).containerInfo}>
          <TextDefault
            textColor={currentTheme.iconColor}
            style={{ fontSize: scale(13) }}
            bolder
          >
            ***********
          </TextDefault>
        </View>
      </>
    )
  }

  function changePhoneTab() {
    return (
      <>
        <View style={styles(currentTheme).containerInfo}>
          <View style={styles(currentTheme).flexRow}>
            <TextDefault
              style={{ fontSize: scale(13) }}
              textColor={currentTheme.iconColor}
              bolder
            >
              {formetedProfileData?.phone}
            </TextDefault>
          </View>
          {formetedProfileData !== '' && (
            <View
              style={[
                styles().verifiedButton,
                {
                  backgroundColor: formetedProfileData?.is_phone_verified
                    ? currentTheme.main
                    : currentTheme.fontFourthColor
                }
              ]}
            >
              <TextDefault
                textColor={
                  formetedProfileData?.is_phone_verified
                    ? currentTheme.color4
                    : currentTheme.white
                }
                bold
              >
                {formetedProfileData?.is_phone_verified ? t('verified') : t('unverified')}
              </TextDefault>
            </View>
          )}
        </View>
      </>
    )
  }

  const showModal = () => {
    setModalVisible(true)
  }

  return (
    <>
      <ChangePassword
        modalVisible={modelVisible}
        hideModal={() => {
          setModalVisible(false)
        }}
      />
      <View style={styles(currentTheme).formContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles(currentTheme).flex}
        >
          <View style={styles(currentTheme).mainContainer}>
            <View>
              <View style={styles(currentTheme).formSubContainer}>
                <View style={{ flex: 3 }}>
                  <View style={styles(currentTheme).containerHeading}>
                    {!toggleNameView && (
                      <>
                        <View style={styles(currentTheme).headingTitle}>
                          <TextDefault
                            H5
                            B700
                            bolder
                            left
                            textColor={currentTheme.darkBgFont}
                            style={styles(currentTheme).textAlignLeft}
                          >
                            {t('name')}
                          </TextDefault>
                        </View>
                      </>
                    )}
                  </View>
                  {!toggleNameView ? (
                    changeNameTab()
                  ) : (
                    <View>
                      <View style={styles(currentTheme).containerHeading}>
                        <View style={styles(currentTheme).headingTitle}>
                          <TextDefault
                            H5
                            B700
                            bolder
                            left
                            textColor={currentTheme.newFontcolor}
                            style={styles(currentTheme).textAlignLeft}
                          >
                            {t('name')}
                          </TextDefault>
                        </View>
                      </View>
                      <View style={{ marginTop: 10 }}>
                        <OutlinedTextField
                          ref={refName}
                          defaultValue={formetedProfileData?.f_name}
                          autoFocus={true}
                          maxLength={20}
                          textColor={currentTheme.newFontcolor}
                          baseColor={currentTheme.newFontcolor}
                          errorColor={currentTheme.textErrorColor}
                          tintColor={
                            !nameError ? currentTheme.newFontcolor : 'red'
                          }
                          error={nameError}
                        />
                      </View>

                      <TouchableOpacity
                        disabled={loadingMutation}
                        activeOpacity={0.7}
                        style={styles(currentTheme).saveContainer}
                        onPress={handleNamePressUpdate}
                      >
                        <TextDefault bold>{t('update')}</TextDefault>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View style={styles().headingLink}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles().headingButton}
                    onPress={handleNamePress}
                  >
                    <TextDefault textColor={currentTheme.editProfileButton}>
                      {t('edit')}
                    </TextDefault>
                  </TouchableOpacity>
                </View>
              </View>

              {/* email */}
              <View style={styles(currentTheme).formSubContainer}>
                <View style={{ flex: 3 }}>
                  <View style={styles().containerHeading}>
                    <View style={styles().headingTitle}>
                      <TextDefault
                        H5
                        B700
                        bolder
                        left
                        textColor={currentTheme.darkBgFont}
                        style={styles(currentTheme).textAlignLeft}
                      >
                        {t('email')}
                      </TextDefault>
                    </View>
                  </View>
                  {changeEmailTab()}
                </View>
                <View style={{ flex: 1 }} />
              </View>

              {/* password */}
              <View style={styles(currentTheme).formSubContainer}>
                <View style={{ flex: 3 }}>
                  <View style={styles().containerHeading}>
                    <View style={styles().headingTitle}>
                      <TextDefault
                        H5
                        B700
                        bolder
                        left
                        textColor={currentTheme.darkBgFont}
                        style={styles(currentTheme).textAlignLeft}
                      >
                        {t('password')}
                      </TextDefault>
                    </View>
                  </View>
                  {changePasswordTab()}
                </View>
                <View style={styles().headingLink}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={{ ...styles().headingButton }}
                    onPress={showModal}
                  >
                    <TextDefault textColor={currentTheme.editProfileButton}>
                      {t('change')}
                    </TextDefault>
                  </TouchableOpacity>
                </View>
              </View>

              {/* phone */}
              <View style={styles(currentTheme).formSubContainer}>
                <View style={{ flex: 3 }}>
                  <View style={styles().containerHeading}>
                    {toggleView && (
                      <>
                        <View style={styles().headingTitle}>
                          <TextDefault
                            H5
                            B700
                            bolder
                            left
                            textColor={currentTheme.darkBgFont}
                            style={styles(currentTheme).textAlignLeft}
                          >
                            {t('mobileNumber')}
                          </TextDefault>
                        </View>
                      </>
                    )}
                  </View>
                  {toggleView ? (
                    changePhoneTab()
                  ) : (
                    <View>
                      <View style={styles().containerHeading}>
                        <View style={styles().headingTitle}>
                          <TextDefault
                            textColor={currentTheme.fontMainColor}
                            H5
                            B700
                            bolder
                            style={styles(currentTheme).textAlignLeft}
                          >
                            {t('mobileNumber')}
                          </TextDefault>
                        </View>
                      </View>

                      <View>
                        <View style={{ ...alignment.MTxSmall }}></View>

                        <View style={styles().flexRow}>
                          <View>
                            <TextDefault>{formattedPhone}</TextDefault>
                          </View>
                          <View style={styles().phoneDetailsContainer}>
                            {(formetedProfileData?.phone === '' ||
                              !formetedProfileData?.is_phone_verified) && (
                              <TouchableOpacity
                                onPress={() =>
                                  props.navigation.navigate(
                                    formattedPhone === ''
                                      ? 'PhoneNumber'
                                      : 'PhoneOtp',
                                    { prevScreen: 'Profile' }
                                  )
                                }
                                disabled={
                                  formetedProfileData?.is_phone_verified &&
                                  formetedProfileData.phone !== ''
                                }
                              >
                                <TextDefault
                                  bold
                                  textColor={
                                    formetedProfileData?.is_phone_verified
                                      ? currentTheme.startColor
                                      : currentTheme.textErrorColor
                                  }
                                >
                                  {formetedProfileData.phone === ''
                                    ? t('addPhone')
                                    : formetedProfileData?.is_phone_verified
                                      ? t('verified')
                                      : t('verify')}
                                </TextDefault>
                              </TouchableOpacity>
                            )}
                            {formetedProfileData.phone !== '' && (
                              <Feather
                                style={{ marginLeft: 10, marginTop: -5 }}
                                name='check'
                                size={20}
                                color={currentTheme.black}
                                onPress={() =>
                                  props.navigation.navigate('PhoneNumber', {
                                    prevScreen: 'Profile'
                                  })
                                }
                              />
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
                <View style={styles().headingLink}>
                  <TouchableOpacity
                    activeOpacity={0.3}
                    style={styles().headingButton}
                    onPress={() =>
                      props.navigation.navigate('PhoneNumber', {
                        prevScreen: 'Profile'
                      })
                    }
                  >
                    <TextDefault textColor={currentTheme.editProfileButton}>
                      {t('edit')}
                    </TextDefault>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setDeleteModalVisible(true)}>
                <TextDefault
                  bolder
                  H4
                  textColor={currentTheme.deleteAccountBtn}
                >
                  {t('DeleteAccount')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            onBackdropPress={() => setDeleteModalVisible(false)}
            onBackButtonPress={() => setDeleteModalVisible(false)}
            visible={deleteModalVisible}
            onRequestClose={() => {
              setDeleteModalVisible(false)
            }}
          >
            <View style={styles().centeredView}>
              <View style={styles(currentTheme).modalView}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 24,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: scale(10)
                  }}
                >
                  <TextDefault bolder H3 textColor={currentTheme.newFontcolor}>
                    {t('DeleteConfirmation')}
                  </TextDefault>
                  <Feather
                    name='x-circle'
                    size={24}
                    color={currentTheme.newFontcolor}
                    onPress={() => setDeleteModalVisible(!deleteModalVisible)}
                  />
                </View>
                {/* <TextDefault H5 textColor={currentTheme.newFontcolor}>
                  {t('permanentDeleteMessage')}
                </TextDefault>
                <TouchableOpacity
                  style={[
                    styles(currentTheme).btn,
                    styles().btnDelete,
                    { opacity: deactivateLoading ? 0.5 : 1 }
                  ]}
                 
                >
                  {deactivateLoading ? (
                    <Spinner backColor='transparent' size='small' />
                  ) : (
                    <TextDefault bolder H4 textColor={currentTheme.white}>
                      {t('yesSure')}
                    </TextDefault>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles(currentTheme).btn, styles().btnCancel]}
                  onPress={() => setDeleteModalVisible(false)}
                  disabled={deactivateLoading}
                >
                  <TextDefault bolder H4 textColor={currentTheme.black}>
                    {t('noDelete')}
                  </TextDefault>
                </TouchableOpacity> */}
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </View>
    </>
  )
}

export default Profile
