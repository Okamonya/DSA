import { createSlice } from "@reduxjs/toolkit";
import { TabState } from "./tabTypes";


const initialState: TabState = {
  opened: false,
};

// Create a slice
const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    toggleOpened: (state) => {
      state.opened = !state.opened;
    },
  },
});

// Export actions and reducer
export const { toggleOpened } = tabSlice.actions;
export default tabSlice.reducer;
