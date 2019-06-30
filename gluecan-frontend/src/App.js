import React from 'react'
import './App.css'
import CssBaseline from '@material-ui/core/CssBaseline'
import LoginForm from './LoginForm'
import Pastes from './Pastes'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import { createMuiTheme } from '@material-ui/core/styles'
import { Route, Redirect, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import history from './state/history'
import { ConnectedRouter } from 'connected-react-router'
import { makeStyles } from '@material-ui/styles'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const useStyles = makeStyles(theme => ({
  contentBox: {
    '&> *': {
      position: 'absolute',
      width: '100%',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    spacing: 'spaceBetween',
    minHeight: '100vh',
    width: '100%',
  },
}))

function App() {
  const classes = useStyles()
  const location = useSelector(state => state.router.location)
  const authenticated = useSelector(state => state.auth.authenticated)

  return (
    <ThemeProvider theme={createMuiTheme()}>
      <CssBaseline />
      <ConnectedRouter history={history}>
        {!authenticated && <Redirect to="/login" />}
        <TransitionGroup className={classes.contentBox}>
          <CSSTransition key={location.key} classNames="fade" timeout={1000}>
            <div className={classes.content}>
              <Switch location={location}>
                <Route exact path="/pastes/:id" component={Pastes} />
                <Route exact path="/pastes" component={Pastes} />
                <Route exact path="/login" component={LoginForm} />
              </Switch>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </ConnectedRouter>
    </ThemeProvider>
  )
}

export default App
