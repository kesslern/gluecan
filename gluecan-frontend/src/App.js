import React, { useCallback, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import './App.css'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography';

function App() {
  const [pastes, setPastes] = useState(null)
  const [password, setPassword] = useState('')

  const formSubmit = useCallback((event) => {
    event.preventDefault()
    console.log("Submit " + password)
  }, [password])

  const updatePassword = useCallback(event => {
    setPassword(event.target.value)
  }, [setPassword])

  return (
    <div className="App">
      <CssBaseline/>
      <Typography variant="h5" color="textSecondary">GlueCan Administration</Typography>
      <Paper component={"form"} onSubmit={formSubmit}>
        <TextField
          id="password"
          label="Password"
          margin="normal"
          variant="outlined"
          type="password"
          value={password}
          onChange={updatePassword}
        />
        <Button variant="contained" color="primary">Go</Button>
      </Paper>
      {pastes ? pastes.map(paste =>
        <div key={paste.id}>
          <div>{paste.id}</div>
          <div>{paste.text}</div>
        </div>
      ) : <PasteLoader setPastes={setPastes}/> }
    </div>
  );
}

function PasteLoader({ setPastes }) {

  useEffect(() => {
    fetch('/api/pastes', { headers: { 'X-Auth': 'change_me' } })
      .then(it => it.json())
      .then(it => {
        console.log(it)
        setPastes(it)
      })
      .catch(() => console.log("error"))
    })

  return null
}

export default App;
