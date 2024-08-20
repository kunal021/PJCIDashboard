import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  AboutUs,
  AddCourse,
  AddFreeVideo,
  AddFullCourse,
  AddTest,
  AddVideo,
  FreeVideos,
  GetAllUsers,
  GetCategory,
  GetCourse,
  GetCourseCategoryWise,
  GetFullCourse,
  GetFullCourseSubjects,
  GetQuestions,
  GetTest,
  GetVideo,
  GetVideoInCourse,
  Home,
  Layout,
  Login,
  NewAddQns,
  PrivacyPolicy,
  PrivateRoute,
  TermsAndConditions,
  UpdateCategory,
  UpdateVideo,
} from "./app.import";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute element={Home} />} />
          <Route
            path="/get-course"
            element={<PrivateRoute element={GetCourse} />}
          />
          <Route
            path="/add-course"
            element={<PrivateRoute element={AddCourse} />}
          />
          <Route
            path="/get-course-videos"
            element={<PrivateRoute element={GetVideoInCourse} />}
          />
          <Route
            path="/get-full-course"
            element={<PrivateRoute element={GetFullCourse} />}
          />
          <Route
            path="/add-full-course"
            element={<PrivateRoute element={AddFullCourse} />}
          />
          <Route
            path="/get-full-course-subject"
            element={<PrivateRoute element={GetFullCourseSubjects} />}
          />
          <Route
            path="/get-course-category-wise"
            element={<PrivateRoute element={GetCourseCategoryWise} />}
          />
          <Route
            path="/category"
            element={<PrivateRoute element={GetCategory} />}
          />
          <Route
            path="/update-category"
            element={<PrivateRoute element={UpdateCategory} />}
          />
          <Route
            path="/get-test"
            element={<PrivateRoute element={GetTest} />}
          />
          <Route
            path="/get-test-question"
            element={<PrivateRoute element={GetQuestions} />}
          />
          <Route
            path="/add-test-question"
            element={<PrivateRoute element={NewAddQns} />}
          />
          <Route
            path="/add-test"
            element={<PrivateRoute element={AddTest} />}
          />
          <Route
            path="/get-users"
            element={<PrivateRoute element={GetAllUsers} />}
          />
          <Route
            path="/about-us"
            element={<PrivateRoute element={AboutUs} />}
          />
          <Route
            path="/privacy-policy"
            element={<PrivateRoute element={PrivacyPolicy} />}
          />
          <Route
            path="/terms-and-conditions"
            element={<PrivateRoute element={TermsAndConditions} />}
          />
          <Route
            path="/get-videos"
            element={<PrivateRoute element={GetVideo} />}
          />
          <Route
            path="/add-video"
            element={<PrivateRoute element={AddVideo} />}
          />
          <Route
            path="/update-video"
            element={<PrivateRoute element={UpdateVideo} />}
          />
          <Route
            path="/free-video"
            element={<PrivateRoute element={FreeVideos} />}
          />
          <Route
            path="/add-free-video"
            element={<PrivateRoute element={AddFreeVideo} />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
