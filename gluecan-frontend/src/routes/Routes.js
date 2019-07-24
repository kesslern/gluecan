import React from 'react'
import { Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { useAuthentication } from '../state/slices/auth'

import LoginForm from './login/LoginForm'
import New from './new/New'
import Pastes from './pastes/Pastes'

const validRoutes = [/^\/login$/, /^\/pastes(\/\d+)?$/, /^\/new$/]
const isValidRoute = pathname =>
  Boolean(validRoutes.find(it => pathname.match(it)))

function Routes() {
  const authenticated = useAuthentication()
  const routes = [{ key: 'login', path: '/login', Component: LoginForm }]

  if (authenticated) {
    routes.push({ path: '/pastes/:id?', Component: Pastes })
    routes.push({ path: '/new', Component: New })
  }

  return (
    <>
      {routes.map(({ path, Component }) => (
        <Route key={path} path={path}>
          {({ match }) => (
            <CSSTransition
              in={match != null}
              timeout={250}
              classNames="fade"
              unmountOnExit
            >
              <div>
                <Component match={match} />
              </div>
            </CSSTransition>
          )}
        </Route>
      ))}
    </>
  )
}

export { isValidRoute }
export default Routes
