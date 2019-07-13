import React, { useState } from 'react'
import './App.css'
import CssBaseline from '@material-ui/core/CssBaseline'
import LoginForm from './routes/login/LoginForm'
import Pastes from './routes/pastes/Pastes'
import { Route, Redirect, Switch } from 'react-router-dom'
import { Link as RouterLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import history from './state/history'
import { ConnectedRouter } from 'connected-react-router'
import { makeStyles } from '@material-ui/styles'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import New from './routes/new/New'

const useStyles = makeStyles(theme => ({
  contentBox: {
    flexGrow: 1,
    '&> *': {
      position: 'absolute',
      width: '100%',
      top: theme.spacing(8),
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  buttonContainer: {
    position: 'relative',
  },
  appRoot: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  toolBar: {
    '& h6': {
      flexGrow: 1,
    },
    '& .MuiButtonBase-root': {
      zIndex: 3,
      width: theme.spacing(10),
      marginTop: '3px',
      borderRadius: 0,
      transition: 'border 0s',
      height: theme.spacing(6),
    },
    '& >:nth-child(2):before': {
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
    '& >:nth-child(2):after': {
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

function App() {
  const location = useSelector(state => state.router.location)
  const [hoverIndex, setHoverIndex] = useState(0)
  const [hoverActive, setHoverActive] = useState(false)
  const idx = getIndex(location.pathname)

  const classes = useStyles({ idx, hoverActive, hoverIndex })

  const handleHover = value => () => {
    if (value !== true && value !== false) {
      setHoverIndex(value)
    } else {
      setHoverActive(value)
    }
  }

  return (
    <div className={classes.appRoot}>
      <CssBaseline />
      <ConnectedRouter history={history}>
        <AppBar position="static">
          <Toolbar variant="dense" className={classes.toolBar}>
            <Typography variant="h6">GlueCan</Typography>
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
          </Toolbar>
        </AppBar>
        <TransitionGroup className={classes.contentBox}>
          <CSSTransition key={location.key} classNames="fade" timeout={1000}>
            <div>
              <Switch location={location}>
                <Route path="/pastes/:id" component={Pastes} />
                <Route path="/pastes" component={Pastes} />
                <Route path="/new" component={New} />
                <Route exact path="/login" component={LoginForm} />
                <Redirect to="/pastes" />
              </Switch>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </ConnectedRouter>
    </div>
  )
}

export default App
