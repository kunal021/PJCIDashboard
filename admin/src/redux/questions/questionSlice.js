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
      state.question.unshift(action.payload);
    },
    updateQuestion: (state, action) => {
      const index = state.question.findIndex(
        (question) => question.qnsid === action.payload.qnsid
      );
      if (index !== -1) {
        state.question[index] = action.payload;
      } else {
        throw new Error("Question ID not found:", action.payload.id);
      }
    },
    deleteQuestion: (state, action) => {
      state.question = state.question.filter(
        (question) => question.qnsid !== action.payload
      );
    },
  },
});

export const { setQuestion, addQuestion, updateQuestion, deleteQuestion } =
  questionSlice.actions;

export default questionSlice.reducer;
