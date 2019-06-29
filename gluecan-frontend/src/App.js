import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import './App.css'
import LoginForm from './LoginForm'
import Pastes from './Pastes'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import { createMuiTheme } from '@material-ui/core/styles'
import { Route, Redirect } from 'react-router-dom'
import store from './state/store'
import { Provider } from 'react-redux'
import history from './state/history'
import { ConnectedRouter } from 'connected-react-router'

function App() {
  return (
    <ThemeProvider theme={createMuiTheme()}>
      <Provider store={store}>
        <CssBaseline />
        <div className="App">
          <ConnectedRouter history={history}>
            <Route path="/pastes" component={Pastes} />
            <Route path="/login" component={LoginForm} />
            <Redirect to="/login" />
          </ConnectedRouter>
        </div>
      </Provider>
    </ThemeProvider>
  )
}

export default App
