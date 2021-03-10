import axios from 'axios'
import authAxios from '../../utils/helpers/authAxios'

export const getProducts = () => async dispatch => {
  const { data } = await axios.get('/product')

  const { products } = data

  const filter = category => products.filter(p => p.category.includes(category))

  const filteredProducts = {
    children: filter('children'),
    home: filter('home'),
    outdoor: filter('outdoor')
  }

  dispatch({
    type: 'GET_PRODUCTS',
    payload: { products, filteredProducts }
  })

  return products
}

export const getProduct = name => async dispatch => {
  try {
    const { data } = await authAxios.get(`/product/${name}`)

    dispatch({ type: 'GET_PRODUCT', payload: data })
  } catch (error) {
    console.log(error)
  }
}

export const rateProduct = (productId, rating) => async dispatch => {
  try {
    const { data } = await authAxios.post('/product/rating', {
      productId,
      rating: parseInt(rating)
    })

    const { numberOfRatings, ratings, totalRating } = data

    dispatch({
      type: 'RATE_PRODUCT',
      payload: { productId, ratings, totalRating }
    })

    return { numberOfRatings, totalRating }
  } catch (error) {
    console.log(error)
  }
}

export const addComment = (productId, comment) => async dispatch => {
  try {
    const { data } = await authAxios.post(`/product/${productId}/comment`, {
      comment
    })

    dispatch({
      type: 'ADD_COMMENT',
      payload: data.newComment
    })
  } catch (error) {
    console.log(error.response.data)
    if (error.response.data.message) {
      return error.response.data.message
    }
  }
}

export const updateComment = (productId, commentId, comment) => async dispatch => {
  try {
    const { data } = await authAxios.patch(`/product/${productId}/comment/${commentId}`, {
      comment
    })

    dispatch({
      type: 'UPDATE_COMMENT',
      payload: data
    })
  } catch (error) {
    console.log('ERROR', error.response)
  }
}

export const deleteComment = (productId, commentId) => async dispatch => {
  try {
    const { data } = await authAxios.delete(`/product/${productId}/comment/${commentId}`)

    dispatch({
      type: 'DELETE_COMMENT',
      payload: data
    })
  } catch (error) {
    console.log(error.response)
  }
}
