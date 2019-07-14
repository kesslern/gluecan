import React from 'react'
import './App.css'
import CssBaseline from '@material-ui/core/CssBaseline'
import LoginForm from './routes/login/LoginForm'
import Pastes from './routes/pastes/Pastes'
import { Route, Redirect, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import history from './state/history'
import { ConnectedRouter } from 'connected-react-router'
import { makeStyles } from '@material-ui/styles'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import New from './routes/new/New'
import Navbar from './common/Navbar'

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
  buttonContainer: {
    position: 'relative',
  },
  appRoot: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
}))

function App() {
  const location = useSelector(state => state.router.location)
  const classes = useStyles()

  return (
    <div className={classes.appRoot}>
      <CssBaseline />
      <ConnectedRouter history={history}>
        <Navbar />
        <TransitionGroup className={classes.contentBox}>
          <CSSTransition key={location.key} classNames="fade" timeout={1000}>
            <div>
              <Switch location={location}>
                <Route path="/pastes/:id" component={Pastes} />
                <Route path="/pastes" component={Pastes} />
                <Route path="/new" component={New} />
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
