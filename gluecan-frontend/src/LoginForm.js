import React, { useCallback, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { login, preLogin } from './state/slices/auth'
import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import { Redirect } from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2, 3, 0),
    height: theme.spacing(15),
    display: 'flex',
    '& button': {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
      height: theme.spacing(7),
    },
  },
  heading: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(1),
  },
}))

export default function LoginForm() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const { failure, authenticated } = useSelector(state => state.auth)
  const [password, setPassword] = useState('')

  const updatePassword = useCallback(
    event => {
      setPassword(event.target.value)
    },
    [setPassword]
  )

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      dispatch(login(password))
    },
    [dispatch, password]
  )

  useEffect(() => {
    dispatch(preLogin())
  }, [dispatch])

  if (authenticated === true) {
    return <Redirect to="/pastes" />
  }

  if (authenticated === false)
    return (
      <React.Fragment>
        <Typography
          variant="h5"
          color="textSecondary"
          className={classes.heading}
        >
          GlueCan Administration
        </Typography>
        <Paper
          component="form"
          className={classes.root}
          onSubmit={handleSubmit}
        >
          <TextField
            id="password"
            label="Password"
            margin="normal"
            variant="outlined"
            type="password"
            value={password}
            onChange={updatePassword}
            error={failure}
            helperText={failure && 'Login Failed'}
          />
          <Button variant="contained" color="primary" type="submit">
            Go
          </Button>
        </Paper>
      </React.Fragment>
    )

  return null
}
