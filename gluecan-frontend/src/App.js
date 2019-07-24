import React, { useEffect } from 'react'
import './App.css'
import CssBaseline from '@material-ui/core/CssBaseline'
import LoginForm from './routes/login/LoginForm'
import Pastes from './routes/pastes/Pastes'
import { Route, Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import { CSSTransition } from 'react-transition-group'
import New from './routes/new/New'
import Navbar from './common/Navbar'
import { useAuthentication, login } from './state/slices/auth'
import { useDispatch, useSelector } from 'react-redux'

const useStyles = makeStyles(theme => ({
  contentBox: {
    flexGrow: 1,
    '&> *': {
      position: 'absolute',
      width: '100%',
      top: theme.spacing(7),
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  buttonContainer: {
    position: 'relative',
  },
  appRoot: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
}))

function App() {
  const authenticated = useAuthentication()
  const classes = useStyles()
  const dispatch = useDispatch()
  const { pathname } = useSelector(state => state.router.location)

  const routes = [{ key: 'login', path: '/login', Component: LoginForm }]

  useEffect(() => {
    dispatch(login())
  }, [dispatch])

  if (authenticated) {
    routes.push({ path: '/pastes/:id?', Component: Pastes })
    routes.push({ path: '/new', Component: New })
  }

  const routeMatching = Boolean(
    [/^\/login$/, /^\/pastes(\/\d+)?$/, /^\/new$/].find(it =>
      pathname.match(it)
    )
  )

  const routeComponents = routes.map(({ path, Component }) => (
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
  ))

  return (
    <div className={classes.appRoot}>
      <CssBaseline />
      <Navbar />
      <section className={classes.contentBox}>
        {authenticated !== null && (
          <>
            {routeComponents}
            {!routeMatching && <Redirect to="/pastes" />}
          </>
        )}
        {authenticated === false && <Redirect to="/login" />}
      </section>
    </div>
  )
}

export default App
