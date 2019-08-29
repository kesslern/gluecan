import React, { useEffect, useRef, useState, useCallback } from 'react'
import PasteList from './list/PasteList'
import makeStyles from '@material-ui/styles/makeStyles'
import { useSelector } from 'react-redux'
import PasteView from './PasteView'

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
  const previousRouteId = usePrevious(routeId)

  const classes = useStyles()

  const locationKey = useSelector(state => state.router.location.key)
  const previousLocationKey = usePrevious(locationKey)

  const pastes = useSelector(state => state.pastes)

  const [one, setOne] = useState({ id: null, active: false, loaded: false })
  const [two, setTwo] = useState({ id: null, active: false, loaded: false })

  /* This should probably be refactored to use useReducer */
  useEffect(() => {
    if (routeId !== null && !previousRouteId && !one.active) {
      // First selection
      setOne({
        id: routeId,
        active: true,
        loaded: false,
      })
    } else if (one.active && one.id !== routeId) {
      // New selection while one is active
      setOne({
        ...one,
        active: false,
      })
      setTwo({
        id: routeId,
        active: true,
        loaded: false,
      })
    } else if (two.active && two.id !== routeId) {
      // New selection while two is active
      setOne({
        id: routeId,
        active: true,
        loaded: false,
      })
      setTwo({
        ...two,
        active: false,
      })
    } else if ((one.active || two.active) && !routeId) {
      // Active was deleted
      setOne({
        id: null,
        active: false,
        loaded: false,
      })
      setTwo({
        id: null,
        active: false,
        loaded: false,
      })
    } else if (one.loaded && one.active && two.loaded) {
      // Paste one is loaded, unload paste two
      setTwo({
        id: null,
        active: false,
        loaded: false,
      })
    } else if (two.loaded && two.active && one.loaded) {
      // Paste two is loaded, unload paste one
      setOne({
        id: null,
        active: false,
        loaded: false,
      })
    } else if (
      one.active &&
      one.id === routeId &&
      locationKey !== previousLocationKey
    ) {
      // Re-load the same paste in the other tab
      setOne({
        ...one,
        active: false,
      })
      setTwo({
        id: routeId,
        active: true,
        loaded: false,
      })
    } else if (
      two.active &&
      two.id === routeId &&
      locationKey !== previousLocationKey
    ) {
      // Re-load the same paste in the other tab
      setOne({
        id: routeId,
        active: true,
        loaded: false,
      })
      setTwo({
        ...two,
        active: false,
      })
    }
  }, [routeId, locationKey, previousLocationKey, previousRouteId, one, two])

  const handleOneLoaded = useCallback(() => {
    setOne({
      ...one,
      loaded: true,
    })
  }, [one])

  const handleTwoLoaded = useCallback(() => {
    setTwo({
      ...two,
      loaded: true,
    })
  }, [two])

  return Array.isArray(pastes) && pastes.length > 0 ? (
    <div className={classes.pasteContainer}>
      <PasteList selected={routeId} />
      <section className={classes.iframeContainer}>
        {one.id && (
          <PasteView active={one.active} id={one.id} onLoad={handleOneLoaded} />
        )}
        {two.id && (
          <PasteView active={two.active} id={two.id} onLoad={handleTwoLoaded} />
        )}
      </section>
    </div>
  ) : (
    <h2>There are no pastes.</h2>
  )
}
