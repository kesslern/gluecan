import { createSlice } from 'redux-starter-kit'
import { goBack, push } from 'connected-react-router'
import { batchActions } from 'redux-batched-actions'

const pastes = createSlice({
  slice: 'pastes',
  initialState: null,
  reducers: {
    loading: () => 'loading',
    set: (_, action) => action.payload,
    delete: (state, action) => {
      return state.filter(paste => paste.id !== action.payload)
    },
  },
})

const {
  actions: { set, loading, delete: deleteAction },
} = pastes

export function deletePaste(id) {
  return (dispatch, getState) => {
    fetch(`/api/pastes/${id}`, {
      method: 'delete',
    })
    const toDispatch = [deleteAction(id)]

    if (getState().router.location.pathname === `/pastes/${id}`) {
      toDispatch.push(goBack())
    }

    dispatch(batchActions(toDispatch))
  }
}

export function submitPaste(text) {
  return (dispatch, getState) => {
    fetch('/api/pastes', {
      method: 'post',
      body: text,
    })
      .then(it => it.text())
      .then(id => {
        fetch('/api/pastes')
          .then(it => it.json())
          .then(it => {
            dispatch(batchActions([set(it), push(`/pastes/${id}`)]))
          })
      })
  }
}

export { set as setPastes, loading as loadingPastes }
export default pastes.reducer
