import { batchActions } from 'redux-batched-actions'
import { createSlice } from 'redux-starter-kit'
import { setPastes } from './pastes'
import { push } from 'connected-react-router'

const auth = createSlice({
  slice: 'auth',
  initialState: {
    authenticated: false,
    failure: false,
    password: null,
  },
  reducers: {
    failure: state => {
      state.failure = true
    },
    success: (state, action) => {
      state.failure = false
      state.authenticated = true
      state.password = action.payload
    },
  },
})

const {
  actions: { failure, success },
} = auth

export function login(password) {
  return (dispatch, getState) => {
    fetch('/api/pastes', { headers: { 'X-Auth': password } })
      .then(it => it.json())
      .then(it => {
        dispatch(
          batchActions([setPastes(it), success(password), push('/pastes')])
        )
      })
      .catch(() => {
        dispatch(failure())
      })
  }
}

export default auth.reducer
