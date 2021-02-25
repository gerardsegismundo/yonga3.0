import React, { useEffect } from 'react'
import { gsap } from 'gsap'
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg'
import { useDispatch, useSelector } from 'react-redux'

import { deleteComment, closeConfirmModal } from '../redux/actions'
import { progress } from '../utils/helpers'

const ConfirmModal = () => {
  const dispatch = useDispatch()
  const { confirmModal } = useSelector(({ ui }) => ui)

  const { isOpen, productId, commentId } = confirmModal

  const handleOnClose = () => {
    gsap.to('.confirm-modal', {
      autoAlpha: 0,
      y: -80,
      duration: 0.2,
      ease: 'power4.out',
      onComplete: () => dispatch(closeConfirmModal())
    })
  }

  const handleOnDelete = () => {
    progress(() => {
      dispatch(deleteComment(productId, commentId))
    })
    dispatch(closeConfirmModal())
  }

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        '.confirm-modal',
        { y: -80 },
        {
          autoAlpha: 1,
          y: -30
        }
      )
    }
  }, [isOpen])

  return isOpen ? (
    <div className='confirm-wrapper'>
      <div className='confirm-modal'>
        <CloseIcon onClick={handleOnClose} />
        <p>Are you sure you want to delete your comment?</p>

        <div className='button-group'>
          <button className='dark-btn' onClick={handleOnDelete}>
            Ok
          </button>
          <button onClick={handleOnClose}>Cancel</button>
        </div>
      </div>
    </div>
  ) : null
}

export default ConfirmModal
