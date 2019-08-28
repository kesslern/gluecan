import { hot } from 'react-hot-loader/root'
import React, { useEffect } from 'react'
import './App.css'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Redirect } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import Navbar from './common/Navbar'
import { useAuthentication, login } from './state/slices/auth'
import { useDispatch, useSelector } from 'react-redux'
import Routes, { isValidRoute } from './routes/Routes'

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

  useEffect(() => {
    dispatch(login())
  }, [dispatch])

  return (
    <div className={classes.appRoot}>
      <CssBaseline />
      <Navbar />
      <section className={classes.contentBox}>
        {authenticated !== null && <Routes />}
        {authenticated === false && <Redirect to="/login" />}
        {authenticated === true && !isValidRoute(pathname) && (
          <Redirect to="/pastes" />
        )}
      </section>
    </div>
  )
}

export default hot(App)
