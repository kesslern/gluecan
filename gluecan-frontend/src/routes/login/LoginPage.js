import React from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import LoginForm from './LoginForm'

export default function LoginPage() {
  const authenticated = useSelector(state => state.auth.authenticated)

  if (authenticated) {
    return <Redirect to="/pastes" />
  } else {
    return <LoginForm />
  }
}
