import authReducer from './slices/auth'
import drawerReducer from './slices/drawer'
import pastesReducer from './slices/pastes'
import searchReducer from './slices/search'

import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import history from './history'

export default combineReducers({
  auth: authReducer,
  drawer: drawerReducer,
  pastes: pastesReducer,
  router: connectRouter(history),
  search: searchReducer,
})
