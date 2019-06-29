import reducer from './root-reducer'
import history from './history'
import { routerMiddleware } from 'connected-react-router'
import { configureStore, getDefaultMiddleware } from 'redux-starter-kit'
import { batchDispatchMiddleware } from 'redux-batched-actions'
import thunk from 'redux-thunk'

const middleware = [
  ...getDefaultMiddleware(),
  routerMiddleware(history),
  batchDispatchMiddleware,
  thunk,
]

export default configureStore({
  reducer,
  middleware,
})
