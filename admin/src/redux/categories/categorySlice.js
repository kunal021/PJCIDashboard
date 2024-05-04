import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  category: [],
};

export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    addCategory: (state, action) => {
      state.category.push(action.payload);
    },
    updateCategory: (state, action) => {
      const index = state.category.findIndex(
        (category) => category.id === action.payload.id
      );
      if (index !== -1) {
        state.category[index] = action.payload;
      }
    },
    deleteCategory: (state, action) => {
      state.category = state.category.filter(
        (category) => category.id !== action.payload
      );
    },
  },
});

export const { setCategory, addCategory, updateCategory, deleteCategory } =
  categorySlice.actions;

export default categorySlice.reducer;
