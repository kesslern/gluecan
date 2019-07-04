import { batchActions } from 'redux-batched-actions'
import { createSlice } from 'redux-starter-kit'
import { setPastes, loadingPastes } from './pastes'
import { push } from 'connected-react-router'

const auth = createSlice({
  slice: 'auth',
  initialState: {
    authenticated: false,
    failure: false,
  },
  reducers: {
    failure: state => {
      state.failure = true
    },
    success: (state, action) => {
      state.failure = false
      state.authenticated = true
    },
  },
})

const {
  actions: { failure, success },
} = auth

/**
 * Attempt loading pastes using existing cookie values.
 * Go to '/pastes' on success.
 */
export function preLogin() {
  return dispatch => {
    dispatch(loadingPastes())
    fetch('/api/pastes')
      .then(it => it.json())
      .then(it => {
        dispatch(batchActions([setPastes(it), success(), push('/pastes')]))
      })
  }
}

/**
 * Attempt loading pastes with a specific password.
 * Go to '/pastes' on success.
 */
export function login(password) {
  return dispatch => {
    const options = { headers: { 'X-Auth': password } }

    dispatch(loadingPastes())
    fetch('/api/pastes', options)
      .then(it => it.json())
      .then(it => {
        dispatch(batchActions([setPastes(it), success(), push('/pastes')]))
      })
      .catch(() => {
        dispatch(failure())
      })
  }
}

export default auth.reducer
