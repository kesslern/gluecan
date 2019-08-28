import React, { useCallback } from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import PropTypes from 'prop-types'
import languages from '../../../data/languages'
import DeleteButton from './DeleteButton'
import CopyButton from './CopyButton'

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

const PasteListItem = React.forwardRef(
  ({ paste, selected, onLinkCopy }, ref) => {
    const dispatch = useDispatch()

    const handleView = useCallback(
      id => () => {
        dispatch(push(`/pastes/${id}`))
      },
      [dispatch]
    )

    return (
      <ListItem
        ref={ref}
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
          <CopyButton id={paste.id} onLinkCopy={onLinkCopy} />
          <DeleteButton id={paste.id} />
        </ListItemSecondaryAction>
      </ListItem>
    )
  }
)

PasteListItem.propTypes = {
  paste: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  onLinkCopy: PropTypes.func.isRequired,
}

export default PasteListItem
