import React, { useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import PasteList from './PasteList'
import makeStyles from '@material-ui/styles/makeStyles'
import { useSelector, useDispatch } from 'react-redux'
import { setPastes } from './state/slices/pastes'
import { push } from 'connected-react-router'
import { Fade } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
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
  const authenticated = useSelector(state => state.auth.authenticated)
  const [iframeLoaded, setIframeLoaded] = useState(false)

  function loaded() {
    setIframeLoaded(true)
  }

  useEffect(() => {
    console.log('mounting')
    return () => {
      console.log('unmounting')
    }
  }, [])

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
    <React.Fragment>
      <PasteList selected={routeId} />
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
  ) : (
    authenticated && <h2>There are no pastes.</h2>
  )
}
