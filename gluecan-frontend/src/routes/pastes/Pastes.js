import React, { useCallback, useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import PasteList from './PasteList'
import makeStyles from '@material-ui/styles/makeStyles'
import { useSelector, useDispatch } from 'react-redux'
import { setPastes, viewedPaste } from '../../state/slices/pastes'
import { push } from 'connected-react-router'
import { Fade } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  pasteContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    flexGrow: 1,
  },
  iframe: {
    flexGrow: 1,
    border: 'none',
    height: '100%',
  },
}))

export default function Pastes({ match }) {
  const routeId = parseInt(match.params.id) || null
  const classes = useStyles()
  const dispatch = useDispatch()
  const pastes = useSelector(state => state.pastes)
  const authenticated = useSelector(state => state.auth.authenticated)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const handleIframeLoaded = useCallback(
    id => () => {
      dispatch(viewedPaste(id))
      setIframeLoaded(true)
    },
    [setIframeLoaded, dispatch]
  )

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

  return Array.isArray(pastes) && pastes.length > 0 ? (
    <div className={classes.pasteContainer}>
      <PasteList selected={routeId} />
      {routeId && (
        <Fade in={iframeLoaded}>
          <Paper
            component={'iframe'}
            className={classes.iframe}
            title="Content"
            src={`/view/${routeId}`}
            onLoad={handleIframeLoaded(routeId)}
          />
        </Fade>
      )}
    </div>
  ) : (
    authenticated && <h2>There are no pastes.</h2>
  )
}
