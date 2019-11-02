import { createSlice } from 'redux-starter-kit'
import { LOCATION_CHANGE } from 'connected-react-router'
import { useSelector, useDispatch } from 'react-redux'

const drawer = createSlice({
  name: 'drawer',
  initialState: {
    display: false,
    open: true,
  },
  reducers: {
    toggle: state => {
      state.open = !state.open
    },
  },
  extraReducers: {
    [LOCATION_CHANGE]: (state, action) => {
      state.display = action.payload.location.pathname.startsWith('/pastes')
      return state
    },
  },
})

const {
  actions: { toggle },
} = drawer

export function useDrawer() {
  const dispatch = useDispatch()
  const { display, open } = useSelector(state => state.drawer)
  const toggleOpen = () => {
    dispatch(toggle())
  }
  return {
    display,
    open,
    toggleOpen,
  }
}

export { toggle as toggleDrawer }
export default drawer.reducer
