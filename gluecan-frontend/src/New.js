import React, { useCallback, useState } from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { useDispatch } from 'react-redux'
import { submitPaste } from './state/slices/pastes'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  textarea: {
    resize: 'none',
    width: '100%',
    flexGrow: 1,
  },
  buttonContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}))

function New() {
  const [text, updateText] = useState('')
  const dispatch = useDispatch()
  const classes = useStyles()

  const handleSubmit = useCallback(
    e => {
      e.preventDefault()
      dispatch(submitPaste(text))
    },
    [dispatch, text]
  )

  const handleChange = useCallback(
    e => {
      updateText(e.currentTarget.value)
    },
    [updateText]
  )

  return (
    <form className={classes.container} onSubmit={handleSubmit}>
      <Paper
        component="textarea"
        className={classes.textarea}
        value={text}
        onChange={handleChange}
        placeholder="Your text here..."
      ></Paper>
      <div className={classes.buttonContainer}>
        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>
      </div>
    </form>
  )
}

export default New
