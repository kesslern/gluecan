import { createSlice } from 'redux-starter-kit'
import { push, replace } from 'connected-react-router'
import { batchActions } from 'redux-batched-actions'
import { setSearch } from './search'

const pastes = createSlice({
  name: 'pastes',
  initialState: null,
  reducers: {
    add: (state, action) => {
      state.push(action.payload)
      state.sort((a, b) => (a.id > b.id ? 1 : -1))
    },
    set: (_, action) => action.payload,
    viewed: (state, action) => {
      const paste = state.find(it => it.id === action.payload)
      paste && paste.views++
    },
    delete: (state, action) => {
      return state.filter(paste => paste.id !== action.payload)
    },
  },
})

const {
  actions: { set, delete: deleteAction, viewed, add },
} = pastes

export function deletePaste(id) {
  return (dispatch, getState) => {
    fetch(`/api/pastes/${id}`, {
      method: 'delete',
    })
    const toDispatch = [deleteAction(id)]

    if (getState().router.location.pathname === `/pastes/${id}`) {
      toDispatch.push(replace('/pastes'))
    }

    dispatch(batchActions(toDispatch))
  }
}

export function submitPaste({ text, language }) {
  return dispatch => {
    const queryParams = language ? `?lang=${encodeURIComponent(language)}` : ''

    fetch(`/api/pastes${queryParams}`, {
      method: 'post',
      body: text,
    })
      .then(it => it.text())
      .then(id => {
        dispatch(
          batchActions([
            add({
              id: parseInt(id, 10),
              language,
              views: 0,
            }),
            push(`/pastes/${id}`),
          ])
        )
      })
  }
}

export function searchPastes(query) {
  return async (dispatch, getState) => {
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(it => it.json())
      .then(ids => dispatch(setSearch({ query, ids })))
  }
}

export function getPastes(state) {
  if (state.search.ids) {
    return state.pastes.filter(paste => state.search.ids.includes(paste.id))
  } else {
    return state.pastes
  }
}

export { set as setPastes, viewed as viewedPaste }
export default pastes.reducer
