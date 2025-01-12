import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  image: [],
};

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImage: (state, action) => {
      state.image = action.payload;
    },

    addImage: (state, action) => {
      state.image.unshift(action.payload);
    },

    deleteImage: (state, action) => {
      state.image = state.image.filter((image) => image.id !== action.payload);
    },
  },
});

export const { setImage, addImage, deleteImage } = imageSlice.actions;

export default imageSlice.reducer;
