import React, { useEffect, useRef, useState, useCallback } from 'react'
import PasteList from './PasteList'
import makeStyles from '@material-ui/styles/makeStyles'
import { useSelector } from 'react-redux'
import PasteView from './PasteView'
import { useAuthentication } from '../../state/slices/auth'

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
    '& >*': {
      position: 'absolute',
    },
  },
  iframe: {
    zIndex: ({ active }) => (active ? 1 : -1),
    opacity: ({ active }) => (active ? 1 : 0),
    border: 'none',
    height: '100%',
    width: '100%',
    transition: 'opacity 250ms ease-in',
  },
}))

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export default function Pastes({ match }) {
  const routeId = parseInt(match && match.params.id) || null

  const authenticated = useAuthentication()
  const classes = useStyles()

  const locationKey = useSelector(state => state.router.location.key)
  const pastes = useSelector(state => state.pastes)

  const [state, setState] = useState({ one: null, two: null, active: null })
  const [oneLoaded, setOneLoaded] = useState(false)
  const [twoLoaded, setTwoLoaded] = useState(false)

  const previousLocationKey = usePrevious(locationKey)

  /* This should probably be refactored to use useReducer */
  useEffect(() => {
    const { one, two, active } = state
    const notActive = active === 'one' ? 'two' : 'one'
    if (active === null && routeId) {
      // First selection
      setState({
        one: routeId,
        two: null,
        active: 'one',
      })
    } else if (active === 'one' && routeId !== one) {
      // New selection while one is active
      setState({
        one,
        two: routeId,
        active: 'two',
      })
    } else if (active === 'two' && routeId !== two) {
      // New selection while two is active
      setState({
        one: routeId,
        two,
        active: 'one',
      })
    } else if (active && !routeId) {
      // Active was deleted
      setState({
        one: null,
        two: null,
        active: null,
      })
    } else if (oneLoaded === true && active === 'one' && two !== null) {
      // Paste one is loaded, unload paste two
      setState({
        one,
        two: null,
        active,
      })
    } else if (twoLoaded === true && active === 'two' && one !== null) {
      // Paste two is loaded, unload paste one
      setState({
        one: null,
        two,
        active,
      })
    } else if (
      state[active] === routeId &&
      locationKey !== previousLocationKey
    ) {
      // Re-load the same paste in the other tab
      setState({
        [active]: state[active],
        [notActive]: routeId,
        active: notActive,
      })
    }
  }, [
    setState,
    routeId,
    state,
    locationKey,
    oneLoaded,
    twoLoaded,
    previousLocationKey,
  ])

  const handleOneLoaded = useCallback(() => {
    setOneLoaded(true)
    setTwoLoaded(false)
  }, [setOneLoaded, setTwoLoaded])

  const handleTwoLoaded = useCallback(() => {
    setOneLoaded(false)
    setTwoLoaded(true)
  }, [setOneLoaded, setTwoLoaded])

  return Array.isArray(pastes) && pastes.length > 0 ? (
    <div className={classes.pasteContainer}>
      <PasteList selected={routeId} />
      <section className={classes.iframeContainer}>
        {state.one && (
          <PasteView
            active={state.active === 'one'}
            id={state.one}
            onLoad={handleOneLoaded}
          />
        )}
        {state.two && (
          <PasteView
            active={state.active === 'two'}
            id={state.two}
            onLoad={handleTwoLoaded}
          />
        )}
      </section>
    </div>
  ) : (
    authenticated && <h2>There are no pastes.</h2>
  )
}
