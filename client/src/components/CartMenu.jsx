import React from 'react'

import CartItem from './CartItem'
import { addComma } from '../utils/helpers'

import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CartMenu = ({ handleToggleCartMenu, cartMenuRef }) => {
  const history = useHistory()

  const { totalPrice, products } = useSelector(({ cart }) => cart)

  const viewCart = () => {
    handleToggleCartMenu()
    history.push('/cart')
  }

  const handleCheckout = () => {
    handleToggleCartMenu()
    history.push('/checkout')
  }

  return (
    <div className='cart-menu' ref={cartMenuRef}>
      <i className='fa fa-close' onClick={handleToggleCartMenu} />
      <div className='cart-items-container'>
        {products && products.length > 0 ? (
          products.map(item => <CartItem {...item} key={item._id} />)
        ) : (
          <p className='empty-msg'>Your cart is empty!</p>
        )}
      </div>

      <div className='total-container'>
        <button className='view-cart' onClick={viewCart}>
          View Cart
        </button>
        <button className='check-out' onClick={handleCheckout}>
          Checkout
        </button>
        <p className='sub-total'>
          <span>Subtotal:</span> ${addComma(parseFloat(totalPrice).toFixed(2))}
        </p>
      </div>
    </div>
  )
}

export default CartMenu
