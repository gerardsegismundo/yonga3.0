import React from 'react'
import Navigation from '../components/Navigation'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className='main-header'>
      <Link to='/' className='brand'>
        Yonga
      </Link>
      <Navigation />
    </header>
  )
}

export default Header
