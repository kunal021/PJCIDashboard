import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  test: [],
};

export const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setTest: (state, action) => {
      state.test = action.payload;
    },
    addTest: (state, action) => {
      state.test.push(action.payload);
    },
    updateTest: (state, action) => {
      const index = state.test.findIndex(
        (test) => test.id === action.payload.id
      );
      if (index !== -1) {
        state.test[index] = action.payload;
      }
    },
    deleteTest: (state, action) => {
      state.test = state.test.filter((test) => test.id !== action.payload);
    },
  },
});

export const { setTest, addTest, updateTest, deleteTest } = testSlice.actions;

export default testSlice.reducer;
