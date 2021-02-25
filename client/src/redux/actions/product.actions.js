import axios from 'axios'
import authAxios from '../../utils/helpers/authAxios'

const Products = (() => {
  let productsCache = null

  const getProductsCache = async dispatch => {
    if (!productsCache) {
      const { data } = await axios.get('/product')

      productsCache = data.products

      dispatch({
        type: 'GET_PRODUCTS',
        payload: productsCache
      })
    }

    return productsCache
  }

  const getProducts = () => async dispatch => {
    const products = productsCache || (await getProductsCache(dispatch))

    return products
  }

  const filterProducts = () => async dispatch => {
    const products = productsCache || (await getProductsCache(dispatch))

    const filter = category => {
      return products.filter(p => p.category.includes(category))
    }

    const filteredProducts = {
      children: filter('children'),
      home: filter('home'),
      outdoor: filter('outdoor')
    }

    dispatch({
      type: 'FILTER_PRODUCTS',
      payload: filteredProducts
    })
  }

  const findProduct = productName => async dispatch => {
    const products = productsCache || (await getProductsCache(dispatch))

    const product = products.filter(p => p.name === productName)[0]

    dispatch({
      type: 'FIND_PRODUCT',
      payload: product
    })
  }

  return {
    getProducts,
    filterProducts,
    findProduct
  }
})()

const getProduct = name => async dispatch => {
  try {
    const { data } = await authAxios.get(`/product/${name}`)

    dispatch({ type: 'GET_PRODUCT', payload: data })
  } catch (error) {
    console.log(error)
  }
}

const rateProduct = (productId, rating) => async dispatch => {
  try {
    const { data } = await authAxios.post('/product/rating', {
      productId,
      rating: parseInt(rating)
    })

    const { ratings, totalRating } = data

    dispatch({
      type: 'RATE_PRODUCT',
      payload: { productId, ratings, totalRating }
    })

    return totalRating
  } catch (error) {
    console.log(error)
  }
}

const addComment = (productId, comment) => async dispatch => {
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

const updateComment = (productId, commentId, comment) => async dispatch => {
  try {
    const api = `/product/${productId}/comment/${commentId}`

    const { data } = await authAxios.patch(api, {
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

const deleteComment = (productId, commentId) => async dispatch => {
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

export const { getProducts, filterProducts, findProduct } = Products
export { getProduct, rateProduct, addComment, updateComment, deleteComment }
