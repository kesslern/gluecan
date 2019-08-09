import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/styles/makeStyles'
import { useDispatch } from 'react-redux'
import { viewedPaste } from '../../state/slices/pastes'

const useStyles = makeStyles(theme => ({
  iframe: {
    zIndex: ({ active }) => (active ? 1 : -1),
    opacity: ({ active }) => (active ? 1 : 0),
    border: 'none',
    height: '100%',
    width: '100%',
    transition: 'opacity 250ms ease-in',
  },
}))

function PasteView({ id, active, onLoad }) {
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)
  const classes = useStyles({ active: loaded && active })

  function handleLoad() {
    onLoad()
    dispatch(viewedPaste(parseInt(id)))
    setLoaded(true)
  }

  useEffect(() => setLoaded(false), [id])

  return (
    <iframe
      className={classes.iframe}
      title="Content"
      src={`/view/${id}`}
      onLoad={handleLoad}
    />
  )
}

PasteView.propTypes = {
  id: PropTypes.number.isRequired,
  active: PropTypes.bool,
}

export default PasteView
