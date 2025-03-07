import { TouchableOpacity, View, ScrollView, Dimensions } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { scale } from '../../utils/scaling'
import { alignment } from '../../utils/alignment'
import styles from './styles'
import React, { useContext, useEffect, useState, useRef } from 'react'
import Spinner from '../../components/Spinner/Spinner'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import TextError from '../../components/Text/TextError/TextError'
import ConfigurationContext from '../../context/Configuration'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import analytics from '../../utils/analytics'
import Detail from '../../components/OrderDetail/Detail/Detail'
import RestaurantMarker from '../../assets/SVG/restaurant-marker'
import CustomerMarker from '../../assets/SVG/customer-marker'
import TrackingRider from '../../components/OrderDetail/TrackingRider/TrackingRider'

import OrdersContext from '../../context/Orders'

import { mapStyle } from '../../utils/mapStyle'
import { useTranslation } from 'react-i18next'
import { HelpButton } from '../../components/Header/HeaderIcons/HeaderIcons'

import {
  ProgressBar,
  checkStatus
} from '../../components/Main/ActiveOrders/ProgressBar'
import { useNavigation } from '@react-navigation/native'
import { PriceRow } from '../../components/OrderDetail/PriceRow'
import { ORDER_STATUS_ENUM } from '../../utils/enums'
import { CancelModal } from '../../components/OrderDetail/CancelModal'
import Button from '../../components/Button/Button'
//import { gql, useMutation } from '@apollo/client'
//import { cancelOrder as cancelOrderMutation } from '../../apollo/mutations'
import { FlashMessage } from '../../ui/FlashMessage/FlashMessage'
import { calulateRemainingTime } from '../../utils/customFunctions'
import { Instructions } from '../../components/Checkout/Instructions'

import MapViewDirections from 'react-native-maps-directions'
import useEnvVars from '../../../environment'
import LottieView from 'lottie-react-native'
const { height: HEIGHT, width: WIDTH } = Dimensions.get('screen')

// const CANCEL_ORDER = gql`
//   ${cancelOrderMutation}
// `

function OrderDetail(props) {
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const Analytics = analytics()
  const id = props.route.params ? props.route.params._id : null
  const user = props.route.params ? props.route.params.user : null

  //const { loadingOrders, errorOrders, orders } = useContext(OrdersContext)

  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()
  const navigation = useNavigation()
  const headerRef = useRef(false)
  const { GOOGLE_MAPS_KEY } = useEnvVars()
  const mapView = useRef(null)
  // const [cancelOrder, { loading: loadingCancel }] = useMutation(CANCEL_ORDER, {
  //   onError,
  //   variables: { abortOrderId: id }
  // })



  const [orders, setorders] = useState(true);
  const [loadingOrders, setloadingOrders] = useState(true);
  const [errorOrders, seterrorOrders] = useState(null);
  const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxOSIsImp0aSI6Ijg1NjRlYWE2YjU1MzNlZDRhOWNjZjM5OTQwZGExYTA5NTBhYWJjZjdhYzVkMTA3MGQ2NDQwNzE2N2IxN2RkZTE5OTkyNWQzZDNkODJjYmQ5IiwiaWF0IjoxNzQxMjUzMTE2Ljg4MjQ0OCwibmJmIjoxNzQxMjUzMTE2Ljg4MjQ1MSwiZXhwIjoxNzcyNzg5MTE2Ljg3ODUwMiwic3ViIjoiMzIiLCJzY29wZXMiOltdfQ.DlOX8MynZbowWs0mQX9wTIKIJkRDY_f9JhaHQrNTw6L8hLLtavfCZSisXwFu3yajjGZfvwXBDXHZmQq7c24G5CmrM3lTs_tJA06Dh_sBviwSXvk8cZ0ID9B0s9MqNqIEV7WO9W9SsnUtOex-T7XPKcan4PChuGQG2IcwI-OSh7SAKXUmr4mc6TEZGpCvupI3M2G3HLGoSO8s1OeK-srGc5l7Ida0lUsgYaxubNUl8MP_p3W7TNkYbM0ZUVe2ckIpfWM5sCwsp7V46Fb63VzrkY-HWJjk3fkWPp6hNcBxJTStHdbKOhTDkOm_9kVKt9W_G3heyoBKk7G7f7Bwwb0jTS1WGj4TspYec2j5RAwl5oORzXWtqNDF9mC0vxL3C1-28_9VsB1E82V1gaKkWEt4Q1RQ059WCbDgAuZdS2jFsqL7fxCm3seTAfi7VWFYqeIK_GSM84wdAPq-sztaQl_zGvCAAASeXAy4_9T7SBcoJ5RVX_CZWgoGpT1dU-9Sa8pMLBx2qDbojiypjyHMGGdMtCOZfS4Cc0Bvd4TkxYwobx595ubMiJ6d2plp-2oFdYUQ1vDlvTGXoiv_x9Wg8oa7ZDgkX4wW8DnwEndA2KwKY8zbg-As6ug4T2E9Eu8qBj8zb_ndNwvXVvVxVYLK0pn_tHqhFjrKknLVLyqTMNWNnK4"

  const fetchorders = useCallback(async () => {
    try {
      const response = await fetch('https://6ammart-admin.6amtech.com/api/v1/customer/order/list?limit=10&offset=1&type=all&guest_id=12342', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          //'moduleId': 1,
          'zoneId': [1],   
          //'latitude': 23.793544663762145,
          //'longitude': 90.41166342794895
        }
      });
      console.log("Token for orderdetails", token)

      if (!response.ok) {
        console.log('Error Status:', response.status);  
        console.log('Error Message:', response.message || data);  
        //setError(data.message || 'Failed to fetch profile')
      }
      const data = await response.json();

      console.log("Filtered Data:", data);

      setorders(data);
      setloadingOrders(false);
    } catch (err) {
      seterrorOrders(err.message || 'Error fetching orders');
      setloadingOrders(false);
    }
}, [token]);

  useEffect(() => {
    if (token) {
      fetchorders();
    }
  }, [token, fetchorders]);  
  

  useEffect(() => {
    async function Track() {
      await Analytics.track(Analytics.events.NAVIGATE_TO_ORDER_DETAIL, {
        orderId: id
      })
    }
    Track()
  }, [])

  const cancelModalToggle = () => {
    setCancelModalVisible(!cancelModalVisible)
  }
  function onError(error) {
    FlashMessage({
      message: error.message
    })
  }

  const order = orders?.find(o => o?._id === id)

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => HelpButton({ iconBackground: currentTheme.main, navigation, t }),
      headerTitle: `${order ? order?.deliveryAddress?.deliveryAddress?.substr(0, 15) : ""}...`,
      headerTitleStyle: { color: currentTheme.newFontcolor },
      headerStyle: { backgroundColor: currentTheme.newheaderBG }
    })
  }, [orders])

  if (loadingOrders || !order) {
    return (
      <Spinner
        backColor={currentTheme.themeBackground}
        spinnerColor={currentTheme.main}
      />
    )
  }
  if (errorOrders) return <TextError text={JSON.stringify(errorOrders)} />

  const remainingTime = calulateRemainingTime(order)
  const {
    _id,
    restaurant,
    deliveryAddress,
    items,
    tipping: tip,
    taxationAmount: tax,
    orderAmount: total,
    deliveryCharges
  } = order
  const subTotal = total - tip - tax - deliveryCharges
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: currentTheme.themeBackground,
          paddingBottom: scale(150)
        }}
        showsVerticalScrollIndicator={false}
        overScrollMode='never'
      >
        {order.rider && order.orderStatus === ORDER_STATUS_ENUM.PICKED && (
          <MapView
            ref={(c) => (mapView.current = c)}
            style={{ flex: 1, height: HEIGHT * 0.6 }}
            showsUserLocation={false}
            initialRegion={{
              latitude: +deliveryAddress.location.coordinates[1],
              longitude: +deliveryAddress.location.coordinates[0],
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
            zoomEnabled={true}
            zoomControlEnabled={true}
            rotateEnabled={false}
            customMapStyle={mapStyle}
            provider={PROVIDER_GOOGLE}
          >
            <Marker
              coordinate={{
                longitude: +restaurant.location.coordinates[0],
                latitude: +restaurant.location.coordinates[1]
              }}
            >
              <RestaurantMarker />
            </Marker>
            <Marker
              coordinate={{
                latitude: +deliveryAddress.location.coordinates[1],
                longitude: +deliveryAddress.location.coordinates[0]
              }}
            >
              <CustomerMarker />
            </Marker>
            <MapViewDirections
              origin={{
                longitude: +restaurant.location.coordinates[0],
                latitude: +restaurant.location.coordinates[1]
              }}
              destination={{
                latitude: +deliveryAddress.location.coordinates[1],
                longitude: +deliveryAddress.location.coordinates[0]
              }}
              apikey={GOOGLE_MAPS_KEY}
              strokeWidth={6}
              strokeColor={currentTheme.main}
              optimizeWaypoints={true}
              onReady={(result) => {
                //result.distance} km
                //Duration: ${result.duration} min.

                mapView?.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: WIDTH / 20,
                    bottom: HEIGHT / 20,
                    left: WIDTH / 20,
                    top: HEIGHT / 20
                  }
                })
              }}
              onError={(error) => {
                console.log('onerror', error)
              }}
            />
            {order.rider && <TrackingRider id={order.rider._id} />}
          </MapView>
        )}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            ...alignment.Pmedium
          }}
        >
          <OrderStatusImage status={order.orderStatus} />
          {order.orderStatus !== ORDER_STATUS_ENUM.DELIVERED && (
            <View
              style={{
                ...alignment.MTxSmall,
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              {![
                ORDER_STATUS_ENUM.PENDING,
                ORDER_STATUS_ENUM.CANCELLED
              ].includes(order.orderStatus) && (
                  <>
                    <TextDefault
                      style={{ ...alignment.MTxSmall }}
                      textColor={currentTheme.gray500}
                      H5
                    >
                      {t('estimatedDeliveryTime')}
                    </TextDefault>
                    <TextDefault
                      style={{ ...alignment.MTxSmall }}
                      Regular
                      textColor={currentTheme.gray900}
                      H1
                      bolder
                    >
                      {remainingTime}-{remainingTime + 5} {t('mins')}
                    </TextDefault>
                    <ProgressBar
                      configuration={configuration}
                      currentTheme={currentTheme}
                      item={order}
                      navigation={navigation}
                    />
                  </>
                )}
              <TextDefault
                H5
                style={{ ...alignment.Mmedium, textAlign: 'center' }}
                textColor={currentTheme.gray600}
                bold
              >
                {' '}
                {t(checkStatus(order.orderStatus).statusText)}
              </TextDefault>
            </View>
          )}
        </View>
        <Instructions title={'Instructions'} theme={currentTheme} message={order.instructions} />
        <Detail
          navigation={props.navigation}
          currencySymbol={configuration.currencySymbol}
          items={items}
          from={restaurant.name}
          orderNo={order.orderId}
          deliveryAddress={deliveryAddress.deliveryAddress}
          subTotal={subTotal}
          tip={tip}
          tax={tax}
          deliveryCharges={deliveryCharges}
          total={total}
          theme={currentTheme}
          id={_id}
          rider={order.rider}
          orderStatus={order.orderStatus}
        />
      </ScrollView>
      <View style={styles().bottomContainer(currentTheme)}>
        <PriceRow
          theme={currentTheme}
          title={t('total')}
          currency={configuration.currencySymbol}
          price={total.toFixed(2)}
        />
        {order.orderStatus === ORDER_STATUS_ENUM.PENDING && (
          <View style={{ margin: scale(20) }}>
            <Button
              text={t('cancelOrder')}
              buttonProps={{ onPress: cancelModalToggle }}
              buttonStyles={styles().cancelButtonContainer(currentTheme)}
              textProps={{ textColor: currentTheme.red600 }}
              textStyles={{ ...alignment.Pmedium }}
            />
          </View>
        )}
      </View>
      <CancelModal
        theme={currentTheme}
        modalVisible={cancelModalVisible}
        setModalVisible={cancelModalToggle}
        cancelOrder={cancelOrder}
        loading={loadingCancel}
        orderStatus={order.orderStatus}
      />
    </View>
  )
}

export const OrderStatusImage = ({ status }) => {
  let imagePath = null;
  switch (status) {
    case ORDER_STATUS_ENUM.PENDING:
      imagePath = require('../../assets/SVG/order-placed.json')
      break
    case ORDER_STATUS_ENUM.ACCEPTED:
      imagePath = require('../../assets/SVG/order-tracking-preparing.json')
      break
    case ORDER_STATUS_ENUM.ASSIGNED:
      imagePath = require('../../assets/SVG/food-picked.json')
      break
    case ORDER_STATUS_ENUM.COMPLETED:
      imagePath = require('../../assets/SVG/place-order.json')
      break
    case ORDER_STATUS_ENUM.DELIVERED:
      imagePath = require('../../assets/SVG/place-order.json')
      break
  }

  if (!imagePath) return null

  return <LottieView
    style={{
      width: 250,
      height: 250
    }}
    source={imagePath}
    autoPlay
    loop
  />


}

export default OrderDetail
