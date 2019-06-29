import React from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import makeStyles from '@material-ui/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Pastes({ pastes }) {
  const classes = useStyles()

  return pastes &&
    <List className={classes.root}>
      {pastes.map(paste =>
        <ListItem key={paste.id}>
          <ListItemText primary={`ID: ${paste.id} Views: ${paste.views}`} />
        </ListItem>
      )}
    </List>
}
