import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  AboutUs,
  AddCourse,
  AddFreeVideo,
  AddFullCourse,
  AddTest,
  AddTestSeries,
  AddVideo,
  BookOrders,
  CreateNotification,
  FreeVideos,
  GetAllUsers,
  GetBooks,
  GetCategory,
  GetCourse,
  GetCourseCategoryWise,
  GetDemoBooks,
  GetDocuments,
  GetFreeMaterial,
  GetFullCourse,
  GetFullCourseSubjects,
  GetImage,
  GetNews,
  GetNewsContent,
  GetNotes,
  GetPayments,
  GetQuestions,
  GetTest,
  GetTestData,
  GetTestSeries,
  GetVideo,
  // GetVideoInCourse,
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
import Get from "./components/slider/Get";
import MakeUserPurchase from "./components/setting/MakeUserPurchase";
import CourseTab from "./components/course/CourseTab";
import Demo from "./components/chat/Demo";

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
            path="/get-course-content"
            element={<PrivateRoute element={CourseTab} />}
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
            path="/get-testseries"
            element={<PrivateRoute element={GetTestSeries} />}
          />
          <Route
            path="/get-testseries-tests"
            element={<PrivateRoute element={GetTestData} />}
          />
          <Route
            path="/add-testseries"
            element={<PrivateRoute element={AddTestSeries} />}
          />
          <Route
            path="/get-materials"
            element={<PrivateRoute element={GetDocuments} />}
          />
          <Route
            path="/get-free-materials"
            element={<PrivateRoute element={GetFreeMaterial} />}
          />
          <Route
            path="/get-notes"
            element={<PrivateRoute element={GetNotes} />}
          />
          <Route
            path="/get-books"
            element={<PrivateRoute element={GetBooks} />}
          />
          <Route
            path="/get-demo-books"
            element={<PrivateRoute element={GetDemoBooks} />}
          />
          <Route
            path="/get-orders"
            element={<PrivateRoute element={BookOrders} />}
          />
          <Route
            path="/get-images"
            element={<PrivateRoute element={GetImage} />}
          />
          <Route
            path="/get-news"
            element={<PrivateRoute element={GetNews} />}
          />
          <Route
            path="/get-news-content"
            element={<PrivateRoute element={GetNewsContent} />}
          />
          <Route
            path="/get-users"
            element={<PrivateRoute element={GetAllUsers} />}
          />
          <Route
            path="/get-payments"
            element={<PrivateRoute element={GetPayments} />}
          />
          <Route
            path="/notification"
            element={<PrivateRoute element={CreateNotification} />}
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
          <Route path="/get-slider" element={<PrivateRoute element={Get} />} />
          <Route
            path="/user-purchase"
            element={<PrivateRoute element={MakeUserPurchase} />}
          />
          <Route path="/demo" element={<PrivateRoute element={Demo} />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
