import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullCourse: [],
};

export const fullCourseSlice = createSlice({
  name: "fullCourse",
  initialState,
  reducers: {
    setFullCourse: (state, action) => {
      state.fullCourse = action.payload;
    },
    addFullCourse: (state, action) => {
      state.fullCourse.push(action.payload);
    },
    updateFullCourse: (state, action) => {
      const index = state.fullCourse.findIndex(
        (fullCourse) => fullCourse.id === action.payload.id
      );
      if (index !== -1) {
        state.fullCourse[index] = action.payload;
      }
    },
    deleteFullCourse: (state, action) => {
      state.fullCourse = state.fullCourse.filter(
        (fullCourse) => fullCourse.id !== action.payload
      );
    },
  },
});

export const {
  setFullCourse,
  addFullCourse,
  updateFullCourse,
  deleteFullCourse,
} = fullCourseSlice.actions;

export default fullCourseSlice.reducer;
