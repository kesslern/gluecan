import React, { useCallback, useEffect, useRef } from 'react'
import List from '@material-ui/core/List'
import makeStyles from '@material-ui/styles/makeStyles'
import IconButton from '@material-ui/core/IconButton'
import useToggle from 'react-use-toggle'
import { useDispatch, useSelector } from 'react-redux'
import { push } from 'connected-react-router'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import Paper from '@material-ui/core/Paper'
import PasteListItem from './PasteListItem'
import { useDrawer } from '../../state/slices/drawer'
import { clearSearch } from '../../state/slices/search'
import CloseIcon from '@material-ui/icons/Close'
import { getPastes } from '../../state/slices/pastes'

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

function CurrentSearch() {
  const dispatch = useDispatch()
  const search = useSelector(state => state.search)

  const handleSearchClear = useCallback(() => {
    dispatch(clearSearch())
  }, [dispatch])

  return search.query ? (
    <Paper>
      Showing pastes matching "{search.query}"{' '}
      <IconButton onClick={handleSearchClear}>
        <CloseIcon />
      </IconButton>
    </Paper>
  ) : null
}

export default function PasteList({ selected }) {
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
