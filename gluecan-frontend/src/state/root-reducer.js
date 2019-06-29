import pastesReducer from './slices/pastes'
import authReducer from './slices/auth'
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import history from './history'

export default combineReducers({
  auth: authReducer,
  pastes: pastesReducer,
  router: connectRouter(history),
})
