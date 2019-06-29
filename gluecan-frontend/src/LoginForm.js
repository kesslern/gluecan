import React, { useCallback, useState } from 'react'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

export default function LoginForm({ onSubmit, failure }) {

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
