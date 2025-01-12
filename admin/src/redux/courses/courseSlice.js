import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
};

export const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourse: (state, action) => {
      state.courses = action.payload;
    },
    addCourse: (state, action) => {
      state.courses.unshift(action.payload);
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex(
        (course) => course.id === action.payload.id
      );
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter(
        (course) => course.id !== action.payload
      );
    },
  },
});

export const { setCourse, addCourse, updateCourse, deleteCourse } =
  courseSlice.actions;

export default courseSlice.reducer;
