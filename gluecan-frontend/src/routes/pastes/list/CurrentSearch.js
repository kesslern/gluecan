import React, { useCallback } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import makeStyles from '@material-ui/styles/makeStyles'
import { useDispatch, useSelector } from 'react-redux'
import { clearSearch } from '../../../state/slices/search'

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(-1, 1, 0),
    padding: theme.spacing(1, 0, 1, 2),
    display: 'flex',
    alignItems: 'center',
    '*&>:last-child': {
      marginLeft: 'auto',
    },
  },
}))

function CurrentSearch() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const search = useSelector(state => state.search)

  const handleSearchClear = useCallback(() => {
    dispatch(clearSearch())
  }, [dispatch])

  const results = search.ids && search.ids.length
  const word = results === 1 ? 'paste' : 'pastes'

  return search.query ? (
    <Paper className={classes.root}>
      <Typography>
        {results} {word} matching "{search.query}"{' '}
      </Typography>
      <IconButton onClick={handleSearchClear}>
        <CloseIcon />
      </IconButton>
    </Paper>
  ) : null
}

export default CurrentSearch
