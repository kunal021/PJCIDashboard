import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addVideoInCourse: [],
};

export const addVideoInCourseSlice = createSlice({
  name: "addVideoInCourse",
  initialState,
  reducers: {
    setAddVideoInCourse: (state, action) => {
      state.addVideoInCourse = [...state.addVideoInCourse, ...action.payload];
    },
    addAddVideoInCourse: (state, action) => {
      state.addVideoInCourse.push(action.payload);
    },
    updateAddVideoInCourse: (state, action) => {
      const index = state.addVideoInCourse.findIndex(
        (addVideoInCourse) => addVideoInCourse.id === action.payload.id
      );
      if (index !== -1) {
        state.addVideoInCourse[index] = action.payload;
      }
    },
    deleteAddVideoInCourse: (state, action) => {
      state.addVideoInCourse = state.addVideoInCourse.filter(
        (addVideoInCourse) => addVideoInCourse.id !== action.payload
      );
    },
  },
});

export const {
  setAddVideoInCourse,
  addAddVideoInCourse,
  updateAddVideoInCourse,
  deleteAddVideoInCourse,
} = addVideoInCourseSlice.actions;

export default addVideoInCourseSlice.reducer;
