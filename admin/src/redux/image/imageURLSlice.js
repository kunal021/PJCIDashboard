import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  imageURL: "",
};

export const imageSlice = createSlice({
  name: "imageURL",
  initialState,
  reducers: {
    setImageURL: (state, action) => {
      state.imageURL = action.payload;
    },
  },
});

export const { setImageURL } = imageSlice.actions;

export default imageSlice.reducer;
