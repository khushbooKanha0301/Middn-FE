import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
}

const loginLoderSlice = createSlice({
  name: 'loginLoder',
  initialState,
  reducers: {
    setLoginLoading: (state, action) => ({
      ...state,
      loading: action.payload,
    }),
  },
})

export const { setLoginLoading } = loginLoderSlice.actions
export default loginLoderSlice.reducer
