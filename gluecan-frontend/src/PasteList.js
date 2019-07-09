import React, { useCallback } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import makeStyles from '@material-ui/styles/makeStyles'
import { deletePaste } from './state/slices/pastes'
import { useDispatch, useSelector } from 'react-redux'
import { push, goBack } from 'connected-react-router'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import BackIcon from '@material-ui/icons/ArrowBack'
import EyeIcon from '@material-ui/icons/RemoveRedEye'
import DeleteIcon from '@material-ui/icons/Delete'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(10),
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function PasteList({ selected }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const pastes = useSelector(state => state.pastes)

  const handleDelete = useCallback(
    id => () => {
      dispatch(deletePaste(id))
    },
    [dispatch]
  )

  const handleView = useCallback(
    id => () => {
      dispatch(push(`/pastes/${id}`))
    },
    [dispatch]
  )

  const back = useCallback(() => {
    dispatch(goBack())
  }, [dispatch])

  return (
    <List className={classes.root}>
      {pastes.map(
        paste =>
          (!selected || selected === paste.id) && (
            <ListItem key={paste.id}>
              <ListItemText
                primary={`Paste #${paste.id}`}
                secondary={
                  paste.views === 1 ? (
                    <>
                      {paste.language && paste.language + ', '}
                      {paste.views} view
                    </>
                  ) : (
                    <>
                      {paste.language && paste.language + ', '}
                      {paste.views} views
                    </>
                  )
                }
              />
              <ListItemSecondaryAction>
                {selected ? (
                  <IconButton edge="end" aria-label="View" onClick={back}>
                    <BackIcon />
                  </IconButton>
                ) : null}
                {!selected && (
                  <IconButton
                    edge="end"
                    aria-label="View"
                    onClick={handleView(paste.id)}
                  >
                    <EyeIcon />
                  </IconButton>
                )}
                <IconButton
                  edge="end"
                  aria-label="Delete"
                  onClick={handleDelete(paste.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          )
      )}
    </List>
  )
}

PasteList.propTypes = {
  selected: PropTypes.number,
}
