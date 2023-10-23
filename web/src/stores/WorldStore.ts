import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const worldSlice = createSlice({
  name: "world",
  initialState: {
    isJoined: false,
  },
  reducers: {
    setJoinWorld: (state, action: PayloadAction<boolean>) => {
      state.isJoined = action.payload;
    },
  },
});

export const { setJoinWorld } = worldSlice.actions;
export default worldSlice.reducer;
