import React, { useCallback, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import './App.css'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';

function App() {
  const [pastes, setPastes] = useState(null)
  const [password, setPassword] = useState(null)
  const [loginSuccess, setLoginSuccess] = useState('')

  return (
    <div className="App">
      <CssBaseline />
      {!loginSuccess && <LoginForm onSubmit={setPassword} failure={loginSuccess === false} />}
      {pastes ? pastes.map(paste =>
        <div key={paste.id}>
          <div>{paste.id}</div>
          <div>{paste.text}</div>
        </div>
      ) : password && <PasteLoader setPastes={setPastes} password={password} setResult={setLoginSuccess} />}
    </div>
  );
}

function LoginForm({ onSubmit, failure }) {

  const [password, setPassword] = useState('')

  const updatePassword = useCallback(event => {
    setPassword(event.target.value)
  }, [setPassword])

  const handleSubmit = useCallback((event) => {
    event.preventDefault()
    onSubmit(password)
  }, [onSubmit, password])

  return (
    <React.Fragment>
      <Typography variant="h5" color="textSecondary">GlueCan Administration</Typography>
      <Paper component="form" onSubmit={handleSubmit}>
          <TextField
            id="password"
            label="Password"
            margin="normal"
            variant="outlined"
            type="password"
            value={password}
            onChange={updatePassword}
            error={failure}
            helperText={
              failure && "Login Failed"
            }
          />
          <Button variant="contained" color="primary">Go</Button>
      </Paper>
    </React.Fragment>
  )
}

function PasteLoader({ setPastes, password, setResult }) {

  useEffect(() => {
    fetch('/api/pastes', { headers: { 'X-Auth': password } })
      .then(it => it.json())
      .then(it => {
        setResult(true)
        setPastes(it)
      })
      .catch(() => {
        setResult(false)
      })
  })

  return null
}

export default App;
