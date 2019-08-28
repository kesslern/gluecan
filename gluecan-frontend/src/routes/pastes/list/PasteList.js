import React, { useCallback, useEffect, useRef } from 'react'
import List from '@material-ui/core/List'
import Snackbar from '@material-ui/core/Snackbar'
import makeStyles from '@material-ui/styles/makeStyles'
import { push } from 'connected-react-router'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import useToggle from 'react-use-toggle'
import { useDrawer } from '../../../state/slices/drawer'
import { getPastes } from '../../../state/slices/pastes'
import CurrentSearch from './CurrentSearch'
import PasteListItem from './PasteListItem'

const useStyles = makeStyles(theme => ({
  root: {
    width: 300,
    marginLeft: ({ drawerOpen }) => (drawerOpen ? 0 : -300),
    transition: 'margin-left .3s linear',
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    overflowY: 'auto',
  },
}))

function PasteList({ selected }) {
  const ref = useRef(null)
  const { open: drawerOpen } = useDrawer()
  const [showSnackbar, toggleSnackbar] = useToggle(false)
  const classes = useStyles({ drawerOpen })
  const dispatch = useDispatch()
  const pastes = useSelector(getPastes)

  const handleView = useCallback(
    id => () => {
      dispatch(push(`/pastes/${id}`))
    },
    [dispatch]
  )

  useEffect(() => {
    ref.current &&
      ref.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
  }, [ref])

  return (
    <div className={classes.root}>
      <CurrentSearch />
      <List>
        {pastes.map(paste => (
          <PasteListItem
            ref={paste.id === selected ? ref : null}
            key={paste.id}
            selected={paste.id === selected}
            paste={paste}
            onClick={handleView(paste.id)}
            onLinkCopy={toggleSnackbar}
          />
        ))}
      </List>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={showSnackbar}
        autoHideDuration={6000}
        onClose={toggleSnackbar}
        message="Copied shareable link to clipboard."
      />
    </div>
  )
}

PasteList.propTypes = {
  selected: PropTypes.number,
}

export default PasteList
