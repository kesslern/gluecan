import React, { useCallback, useEffect } from 'react'
import List from '@material-ui/core/List'
import makeStyles from '@material-ui/styles/makeStyles'
import useToggle from 'react-use-toggle'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import PasteListItem from './PasteListItem'
import { useDrawer } from '../../state/slices/drawer'

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

export default function PasteList({ selected }) {
  const { open: drawerOpen } = useDrawer()
  const [showSnackbar, toggleSnackbar] = useToggle(false)
  const classes = useStyles({ drawerOpen })
  const dispatch = useDispatch()
  const pastes = useSelector(state => state.pastes)

  const handleView = useCallback(
    id => () => {
      dispatch(push(`/pastes/${id}`))
    },
    [dispatch]
  )

  return (
    <>
      <List className={classes.root}>
        {pastes.map(paste => (
          <PasteListItem
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
    </>
  )
}

PasteList.propTypes = {
  selected: PropTypes.number,
}
