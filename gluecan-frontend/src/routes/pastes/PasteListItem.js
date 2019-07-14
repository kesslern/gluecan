import React, { useCallback } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { deletePaste } from '../../state/slices/pastes'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Share from '@material-ui/icons/Share'
import PropTypes from 'prop-types'
import languages from '../../data/languages'

function buildSecondaryText(paste) {
  const viewsText = paste.views === 1 ? '1 view' : `${paste.views} views`
  let languageText = ''
  if (paste.language) {
    const { label } = languages.find(
      language => language.language === paste.language
    ) || { label: paste.language }
    languageText = `${label}, `
  }
  return languageText + viewsText
}

function PasteListItem({ paste, selected, onLinkCopy }) {
  const dispatch = useDispatch()

  const handleView = useCallback(
    id => () => {
      dispatch(push(`/pastes/${id}`))
    },
    [dispatch]
  )

  const handleDelete = useCallback(() => {
    dispatch(deletePaste(paste.id))
  }, [dispatch, paste])

  const handleLinkCopy = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/view/${paste.id}`)
    onLinkCopy()
  }, [paste, onLinkCopy])

  return (
    <ListItem
      key={paste.id}
      selected={selected}
      button={true}
      onClick={handleView(paste.id)}
      divider
    >
      <ListItemText
        primary={`Paste #${paste.id}`}
        secondary={buildSecondaryText(paste)}
      />
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="Share" onClick={handleLinkCopy}>
          <Share />
        </IconButton>
        <IconButton edge="end" aria-label="Delete" onClick={handleDelete}>
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

PasteListItem.propTypes = {
  paste: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onLinkCopy: PropTypes.func.isRequired,
}

export default PasteListItem
