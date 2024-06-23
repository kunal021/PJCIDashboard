// sidebarSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  collapsed: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleCollapsed: (state) => {
      state.collapsed = !state.collapsed;
    },
  },
});

export const { toggleCollapsed } = sidebarSlice.actions;
export default sidebarSlice.reducer;
