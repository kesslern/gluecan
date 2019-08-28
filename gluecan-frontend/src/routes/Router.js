import React from 'react'
import { Redirect } from 'react-router-dom'
import { useAuthentication } from '../state/slices/auth'
import Routes, { isValidRoute } from './Routes'
import { useSelector } from 'react-redux'

function Router() {
  const authenticated = useAuthentication()
  const { pathname } = useSelector(state => state.router.location)

  return (
    <>
      {authenticated !== null && <Routes />}
      {authenticated === false && <Redirect to="/login" />}
      {authenticated === true && !isValidRoute(pathname) && (
        <Redirect to="/pastes" />
      )}
    </>
  )
}

export default Router
