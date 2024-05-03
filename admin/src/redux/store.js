import { configureStore } from "@reduxjs/toolkit";

import courseReducer from "./courses/courseSlice";
import categoryReducer from "./categories/categorySlice";
import fullCourseReducer from "./courses/fullCourseSlice";
import testReducer from "./tests/testSlice";
import questionReducer from "./questions/questionSlice";

export default configureStore({
  reducer: {
    courses: courseReducer,
    category: categoryReducer,
    fullCourse: fullCourseReducer,
    test: testReducer,
    question: questionReducer,
  },
});
