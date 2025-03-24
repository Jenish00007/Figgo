import React from 'react'
import { View } from 'react-native'
import { scale } from '../../../utils/scaling'
import { useSubscription } from '@apollo/client'
import { subscriptionOrder } from '../../../apollo/subscriptions'
import gql from 'graphql-tag'
import { ORDER_STATUS_ENUM } from '../../../utils/enums'

export const orderStatuses = [
  {
    key: 'PENDING',
    status: 1,
    statusText: 'pendingOrder'
  },
  {
    key: 'ACCEPTED',
    status: 2,
    statusText: 'acceptedOrder'
  },
  {
    key: 'ASSIGNED',
    status: 3,
    statusText: 'assignedOrder'
  },
  {
    key: 'PICKED',
    status: 4,
    statusText: 'pickedOrder'
  },
  {
    key: 'DELIVERED',
    status: 5,
    statusText: 'deliveredOrder'
  },
  {
    key: 'COMPLETED',
    status: 6,
    statusText: 'completedOrder'
  },
  {
    key: 'CANCELLED',
    status: 6,
    statusText: 'cancelledOrder'
  }
]

export const checkStatus = status => {
  if (!status) return orderStatuses[0] // Return PENDING status as default
  
  const obj = orderStatuses.filter(x => x.key === status)
  return obj.length > 0 ? obj[0] : orderStatuses[0] // Return first status if not found
}

export const ProgressBar = ({ currentTheme, item, customWidth }) => {
  // Add null checks
  if (!item || !item.orderStatus) return null
  if (item.orderStatus === ORDER_STATUS_ENUM.CANCELLED) return null

  const status = checkStatus(item.orderStatus)
  if (!status) return null

  const defaultWidth = scale(50)
  const width = customWidth !== undefined ? customWidth : defaultWidth

  return (
    <View style={{ marginTop: scale(10) }}>
      <View style={{ flexDirection: 'row' }}>
        {Array(status.status)
          .fill(0)
          .map((_, index) => (
            <View
              key={index}
              style={{
                height: scale(4),
                backgroundColor: currentTheme.primary,
                width: width,
                marginRight: scale(10)
              }}
            />
          ))}
        {Array(4 - status.status)
          .fill(0)
          .map((_, index) => (
            <View
              key={index}
              style={{
                height: scale(4),
                backgroundColor: currentTheme.gray200,
                width: width,
                marginRight: scale(10)
              }}
            />
          ))}
      </View>
    </View>
  )
}
