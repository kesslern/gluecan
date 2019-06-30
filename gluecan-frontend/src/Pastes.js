import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import BackIcon from '@material-ui/icons/ArrowBack'
import DeleteIcon from '@material-ui/icons/Delete'
import EyeIcon from '@material-ui/icons/RemoveRedEye'
import makeStyles from '@material-ui/styles/makeStyles'
import { useSelector, useDispatch } from 'react-redux'
import { deletePaste } from './state/slices/pastes'
import { push, goBack } from 'connected-react-router'
import { useCallback } from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: ({ routeId }) => (routeId ? 0 : theme.spacing(10)),
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  iframe: {
    width: '100%',
    flexGrow: 1,
  },
}))

export default function Pastes({ match }) {
  const routeId = parseInt(match.params.id) || null
  const classes = useStyles({ routeId })
  const dispatch = useDispatch()
  const pastes = useSelector(state => state.pastes)

  const handleDelete = id => () => {
    dispatch(deletePaste(id))
  }

  const handleView = id => () => {
    dispatch(push(`/pastes/${id}`))
  }

  const back = useCallback(() => {
    dispatch(goBack())
  }, [dispatch])

  function loaded() {
    console.log('loaded')
  }

  return pastes ? (
    <React.Fragment>
      <List className={classes.root}>
        {pastes.map(
          paste =>
            (!routeId || routeId === paste.id) && (
              <ListItem key={paste.id}>
                <ListItemText
                  primary={`ID: ${paste.id} Views: ${paste.views}`}
                />
                <ListItemSecondaryAction>
                  {routeId ? (
                    <IconButton edge="end" aria-label="View" onClick={back}>
                      <BackIcon />
                    </IconButton>
                  ) : null}
                  {!routeId && (
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
      {routeId && (
        <iframe
          className={classes.iframe}
          title="Content"
          src={`/view/${routeId}`}
          onLoad={loaded}
        />
      )}
    </React.Fragment>
  ) : null
}
