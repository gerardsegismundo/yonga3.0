import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import LoginForm from '../components/LoginForm'

import { useSelector } from 'react-redux'
import { activateAccount } from '../utils/helpers'

const Login = ({ history }) => {
  const { activation_token } = useParams()

  const isAuthenticated = useSelector(({ user }) => user.isAuthenticated)

  useEffect(() => {
    if (activation_token) activateAccount(activation_token)
  }, [activation_token])

  useEffect(() => {
    if (isAuthenticated) history.push('/account/dashboard')
  }, [history, isAuthenticated])

  return (
    <div className='login'>
      <h2 className='login-heading'>log in</h2>

      <LoginForm />

      <div className='container'>
        <p className='register-msg'>If you have not created an account yet, please register here.</p>
        <Link to='/account/register' className='register-btn btn'>
          Create an account
        </Link>

        <p className='social-login-msg'>Or log In using</p>
        <div className='social-login-icons'>
          <button>
            <i className='fa fa-facebook' />
          </button>
          <button>
            <i className='fa fa-instagram' />
          </button>
          <button>
            <i className='fa fa-twitter' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
