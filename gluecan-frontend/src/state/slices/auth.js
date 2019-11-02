import { batchActions } from 'redux-batched-actions'
import { createSlice } from 'redux-starter-kit'
import { setPastes } from './pastes'
import { useSelector } from 'react-redux'

const auth = createSlice({
  name: 'auth',
  initialState: {
    authenticated: null,
    failure: false,
  },
  reducers: {
    unauthenticated: state => {
      state.authenticated = false
    },
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
  actions: { failure, success, unauthenticated },
} = auth

/**
 * Attempt loading pastes with a specific password.
 * Go to '/pastes' on success.
 */
export function login(password) {
  return dispatch => {
    const options = {}

    if (password) {
      options.headers = { 'X-Auth': password }
    }

    fetch('/api/pastes', options)
      .then(it => it.json())
      .then(it => {
        dispatch(batchActions([setPastes(it), success()]))
      })
      .catch(() => {
        if (password) {
          dispatch(failure())
        } else {
          dispatch(unauthenticated())
        }
      })
  }
}

/**
 * A custom hook getting basic authentication status.
 * @returns {boolean} - True/False indicating authentication status.
 */
export function useAuthentication() {
  return useSelector(state => state.auth.authenticated)
}

export default auth.reducer
