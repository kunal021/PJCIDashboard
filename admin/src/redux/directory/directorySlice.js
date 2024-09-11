import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  directory: [],
};

const directorySlice = createSlice({
  name: "directory",
  initialState,
  reducers: {
    setDirectory: (state, action) => {
      state.directory = action.payload;
    },
    addDirectory: (state, action) => {
      state.directory.push(action.payload);
    },
    updateDirectory: (state, action) => {
      const index = state.directory.findIndex(
        (directory) => directory.id === action.payload.id
      );
      if (index !== -1) {
        state.directory[index] = action.payload;
      }
    },
    deleteDirectory: (state, action) => {
      state.directory = state.directory.filter(
        (directory) => directory.id !== action.payload
      );
    },
  },
});

export const { setDirectory, addDirectory, updateDirectory, deleteDirectory } =
  directorySlice.actions;

export default directorySlice.reducer;
