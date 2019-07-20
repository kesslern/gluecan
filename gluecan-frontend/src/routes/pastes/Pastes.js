import React, { useCallback, useEffect, useState } from 'react'
import Paper from '@material-ui/core/Paper'
import PasteList from './PasteList'
import makeStyles from '@material-ui/styles/makeStyles'
import { useSelector, useDispatch } from 'react-redux'
import { setPastes, viewedPaste } from '../../state/slices/pastes'
import { push } from 'connected-react-router'
import { useAuthentication } from '../../state/slices/auth'
import { Route } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

const useStyles = makeStyles(theme => ({
  pasteContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    flexGrow: 1,
  },
  iframeContainer: {
    height: '100%',
    flexGrow: 1,
    display: 'flex',
  },
  iframe: {
    border: 'none',
    height: '100%',
    flexGrow: 1,
  },
}))

export default function Pastes({ match }) {
  const routeId = parseInt(match && match.params.id) || null
  const dispatch = useDispatch()
  const pastes = useSelector(state => state.pastes)
  const authenticated = useAuthentication()
  const classes = useStyles()

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

  return Array.isArray(pastes) && pastes.length > 0 ? (
    <div className={classes.pasteContainer}>
      <PasteList selected={routeId} />
      <TransitionGroup className={classes.iframeContainer}>
        <Route exact path="/pastes/:id">
          {({ match }) => (match ? <PasteView id={match.params.id} /> : null)}
        </Route>
      </TransitionGroup>
    </div>
  ) : (
    authenticated && <h2>There are no pastes.</h2>
  )
}

function PasteView({ id }) {
  const classes = useStyles()
  const [loaded, setLoaded] = useState(false)

  function onLoad() {
    setLoaded(true)
  }
  function onExit() {
    setLoaded(false)
  }

  useEffect(() => setLoaded(false), [id])

  return (
    <CSSTransition in={loaded} timeout={250} classNames="fade" onExit={onExit}>
      <iframe
        className={classes.iframe}
        title="Content"
        src={`/view/${id}`}
        onLoad={onLoad}
      />
    </CSSTransition>
  )
}
