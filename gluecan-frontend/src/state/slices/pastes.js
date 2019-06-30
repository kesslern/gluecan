import { createSlice } from 'redux-starter-kit'
import { goBack } from 'connected-react-router'
import { batchActions } from 'redux-batched-actions'

const pastes = createSlice({
  slice: 'pastes',
  initialState: null,
  reducers: {
    set: (_, action) => action.payload,
    delete: (state, action) => {
      return state.filter(paste => paste.id !== action.payload)
    },
  },
})

const { actions } = pastes
const { set } = actions

export function deletePaste(id) {
  return (dispatch, getState) => {
    fetch(`/api/pastes/${id}`, {
      method: 'delete',
      headers: { 'X-Auth': getState().auth.password },
    })
    const toDispatch = [actions.delete(id)]

    if (getState().router.location.pathname === `/pastes/${id}`) {
      toDispatch.push(goBack())
    }

    dispatch(batchActions(toDispatch))
  }
}

export { set as setPastes }
export default pastes.reducer
