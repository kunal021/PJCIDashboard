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
import Dashboard from "./components/Dashboard";
import GetAllUsers from "./components/users/GetAllUsers";
import AboutUs from "./components/setting/AboutUs";
import PrivacyPolicy from "./components/setting/PrivacyPolicy";
import TermsAndConditions from "./components/setting/TermsAndConditions";
import GetVideo from "./components/videos/GetVideo";
import AddVideo from "./components/videos/AddVideo";
// import SideBar from "./components/DashboardPreviewSmall";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Toaster />
        <div className="flex">
          <Dashboard />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/get-course" element={<GetCourse />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/get-full-course" element={<GetFullCourse />} />
            <Route path="/add-full-course" element={<AddFullCourse />} />
            <Route
              path="/get-full-course-subject"
              element={<GetFullCourseSubjects />}
            />
            <Route
              path="/get-course-category-wise"
              element={<GetCourseCategoryWise />}
            />
            <Route path="/category" element={<GetCategory />} />
            <Route path="/update-category" element={<UpdateCategory />} />
            <Route path="/get-test" element={<GetTest />} />
            <Route path="/get-test-question" element={<GetQuestions />} />
            <Route path="/add-test-question" element={<NewAddQns />} />
            <Route path="/add-test" element={<AddTest />} />
            <Route path="/get-users" element={<GetAllUsers />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/terms-and-conditions"
              element={<TermsAndConditions />}
            />
            <Route path="/get-videos" element={<GetVideo />} />
            <Route path="/add-video" element={<AddVideo />} />
          </Routes>
        </div>
      </BrowserRouter>
      M
    </div>
  );
}

export default App;
