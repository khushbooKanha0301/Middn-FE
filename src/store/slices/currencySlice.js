import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import jwtAxios from "../../service/jwtAxios";
import { notificationFail } from "./notificationSlice";

const initialState = {
    cryptoAmount: 0
};



export const convertToCrypto = createAsyncThunk(
  "convertToCrypto",
  async (action, { dispatch }) => {
    try {
      const res = await jwtAxios
        .post(`auth/getCryptoAmountDetails`, action)
        .then((response) => {
          return response?.data;
        });
      return res;
    } catch (error) {
      dispatch(notificationFail(error?.response?.data?.message));
    }
  }
);

const currencySlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(convertToCrypto.fulfilled, (state, action) => {
        if (!action?.payload) {
          return;
        }
        state.cryptoAmount = action.payload;
      })
    },
});

export default currencySlice.reducer;
