import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import LoginForm from './LoginForm'
import Pastes from './Pastes'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import { createMuiTheme } from '@material-ui/core/styles'
import { Route, Redirect } from 'react-router-dom'
import store from './state/store'
import { Provider } from 'react-redux'
import history from './state/history'
import { ConnectedRouter } from 'connected-react-router'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
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

  return (
    <ThemeProvider theme={createMuiTheme()}>
      <Provider store={store}>
        <CssBaseline />
        <div className={classes.root}>
          <ConnectedRouter history={history}>
            <Route path="/pastes/:id" component={Pastes} />
            <Route exact path="/pastes" component={Pastes} />
            <Route path="/login" component={LoginForm} />
            <Redirect to="/login" />
          </ConnectedRouter>
        </div>
      </Provider>
    </ThemeProvider>
  )
}

export default App
