import { configureStore } from "@reduxjs/toolkit";

import courseReducer from "./courses/courseSlice";
import categoryReducer from "./categories/categorySlice";
import fullCourseReducer from "./courses/fullCourseSlice";
import testReducer from "./tests/testSlice";
import questionReducer from "./questions/questionSlice";
import userReducer from "./users/userSlice";
import sidebarReducer from "./sidebar/sidebarSlice";
import videoReducer from "./videos/videoSlice";
import addVideoInCourseReducer from "./addvideoincourse/addVideoInCourseSlice";
import sliderReducer from "./slider/sliderSlice";
import directoryReducer from "./directory/directorySlice";

export default configureStore({
  reducer: {
    courses: courseReducer,
    category: categoryReducer,
    fullCourse: fullCourseReducer,
    test: testReducer,
    question: questionReducer,
    user: userReducer,
    sidebar: sidebarReducer,
    video: videoReducer,
    addVideoInCourse: addVideoInCourseReducer,
    slider: sliderReducer,
    directory: directoryReducer,
  },
});
