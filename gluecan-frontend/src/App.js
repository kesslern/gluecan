import React, { useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import './App.css'
import LoginForm from './LoginForm'
import Pastes from './Pastes'
import PastesLoader from './PastesLoader'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import { createMuiTheme } from '@material-ui/core/styles'

function App() {
  const [pastes, setPastes] = useState(null)
  const [password, setPassword] = useState(null)
  const [loginSuccess, setLoginSuccess] = useState('')

  return (
    <ThemeProvider theme={createMuiTheme()}>
    <div className="App">
      <CssBaseline />
      {!loginSuccess &&
        <LoginForm onSubmit={setPassword} failure={loginSuccess === false} />}
      {!pastes && password &&
        <PastesLoader
          setPastes={setPastes}
          password={password}
          setResult={setLoginSuccess}
        />}
      <Pastes pastes={pastes} />
    </div>
    </ThemeProvider>
  );
}

export default App;
