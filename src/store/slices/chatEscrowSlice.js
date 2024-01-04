import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  MessageUser: null,
  isChatOpen: false,
};

const chatEscrowSlice = createSlice({
  name: "escrow",
  initialState,
  reducers: {
    setIsChatEscrowPage: (state, action) => ({
      ...state,
      MessageUser: action.payload?.user,
      isChatOpen: action.payload?.isChatOpen,
    }),
  },
});

export const { setIsChatEscrowPage } = chatEscrowSlice.actions;
export default chatEscrowSlice.reducer;
