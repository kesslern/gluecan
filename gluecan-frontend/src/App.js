import { hot } from 'react-hot-loader/root'
import React, { useEffect } from 'react'
import './App.css'
import CssBaseline from '@material-ui/core/CssBaseline'
import { makeStyles } from '@material-ui/styles'
import Navbar from './common/Navbar'
import { login } from './state/slices/auth'
import { useDispatch } from 'react-redux'
import Router from './routes/Router'

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
  const classes = useStyles()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(login())
  }, [dispatch])

  return (
    <div className={classes.appRoot}>
      <CssBaseline />
      <Navbar />
      <section className={classes.contentBox}>
        <Router />
      </section>
    </div>
  )
}

export default hot(App)
