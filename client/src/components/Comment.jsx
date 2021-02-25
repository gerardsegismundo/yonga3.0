import React, { useState, useEffect } from 'react'
import formatDate from '../utils/helpers/formatDate'
import { CustomTextArea } from './custom'

import { progress } from '../utils/helpers/'

import { useDispatch, useSelector } from 'react-redux'
import { updateComment, openConfirmModal } from '../redux/actions'

const Comment = ({ createdAt, comment, user, _id, productId }) => {
  const dispatch = useDispatch()

  const [isEditing, setIsEditing] = useState(false)
  const [commentHandler, setCommentHandler] = useState('')

  const currentUser = useSelector(({ user }) => user)

  useEffect(() => {
    setCommentHandler(comment)
  }, [comment])

  const handleDelete = e => {
    dispatch(openConfirmModal(_id, productId))
  }

  const date = formatDate(createdAt)

  const handleEdit = () => setIsEditing(!isEditing)

  const handleOnChange = e => setCommentHandler(e.target.value)

  const handleUpdate = () => {
    progress(() => dispatch(updateComment(productId, _id, commentHandler)))

    setIsEditing(false)
  }

  return (
    <div className='comment'>
      <img className='avatar' src={user.avatar && user.avatar.url} alt='avatar' />
      <h4 className='label'>
        <span>{user && user.name} &nbsp;&nbsp;|</span>
        &nbsp;&nbsp;
        <wbr />
        <span>{date}</span>
      </h4>
      <div className='container'>
        {!isEditing ? (
          <>
            <p className='msg'>{comment}</p>
            {currentUser.isAuthenticated && currentUser.data._id === user._id && (
              <>
                <button onClick={handleEdit}>edit</button>
                <button onClick={handleDelete}>delete</button>
              </>
            )}
          </>
        ) : (
          <>
            <CustomTextArea value={commentHandler} onChange={handleOnChange} />
            <button onClick={handleUpdate}>update</button>
            <button onClick={handleEdit}>cancel</button>
          </>
        )}
      </div>
    </div>
  )
}

export default Comment
