import React, { useEffect, useState } from 'react'
import { NotificationManager } from 'react-notifications'
// https://demo.kaliumtheme.com/fashion/checkout/order-received/1891/?key=wc_order_0lCVOKXjGdSpi

import { useSelector } from 'react-redux'

import { capitalize } from 'lodash'
import { authAxios } from '../utils/helpers'
import { useDispatch } from 'react-redux'

const checkout = async payload => {
  try {
    const res = await authAxios.post('/user/checkout', payload)
    console.log(res)
  } catch (error) {
    console.log(error.response.data)
  }
}

const OrderReceived = () => {
  const dispatch = useDispatch()
  const [isProcessingOrder, setIsProccessingOrder] = useState(true)
  const { cart, user } = useSelector(data => data)

  const { apartment, companyName, country, email, houseNumAndStrtName, name, phone, postcode, town } = user.data

  const { totalPrice } = cart

  const shippingOption = capitalize(cart.shippingOption.replaceAll('_', ' '))

  useEffect(() => {
    if (cart && user.isAuthenticated) {
      setIsProccessingOrder(true)
      const cartProducts = cart.products.map(({ name, imageURL, price, quantity }) => ({
        imageURL,
        name,
        price,
        quantity
      }))
      // get order number  after save

      const payload = { cartProducts, paymentMethod: shippingOption, totalPrice }

      checkout(payload)
    }

    NotificationManager.success('Your order has been received.', 'Thank you.')
    setIsProccessingOrder(false)

    // eslint-disable-next-line
  }, [])

  // if (!isProcessingOrder) {
  //   return <div>Processing Order</div>
  // }

  return (
    <div className='order-received'>
      <div className='payment-details'>
        <table>
          <thead>
            <tr>
              <th>Order number:</th>
              <th>Date:</th>
              <th>Email:</th>
              <th>Total:</th>
              <th>Payment method:</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1866</td>
              <td>Semptember 22, 2020</td>
              <td>{email}</td>
              <td>${totalPrice}</td>
              <td>{shippingOption}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='order-details'>
        <h2>Order details</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {/* eslint-disable-next-line */}
            {cart.products.map(({ name, price, quantity, _id }) => (
              <tr key={_id}>
                <td>
                  {name} &times; {quantity}
                </td>
                <td>{price}</td>
              </tr>
            ))}

            <tr>
              <td>Total</td>
              <td>${totalPrice}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='billing-details'>
        <h2>Billing details</h2>
        <p>{name}</p>
        {companyName && <p>{companyName}</p>}
        <p>{country}</p>
        <p>{houseNumAndStrtName}</p>
        {apartment && <p>{apartment}</p>}
        <p>{town}</p>
        <p>{postcode}</p>
        <p>{phone}</p>
        <p>{email}</p>
      </div>
    </div>
  )
}

export default OrderReceived
