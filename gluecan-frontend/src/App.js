import React from 'react'
import './App.css'
import CssBaseline from '@material-ui/core/CssBaseline'
import LoginForm from './LoginForm'
import Pastes from './Pastes'
import { Route, Redirect, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import history from './state/history'
import { ConnectedRouter } from 'connected-react-router'
import { makeStyles } from '@material-ui/styles'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'

const useStyles = makeStyles(theme => ({
  contentBox: {
    flexGrow: 1,
    '&> *': {
      position: 'absolute',
      width: '100%',
      top: theme.spacing(8),
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  appRoot: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
}))

function App() {
  const classes = useStyles()
  const location = useSelector(state => state.router.location)

  return (
    <div className={classes.appRoot}>
      <CssBaseline />
      <ConnectedRouter history={history}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">GlueCan</Typography>
          </Toolbar>
        </AppBar>
        <TransitionGroup className={classes.contentBox}>
          <CSSTransition key={location.key} classNames="fade" timeout={1000}>
            <div>
              <Switch location={location}>
                <Route path="/pastes/:id" component={Pastes} />
                <Route path="/pastes" component={Pastes} />
                <Route exact path="/login" component={LoginForm} />
                <Redirect to="/pastes" />
              </Switch>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </ConnectedRouter>
    </div>
  )
}

export default App
