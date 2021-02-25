export const addToCart = payload => dispatch => {
  dispatch({ type: 'ADD_TO_CART', payload })
}

export const removeOne = id => dispatch => {
  dispatch({ type: 'REMOVE_ONE', payload: id })
}

export const removeMany = id => dispatch => {
  dispatch({ type: 'REMOVE_MANY', payload: id })
}

export const chooseShippingOption = option => dispatch => {
  dispatch({ type: 'CHOOSE_SHIPPING_OPTION', payload: option })
}

export const updateQuantity = product => dispatch => {
  dispatch({
    type: 'UPDATE_QUANTITY',
    payload: product
  })
}

export const updateTotalQuantity = () => dispatch => {
  dispatch({
    type: 'UPDATE_TOTAL_QUANTITY'
  })
}
