import React, { useEffect, useRef, useCallback, useReducer } from 'react'
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

const select = id => ({ type: 'select', payload: { id } })
const loaded = () => ({ type: 'loaded' })
const reload = () => ({ type: 'reload' })

function reducer(state, action) {
  switch (action.type) {
    case 'select':
      const { id } = action.payload
      return [
        { id: state[0].active ? state[0].id : id, active: !state[0].active },
        { id: state[1].active ? state[1].id : id, active: state[0].active },
      ]
    case 'loaded': {
      return [
        { id: state[0].active ? state[0].id : null, active: state[0].active },
        { id: state[1].active ? state[1].id : null, active: state[1].active },
      ]
    }
    case 'reload': {
      return [
        {
          id: state[0].active ? state[0].id : state[1].id,
          active: !state[0].active,
        },
        {
          id: state[0].active ? state[0].id : state[1].id,
          active: state[0].active,
        },
      ]
    }

    default:
      throw new Error()
  }
}

export default function Pastes({ match }) {
  const classes = useStyles()
  const routeId = parseInt(match && match.params.id) || null
  const previousRouteId = usePrevious(routeId)
  const [[one, two], dispatch] = useReducer(reducer, [
    { id: null, active: false },
    { id: null, active: false },
  ])

  const locationKey = useSelector(state => state.router.location.key)
  const previousLocationKey = usePrevious(locationKey)

  const pastes = useSelector(state => state.pastes)

  useEffect(() => {
    if (routeId !== previousRouteId) {
      dispatch(select(routeId))
    } else if (
      (one.id === routeId || two.id === routeId) &&
      locationKey !== previousLocationKey
    ) {
      dispatch(reload())
    }
  }, [
    dispatch,
    locationKey,
    one.id,
    one.loaded,
    previousLocationKey,
    previousRouteId,
    routeId,
    two.id,
    two.loaded,
  ])

  const handleLoad = useCallback(() => {
    dispatch(loaded())
  }, [])

  return Array.isArray(pastes) && pastes.length > 0 ? (
    <div className={classes.pasteContainer}>
      <PasteList selected={routeId} />
      <section className={classes.iframeContainer}>
        {one.id && (
          <PasteView active={one.active} id={one.id} onLoad={handleLoad} />
        )}
        {two.id && (
          <PasteView active={two.active} id={two.id} onLoad={handleLoad} />
        )}
      </section>
    </div>
  ) : (
    <h2>There are no pastes.</h2>
  )
}
