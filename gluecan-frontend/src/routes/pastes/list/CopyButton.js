import React, { useCallback } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Share from '@material-ui/icons/Share'

function CopyButton({ id, onLinkCopy }) {
  const handleLinkCopy = useCallback(() => {
    navigator.clipboard.writeText(`${window.location.origin}/view/${id}`)
    onLinkCopy()
  }, [id, onLinkCopy])

  return (
    <IconButton edge="end" aria-label="Share" onClick={handleLinkCopy}>
      <Share />
    </IconButton>
  )
}

export default CopyButton
