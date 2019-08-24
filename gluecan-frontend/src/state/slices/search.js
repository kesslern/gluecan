import { createSlice } from 'redux-starter-kit'

const search = createSlice({
  slice: 'search',
  initialState: {
    ids: null,
    query: null,
  },
  reducers: {
    set: (_, action) => action.payload,
    clear: () => ({ ids: null, query: null }),
  },
})

const {
  actions: { set, clear },
} = search

export { set as setSearch, clear as clearSearch }
export default search.reducer
