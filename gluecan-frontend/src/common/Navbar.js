import React, { useCallback, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { makeStyles, fade } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { useDispatch, useSelector } from 'react-redux'
import { useAuthentication } from '../state/slices/auth'
import { setSearch } from '../state/slices/search'
import ArrowBack from '@material-ui/icons/ArrowBackIos'
import { useDrawer } from '../state/slices/drawer'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import { searchPastes } from '../state/slices/pastes'

const useStyles = makeStyles(theme => ({
  buttonContainer: {
    position: 'relative',
    '& .MuiButtonBase-root': {
      zIndex: 3,
      width: theme.spacing(10),
      marginTop: '3px',
      borderRadius: 0,
      transition: 'border 0s',
      height: theme.spacing(6),
    },
  },
  backIcon: {
    color: 'white',
    marginRight: ({ drawerOpen }) => theme.spacing(drawerOpen ? 0 : 20),
    marginLeft: ({ drawerOpen }) => theme.spacing(drawerOpen ? 20 : 0),
    transitionProperty: 'margin-left, margin-right, transform, opacity',
    transition: '.3s linear',
    transform: ({ drawerOpen }) => `rotate(${drawerOpen ? 0 : -180}deg)`,
    opacity: ({ drawerVisible }) => (drawerVisible ? 1 : 0),
  },
  toolBar: {
    '& >:nth-child(4):before': {
      zIndex: 2,
      visibility: ({ idx }) => (idx ? 'visible' : 'none'),
      content: '""',
      position: 'absolute',
      top: '0',
      left: ({ idx }) => (idx || 0) * 80,
      width: theme.spacing(10),
      height: '100%',
      borderBottom: '3px solid white',
      transition: 'left .1s linear',
    },
    '& >:nth-child(4):after': {
      zIndex: 1,
      visibility: ({ hoverActive }) => (hoverActive ? 'visible' : 'none'),
      content: '""',
      position: 'absolute',
      top: '0',
      left: ({ hoverIndex }) => theme.spacing(hoverIndex * 10),
      width: theme.spacing(10),
      height: '100%',
      borderBottom: ({ hoverActive }) =>
        hoverActive
          ? '3px solid rgba(255,255,255,.7)'
          : '0px solid rgba(255,255,255,.7)',
      transition: 'left .1s linear, border-bottom .2s ease-in-out',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: 'auto',
    marginLeft: 'auto',
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
}))

const LinkToNew = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} to={'/new'} {...props} />
))

const LinkToPastes = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} to={'/pastes'} {...props} />
))

function getIndex(location) {
  if (location === '/new') {
    return 1
  } else if (location.startsWith('/pastes')) {
    return 0
  }
}

function Navbar() {
  const { open: show, toggleOpen: toggle, display } = useDrawer()
  const authenticated = useAuthentication()
  const dispatch = useDispatch()
  const location = useSelector(state => state.router.location)
  const [hoverIndex, setHoverIndex] = useState(0)
  const [hoverActive, setHoverActive] = useState(false)
  const [query, setQuery] = useState('')

  const idx = getIndex(location.pathname)
  const classes = useStyles({
    idx,
    hoverActive,
    hoverIndex,
    drawerOpen: show,
    drawerVisible: display,
  })

  const handleHover = useCallback(
    value => () => {
      if (value !== true && value !== false) {
        setHoverIndex(value)
      } else {
        setHoverActive(value)
      }
    },
    [setHoverActive, setHoverIndex]
  )

  const handleSearchChange = useCallback(
    event => {
      setQuery(event.target.value)
    },
    [setQuery]
  )

  const handleSearchKeyPress = useCallback(
    event => {
      if (event.key === 'Enter') {
        dispatch(searchPastes(query))
        setQuery('')
      }
    },
    [dispatch, query, setQuery]
  )

  return (
    <AppBar position="static">
      <Toolbar variant="dense" className={classes.toolBar}>
        <Typography variant="h6">GlueCan</Typography>
        <IconButton
          aria-label="Close list panel"
          className={classes.backIcon}
          onClick={toggle}
        >
          <ArrowBack />
        </IconButton>

        {authenticated && (
          <>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                value={query}
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
                onChange={handleSearchChange}
                onKeyPress={handleSearchKeyPress}
              />
            </div>
            <div
              className={classes.buttonContainer}
              onMouseLeave={handleHover(false)}
              onMouseEnter={handleHover(true)}
            >
              <Button
                component={LinkToPastes}
                onMouseEnter={handleHover(0)}
                color="inherit"
              >
                Pastes
              </Button>
              <Button
                component={LinkToNew}
                onMouseEnter={handleHover(1)}
                color="inherit"
              >
                New
              </Button>
            </div>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
