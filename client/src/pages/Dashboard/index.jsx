import React from 'react'

import { Switch, Route, useRouteMatch, NavLink, Redirect } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../redux/actions'

import { progress } from '../../utils/helpers'
import Address from './Address'
import AccountDetails from './AccountDetails'
import Avatar from '../../components/Avatar'

const Dashboard = () => {
  const { path, url } = useRouteMatch()

  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user)

  const { isAuthenticated } = user

  const routes = [
    { name: 'dashboard', path: '' },
    { name: 'orders', path: '/orders' },
    { name: 'address / billing details', path: '/address' },
    { name: 'account details', path: '/account-details' }
  ]

  const handleLogout = () => {
    progress(() => dispatch(logout()))
  }

  return isAuthenticated && user.data ? (
    <div className='dashboard'>
      <nav>
        {user.data.avatar && <Avatar />}

        <ul>
          {routes.map(({ name, path }) => (
            <li key={url + name}>
              <NavLink exact to={url + path}>
                {name}
              </NavLink>
            </li>
          ))}
          <li>
            <button className='logout-btn' onClick={handleLogout}>
              logout
            </button>
          </li>
        </ul>
      </nav>
      <section className='content'>
        <Switch>
          <Route exact path={path}>
            Hello {`${user.data.name}`}
          </Route>

          <Route exact path={`${path}/orders`}>
            <h3>My Orders</h3>
            <p>Your recent orders are displayed in the table below.</p>
          </Route>

          <Route exact path={`${path}/address`}>
            <Address />
          </Route>
          <Route exact path={`${path}/account-details`}>
            <AccountDetails />
          </Route>
        </Switch>
      </section>
    </div>
  ) : (
    <Redirect to='/account/login' />
  )
}

export default Dashboard
