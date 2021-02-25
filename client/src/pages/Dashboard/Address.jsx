import React, { useState } from 'react'
import BillingDetailsInputGroup from '../../components/BillingDetailsInputGroup'

import { updateUser } from '../../redux/actions'

import { useDispatch } from 'react-redux'
import { progress } from '../../utils/helpers'

const Address = () => {
  const dispatch = useDispatch()

  const [form, setForm] = useState({
    name: '',
    companyName: '',
    country: '',
    houseNumAndStrtName: '',
    apartment: '',
    town: '',
    postcode: '',
    phone: '',
    email: ''
  })

  // eslint-disable-next-line
  const [error, setError] = useState({
    name: '',
    companyName: '',
    country: '',
    houseNumAndStrtName: '',
    apartment: '',
    town: '',
    postcode: '',
    phone: '',
    email: ''
  })

  const handleOnChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleOnSubmit = e => {
    e.preventDefault()

    progress(() => {
      dispatch(updateUser(form))
    })
  }

  return (
    <form className='address' onSubmit={handleOnSubmit}>
      <BillingDetailsInputGroup
        form={form}
        error={error}
        setForm={setForm}
        setError={setError}
        handleOnChange={handleOnChange}
      />

      <button className='save-btn dark-btn' type='submit'>
        Update address
      </button>
    </form>
  )
}

export default Address
