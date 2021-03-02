import React from 'react'
import { Link } from 'react-router-dom'

const AccountDetails = ({ accessType }) => {
  return (
    <div className='account-details'>
      <h2>Account</h2>
      <p className='note'>Edit your account details</p>

      {accessType === 'local' && (
        <Link to='/account/resetpassword' className='btn dark-btn'>
          Reset password
        </Link>
      )}
    </div>
  )
}

export default AccountDetails
