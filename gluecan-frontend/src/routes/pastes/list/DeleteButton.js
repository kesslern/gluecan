import React, { useCallback } from 'react'
import { deletePaste } from '../../../state/slices/pastes'
import { useDispatch } from 'react-redux'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

function DeleteButton({ id }) {
  const dispatch = useDispatch()
  const handleDelete = useCallback(() => {
    dispatch(deletePaste(id))
  }, [dispatch, id])

  return (
    <IconButton edge="end" aria-label="Delete" onClick={handleDelete}>
      <DeleteIcon />
    </IconButton>
  )
}

export default DeleteButton
