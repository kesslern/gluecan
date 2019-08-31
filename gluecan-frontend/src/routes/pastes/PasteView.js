import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@material-ui/styles/makeStyles'
import { useDispatch } from 'react-redux'
import { viewedPaste } from '../../state/slices/pastes'

const useStyles = makeStyles(theme => ({
  iframe: {
    zIndex: ({ loaded }) => (loaded ? 1 : -1),
    opacity: ({ loaded }) => (loaded ? 1 : 0),
    border: 'none',
    height: '100%',
    width: '100%',
    transition: 'opacity 250ms ease-in',
  },
}))

function PasteView({ id, onLoad }) {
  const dispatch = useDispatch()
  const [loaded, setLoaded] = useState(false)

  const classes = useStyles({ loaded })

  function handleLoad() {
    dispatch(viewedPaste(parseInt(id)))
    setLoaded(true)
    setTimeout(() => {
      onLoad()
    }, 250)
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
  onLoad: PropTypes.func.isRequired,
}

export default PasteView
