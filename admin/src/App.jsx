import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import GetCategory from "./components/categories/GetCategory";
import GetCourse from "./components/course/GetCourse";
import GetFullCourse from "./components/course/GetFullCourse";
import GetFullCourseSubjects from "./components/course/GetFullCourseSubjects";
import GetCourseCategoryWise from "./components/course/GetCourseCategoryWise";
import GetTest from "./components/tests/GetTests";
import GetQuestions from "./components/tests/GetQuestions";
import AddTest from "./components/tests/AddTest";
import AddCourse from "./components/course/AddCourse";
import AddFullCourse from "./components/course/AddFullCourse";
import NewAddQns from "./components/tests/NewAddQns";
import UpdateCategory from "./components/categories/UpdateCategory";
import Home from "./components/home/Home";
import GetAllUsers from "./components/users/GetAllUsers";
import AboutUs from "./components/setting/AboutUs";
import PrivacyPolicy from "./components/setting/PrivacyPolicy";
import TermsAndConditions from "./components/setting/TermsAndConditions";
import GetVideo from "./components/videos/GetVideo";
import AddVideo from "./components/videos/AddVideo";
import UpdateVideo from "./components/videos/UpdateVideo";
import GetVideoInCourse from "./components/course/GetVideoInCourse";
import Login from "./components/home/Login";
import PrivateRoute from "./components/home/PrivateRoute";
import Layout from "./components/home/Layout";

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
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
