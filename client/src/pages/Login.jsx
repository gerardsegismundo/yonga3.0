import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { GoogleLogin } from 'react-google-login'
import axios from 'axios'

import LoginForm from '../components/LoginForm'
import { useSelector } from 'react-redux'
import { activateAccount } from '../utils/helpers'

const Login = ({ history }) => {
  const { activation_token } = useParams()
  const isAuthenticated = useSelector(({ user }) => user.isAuthenticated)

  const handleOnFailure = response => {
    console.log(response)
  }

  const responseGoogle = async ({ tokenId }) => {
    try {
      const { data } = await axios.post('/auth/google_login', { tokenId })
      console.log(data)
      // setUser({...user, error:'', success: res.data.msg})
      // localStorage.setItem('firstLogin', true)

      // dispatch(dispatchLogin())
      history.push('/')
    } catch (err) {
      err.response.data.msg && console.log(err.response.data.msg)
      // setUser({...user, err: err.response.data.msg, success: ''})
    }
  }

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
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            // clientId='65854250445-4n1vi51lvuk3kkgg1mk1ptjqqv0hj1tv.apps.googleusercontent.com'
            render={renderProps => (
              <button onClick={renderProps.onClick}>
                <i className='fa fa-google' />
              </button>
            )}
            onSuccess={responseGoogle}
            onFailure={handleOnFailure}
            cookiePolicy={'single_host_origin'}
          />
          <button>
            <i className='fa fa-twitter' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
