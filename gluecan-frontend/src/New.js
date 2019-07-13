import React, { useCallback, useState } from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import { useDispatch } from 'react-redux'
import { submitPaste } from './state/slices/pastes'

const useStyles = makeStyles(theme => ({
  container: {
    margin: `${theme.spacing(2)}px auto`,
    width: '90%',
    height: '90%',
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
    <Paper
      component="form"
      className={classes.container}
      value={text}
      onSubmit={handleSubmit}
    >
      <textarea
        className={classes.textarea}
        onChange={handleChange}
        placeholder="Your text here..."
      />
      <div className={classes.buttonContainer}>
        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>
      </div>
    </Paper>
  )
}

export default New
