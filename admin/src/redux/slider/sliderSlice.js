import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  slider: [],
};

export const sliderSlice = createSlice({
  name: "slider",
  initialState,
  reducers: {
    setSlider: (state, action) => {
      state.slider = action.payload;
    },
    addSlider: (state, action) => {
      state.slider.unshift(action.payload);
    },

    updateSlider: (state, action) => {
      const index = state.slider.findIndex(
        (slider) => slider.id === action.payload.id
      );
      if (index !== -1) {
        state.slider[index] = action.payload;
      } else {
        throw new Error("Slider ID not found:", action.payload.id);
      }
    },

    deleteSlider: (state, action) => {
      state.slider = state.slider.filter(
        (slider) => slider.id !== action.payload
      );
    },
  },
});

export const { addSlider, deleteSlider, setSlider, updateSlider } =
  sliderSlice.actions;

export default sliderSlice.reducer;
