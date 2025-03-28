import { View, Image, ScrollView } from 'react-native'
import React from 'react'
import TextDefault from '../../Text/TextDefault/TextDefault'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'
import { ChatButton } from './ChatButton'
import { ORDER_STATUS_ENUM } from '../../../utils/enums'
import { formatNumber } from '../../../utils/formatNumber'

export default function Detail({
  theme,
  from,
  orderNo,
  deliveryAddress,
  items,
  currencySymbol = "₹",
  subTotal,
  tip,
  tax,
  deliveryCharges,
  total,
  navigation,
  id,
  rider,
  orderStatus
}) {
  const { t } = useTranslation()
  
  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <ScrollView style={styles.container(theme)}>
      {rider && orderStatus !== ORDER_STATUS_ENUM.DELIVERED && (
        <ChatButton
          onPress={() => navigation.navigate('ChatWithRider', { id, orderNo, total })}
          title={t('chatWithRider')}
          description={t('askContactlessDelivery')}
          theme={theme}
        />
      )}
      
      {/* Order Header Section */}
      <View style={styles.section}>
        <TextDefault
          textColor={theme.gray500}
          bolder
          H4
          style={{ ...alignment.MBsmall }}
        >
          {from}
        </TextDefault>
        <View style={styles.orderNumberContainer}>
          <TextDefault
            textColor={theme.gray500}
            bolder
            H5
            style={{ ...alignment.MBmedium }}
          >
            {t('yourOrder')}
          </TextDefault>
          <TextDefault
            textColor={theme.lightBlue}
            bolder
            H4
            style={{ ...alignment.MBmedium }}
          >
            #{orderNo?.toString()?.toLowerCase() || ''}
          </TextDefault>
        </View>
      </View>

      {/* Delivery Address Section */}
      <View style={styles.section}>
        <TextDefault
          textColor={theme.gray500}
          bolder
          H5
          style={{ ...alignment.MBsmall }}
        >
          {t('deliveryAddress')}
        </TextDefault>
        <TextDefault
          textColor={theme.gray900}
          Regular
          style={{ ...alignment.MBmedium }}
        >
          {deliveryAddress}
        </TextDefault>
      </View>

      {/* Order Items Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TextDefault
            textColor={theme.gray500}
            bolder
            H5
            bold
          >
            {t('itemsAndQuantity')} ({items.length})
          </TextDefault>
          <TextDefault
            textColor={theme.gray500}
            bolder
            H5
            bold
          >
            {t('price')}
          </TextDefault>
        </View>
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <ItemRow
              key={item._id}
              theme={theme}
              quantity={item.quantity}
              title={`${item.title} ${item.variation.title}`}
              currency={currencySymbol}
              price={item.variation.price}
              options={item.addons.map((addon) =>
                addon.options.map(({ title }) => title)
              )}
              image={item.image}
            />
          ))}
        </View>
      </View>

      {/* Price Summary Section */}
      <View style={styles.section}>
        <TextDefault
          textColor={theme.gray500}
          bolder
          H5
          style={{ ...alignment.MBsmall }}
        >
          {t('priceSummary')}
        </TextDefault>
        <View style={styles.priceRow}>
          <TextDefault textColor={theme.gray600}>{t('subtotal')}</TextDefault>
          <TextDefault textColor={theme.gray900}>
            {currencySymbol}{formatIndianCurrency(subTotal)}
          </TextDefault>
        </View>
        <View style={styles.priceRow}>
          <TextDefault textColor={theme.gray600}>{t('deliveryFee')}</TextDefault>
          <TextDefault textColor={theme.gray900}>
            {currencySymbol}{formatIndianCurrency(deliveryCharges)}
          </TextDefault>
        </View>
        <View style={styles.priceRow}>
          <TextDefault textColor={theme.gray600}>{t('tax')}</TextDefault>
          <TextDefault textColor={theme.gray900}>
            {currencySymbol}{formatIndianCurrency(tax)}
          </TextDefault>
        </View>
        {tip > 0 && (
          <View style={styles.priceRow}>
            <TextDefault textColor={theme.gray600}>{t('tip')}</TextDefault>
            <TextDefault textColor={theme.gray900}>
              {currencySymbol}{formatIndianCurrency(tip)}
            </TextDefault>
          </View>
        )}
        <View style={[styles.priceRow, styles.totalRow]}>
          <TextDefault textColor={theme.gray900} bold>
            {t('total')}
          </TextDefault>
          <TextDefault textColor={theme.gray900} bold>
            {currencySymbol}{formatIndianCurrency(total)}
          </TextDefault>
        </View>
      </View>
    </ScrollView>
  )
}

const ItemRow = ({
  theme,
  quantity,
  title,
  options = [],
  price,
  currency = "₹",
  image
}) => {
  const { t } = useTranslation()
  
  const formatIndianCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <View style={styles.itemRow(theme)}>
      <View style={styles.itemImageContainer}>
        <Image
          style={styles.itemImage}
          source={
            image
              ? { uri: image }
              : require('../../../assets/images/food_placeholder.png')
          }
        />
      </View>
      <View style={styles.itemDetails}>
        <TextDefault
          left
          numberOfLines={1}
          textColor={theme.gray900}
          H5
          bolder
          style={{ ...alignment.MBxSmall }}
        >
          {title}
        </TextDefault>

        {options.length > 0 && (
          <TextDefault
            bold
            textColor={theme.gray600}
            left
            style={{ ...alignment.MBxSmall }}
            numberOfLines={2}
          >
            {options.join(', ')}
          </TextDefault>
        )}

        <TextDefault Regular left bolder textColor={theme.gray900}>
          x{quantity}
        </TextDefault>
      </View>
      <TextDefault
        right
        style={styles.itemPrice}
        bolder
        textColor={theme.gray900}
        H5
      >
        {currency}
        {formatIndianCurrency(price)}
      </TextDefault>
    </View>
  )
}
