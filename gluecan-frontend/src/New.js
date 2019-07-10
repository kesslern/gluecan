import React from 'react'
import makeStyles from '@material-ui/styles/makeStyles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

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
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Paper
        component="textarea"
        className={classes.textarea}
        placeholder="Your text here..."
      ></Paper>
      <div className={classes.buttonContainer}>
        <Button color="primary" variant="contained">
          Submit
        </Button>
      </div>
    </div>
  )
}

export default New
