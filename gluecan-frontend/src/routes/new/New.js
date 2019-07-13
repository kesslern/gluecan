import React, { useCallback, useState } from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Dropdown from './Dropdown'
import { useDispatch } from 'react-redux'
import { submitPaste } from '../../state/slices/pastes'
import { Typography } from '@material-ui/core'

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
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  button: {
    marginLeft: 'auto',
    marginTop: theme.spacing(2),
  },
}))

function New() {
  const [text, updateText] = useState('')
  const [language, setLanguage] = useState(null)
  const dispatch = useDispatch()
  const classes = useStyles()

  function handleSubmit(e) {
    e.preventDefault()
    dispatch(submitPaste({ text, language }))
  }

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
      <section className={classes.header}>
        <Typography variant="h5">Add a new paste</Typography>
        <Dropdown onSelect={setLanguage} />
      </section>
      <textarea
        className={classes.textarea}
        onChange={handleChange}
        placeholder="Your text here..."
      />
      <Button
        className={classes.button}
        color="primary"
        variant="contained"
        type="submit"
      >
        Submit
      </Button>
    </Paper>
  )
}

export default New
