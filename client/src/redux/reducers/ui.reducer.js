const initialState = {
  navMenuIsOpen: false,
  cartMenuIsOpen: false,
  darkOverlayIsOpen: true,
  uploadModal: {
    isOpen: false,
    file: null,
    deleteId: ''
  },
  confirmModal: {
    productId: '',
    commentId: '',
    isOpen: false
  }
}

const uiReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'TOGGLE_NAV_MENU':
      return {
        ...state,
        navMenuIsOpen: !state.navMenuIsOpen
      }

    case 'TOGGLE_CART_MENU':
      return {
        ...state,
        cartMenuIsOpen: !state.cartMenuIsOpen
      }

    case 'OPEN_UPLOAD_MODAL':
      return {
        ...state,
        uploadModal: {
          isOpen: true,
          file: payload.file,
          deleteId: payload.deleteId
        }
      }

    case 'CLOSE_UPLOAD_MODAL':
      return {
        ...state,
        uploadModal: {
          isOpen: false,
          file: null
        }
      }

    case 'OPEN_CONFIRM_MODAL':
      const { productId, commentId } = payload

      return {
        ...state,
        confirmModal: {
          productId,
          commentId,
          isOpen: true
        }
      }

    case 'CLOSE_CONFIRM_MODAL':
      return {
        ...state,
        confirmModal: {
          isOpen: false
        }
      }

    case 'TOGGLE_DARK_OVERLAY':
      return {
        ...state,
        darkOverlayIsOpen: !state.darkOverlayIsOpen
      }

    default:
      return state
  }
}

export default uiReducer
