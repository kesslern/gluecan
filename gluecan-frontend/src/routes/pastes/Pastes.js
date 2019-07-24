import React, { useEffect, useState } from 'react'
import PasteList from './PasteList'
import makeStyles from '@material-ui/styles/makeStyles'
import { useSelector, useDispatch } from 'react-redux'
import { setPastes, viewedPaste } from '../../state/slices/pastes'
import { push } from 'connected-react-router'
import { useAuthentication } from '../../state/slices/auth'
import { CSSTransition } from 'react-transition-group'

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
    position: 'relative',
    height: '100%',
    flexGrow: 1,
    display: 'flex',
    '& >*': {
      position: 'absolute',
    },
  },
  iframe: {
    border: 'none',
    height: '100%',
    width: '100%',
    flexGrow: 1,
  },
}))

export default function Pastes({ match }) {
  const routeId = parseInt(match && match.params.id) || null
  const dispatch = useDispatch()
  const pastes = useSelector(state => state.pastes)
  const authenticated = useAuthentication()
  const classes = useStyles()
  const [state, setState] = useState({ one: null, two: null, active: null })

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
    const { one, two, active } = state
    if (active === null && routeId) {
      setState({
        one: routeId,
        two: null,
        active: 'one',
      })
    } else if (active === 'one' && routeId !== one) {
      setState({
        one: one,
        two: routeId,
        active: 'two',
      })
    } else if (active === 'two' && routeId !== two) {
      setState({
        one: routeId,
        two: two,
        active: 'one',
      })
    }
  }, [setState, routeId, state])

  useEffect(() => {
    console.log(state)
  }, [state])

  return Array.isArray(pastes) && pastes.length > 0 ? (
    <div className={classes.pasteContainer}>
      <PasteList selected={routeId} />
      <section className={classes.iframeContainer}>
        {state.one && (
          <PasteView active={state.active === 'one'} id={state.one} />
        )}
        {state.two && (
          <PasteView active={state.active === 'two'} id={state.two} />
        )}
      </section>
    </div>
  ) : (
    authenticated && <h2>There are no pastes.</h2>
  )
}

function PasteView({ id, active }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)

  function onLoad() {
    dispatch(viewedPaste(parseInt(id)))
    setLoaded(true)
  }
  function onExit() {
    setLoaded(false)
  }

  useEffect(() => setLoaded(false), [id])

  return (
    <CSSTransition
      in={loaded && active}
      timeout={250}
      classNames="fade"
      onExit={onExit}
    >
      <iframe
        className={classes.iframe}
        title="Content"
        src={`/view/${id}`}
        onLoad={onLoad}
      />
    </CSSTransition>
  )
}
