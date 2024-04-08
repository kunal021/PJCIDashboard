import { configureStore } from "@reduxjs/toolkit";

import courseReducer from "./courses/courseSlice";

export default configureStore({
  reducer: {
    courses: courseReducer,
  },
});
