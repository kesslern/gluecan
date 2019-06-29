import { createSlice } from 'redux-starter-kit'

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
    dispatch(actions.delete(id))
  }
}

export { set as setPastes }
export default pastes.reducer
