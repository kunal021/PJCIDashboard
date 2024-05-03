import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  question: [],
};

export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestion: (state, action) => {
      state.question = action.payload;
    },
    addQuestion: (state, action) => {
      state.question.push(action.payload);
    },
    updateQuestion: (state, action) => {
      const index = state.question.findIndex(
        (course) => course._id === action.payload._id
      );
      if (index !== -1) {
        state.question[index] = action.payload;
      }
    },
    deleteQuestion: (state, action) => {
      state.question = state.question.filter(
        (course) => course._id !== action.payload
      );
    },
  },
});

export const { setQuestion, addQuestion, updateQuestion, deleteQuestion } =
  questionSlice.actions;

export default questionSlice.reducer;
