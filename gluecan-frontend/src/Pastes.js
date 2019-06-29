import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import EyeIcon from '@material-ui/icons/RemoveRedEye'
import makeStyles from '@material-ui/styles/makeStyles'
import { useSelector, useDispatch } from 'react-redux'
import { deletePaste } from './state/slices/pastes'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}))

export default function Pastes({ onDelete }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const pastes = useSelector(state => state.pastes)

  const handleDelete = id => () => {
    dispatch(deletePaste(id))
  }

  return pastes ? (
    <List className={classes.root}>
      {pastes.map(paste => (
        <ListItem key={paste.id}>
          <ListItemText primary={`ID: ${paste.id} Views: ${paste.views}`} />
          <ListItemSecondaryAction>
            <IconButton
              component="a"
              edge="end"
              aria-label="View"
              target="_blank"
              href={`/view/${paste.id}`}
            >
              <EyeIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="Delete"
              onClick={handleDelete(paste.id)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  ) : null
}
