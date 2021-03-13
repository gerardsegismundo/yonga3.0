import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Route, Switch } from 'react-router-dom'

import { of, fromEvent, animationFrameScheduler } from 'rxjs'
import { distinctUntilChanged, filter, map, pairwise, switchMap, throttleTime } from 'rxjs/operators'
import { useObservable } from 'rxjs-hooks'

import { Home, Login, Register, Category, Cart, Checkout, About, Contact, Terms } from './pages'
import { ForgotPassword, ResetPassword, Dashboard, NotFound, OrderReceived, Product } from './pages'

import Layout from './layouts/Layout'

import useResponsiveVH from './utils/hooks/useResponsiveVH'
import { progress } from './utils/helpers'
import { landingAnimation } from './utils/animations'

import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser, getProducts } from './redux/actions'

const routes = [
  { path: '/', component: Home },
  { path: '/account/register', component: Register },
  { path: '/account/login/:activation_token?', component: Login },
  { path: '/account/forgotpassword', component: ForgotPassword },
  { path: '/account/resetpassword/:reset_token?', component: ResetPassword },
  { path: '/cart', component: Cart },
  { path: '/about', component: About },
  { path: '/contact', component: Contact },
  { path: '/terms', component: Terms },
  { path: '/checkout', component: Checkout },
  { path: '/order-received', component: OrderReceived },
  { path: '/product-category/:category', component: Category },
  { path: '/product/:product_name', component: Product },
  { path: '/account/dashboard', component: Dashboard, exact: false },
  { path: null, component: NotFound, exact: false }
]

const tl = gsap.timeline()

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user)
  const navMenuIsOpen = useSelector(({ ui }) => ui.navMenuIsOpen)

  const watchScroll = () =>
    of(typeof window === 'undefined').pipe(
      filter(bool => !bool),
      switchMap(() => fromEvent(window, 'scroll', { passive: true })),
      throttleTime(0, animationFrameScheduler),
      map(() => window.pageYOffset),
      pairwise(),
      map(([previous, current]) => (current < previous ? 'Up' : 'Down')),
      distinctUntilChanged()
    )

  const scrollDirection = useObservable(watchScroll, 'Up')

  const fetchProductsRef = useRef(() => dispatch(getProducts()))

  const getCurrentUserRef = useRef(() => {
    progress(() => dispatch(getCurrentUser(localStorage.access_token)))
  })

  useEffect(() => {
    fetchProductsRef.current()

    gsap.to('body', { css: { visibility: 'visible' } })

    landingAnimation()
  }, [])

  useEffect(() => {
    if (localStorage.access_token && user.isAuthenticated) {
      getCurrentUserRef.current()
    }
  }, [user.isAuthenticated])

  useResponsiveVH()

  useEffect(() => {
    if (!navMenuIsOpen) {
      const params = scrollDirection === 'Up' ? [1, 0.3, 0] : [0, 0.3, -50]

      const animateHeader = ([autoAlpha, duration, y]) => {
        tl.to('.main-header', { autoAlpha, duration, y })
      }

      animateHeader(params)
    }
  }, [navMenuIsOpen, scrollDirection])

  return (
    <Layout>
      <Switch>
        {routes.map(({ path, component, exact = true }) => (
          <Route exact={exact} path={path} component={component} key={path} />
        ))}
      </Switch>
    </Layout>
  )
}

export default App
