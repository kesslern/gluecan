import React, { useCallback, useEffect, useState } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Paper from '@material-ui/core/Paper'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import BackIcon from '@material-ui/icons/ArrowBack'
import DeleteIcon from '@material-ui/icons/Delete'
import EyeIcon from '@material-ui/icons/RemoveRedEye'
import makeStyles from '@material-ui/styles/makeStyles'
import { useSelector, useDispatch } from 'react-redux'
import { deletePaste, setPastes } from './state/slices/pastes'
import { push, goBack } from 'connected-react-router'
import { Fade } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: ({ routeId }) =>
      routeId ? theme.spacing(2) : theme.spacing(10),
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  iframe: {
    width: '90%',
    margin: theme.spacing(2, 0),
    flexGrow: 1,
    border: 'none',
  },
}))

export default function Pastes({ match }) {
  const routeId = parseInt(match.params.id) || null
  const classes = useStyles({ routeId })
  const dispatch = useDispatch()
  const pastes = useSelector(state => state.pastes)
  const [iframeLoaded, setIframeLoaded] = useState(false)

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
    setIframeLoaded(true)
  }

  useEffect(() => {
    if (pastes === null) {
      fetch('/api/pastes')
        .then(it => it.json())
        .then(it => {
          dispatch(setPastes(it))
        })
        .catch(e => {
          console.log(e)
          dispatch(push('/login'))
        })
    }
  }, [pastes, dispatch])

  useEffect(() => {
    if (!routeId) {
      setIframeLoaded(false)
    }
  }, [routeId, setIframeLoaded])

  return Array.isArray(pastes) ? (
    <React.Fragment>
      <List className={classes.root}>
        {pastes.length === 0 && (
          <ListItem>
            <ListItemText primary={`There are no pastes.`} />
          </ListItem>
        )}
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
        <Fade in={iframeLoaded}>
          <Paper
            component={'iframe'}
            className={classes.iframe}
            title="Content"
            src={`/view/${routeId}`}
            onLoad={loaded}
          />
        </Fade>
      )}
    </React.Fragment>
  ) : null
}
