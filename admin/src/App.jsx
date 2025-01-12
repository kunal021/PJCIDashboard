import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import {
  AboutUs,
  AddFullCourse,
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
  Home,
  Layout,
  Login,
  PrivacyPolicy,
  PrivateRoute,
  TermsAndConditions,
  UserInfo,
} from "./app.import";
import Get from "./components/slider/Get";
import MakeUserPurchase from "./components/setting/MakeUserPurchase";
import CourseTab from "./components/course/CourseTab";
import Demo from "./components/chat/Demo";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Layout />
          <Toaster />
        </>
      ),
      children: [
        { path: "/login", element: <Login /> },
        { path: "/", element: <PrivateRoute element={Home} /> },

        // Courses
        { path: "/course", element: <PrivateRoute element={GetCourse} /> },

        {
          path: "/course/get-content",
          element: <PrivateRoute element={CourseTab} />,
        },
        {
          path: "/course/get-full-course",
          element: <PrivateRoute element={GetFullCourse} />,
        },
        {
          path: "/course/add-full-course",
          element: <PrivateRoute element={AddFullCourse} />,
        },
        {
          path: "/course/get-full-course-subjects",
          element: <PrivateRoute element={GetFullCourseSubjects} />,
        },
        {
          path: "/course/get-category-wise",
          element: <PrivateRoute element={GetCourseCategoryWise} />,
        },
        { path: "/category", element: <PrivateRoute element={GetCategory} /> },

        // Tests
        { path: "/test", element: <PrivateRoute element={GetTest} /> },
        {
          path: "/test/question",
          element: <PrivateRoute element={GetQuestions} />,
        },
        {
          path: "/testseries",
          element: <PrivateRoute element={GetTestSeries} />,
        },
        {
          path: "/testseries/tests",
          element: <PrivateRoute element={GetTestData} />,
        },

        // Materials
        {
          path: "/doc/materials",
          element: <PrivateRoute element={GetDocuments} />,
        },
        {
          path: "/doc/free-materials",
          element: <PrivateRoute element={GetFreeMaterial} />,
        },
        { path: "/doc/notes", element: <PrivateRoute element={GetNotes} /> },

        // Books
        { path: "/books", element: <PrivateRoute element={GetBooks} /> },
        {
          path: "/books/demo",
          element: <PrivateRoute element={GetDemoBooks} />,
        },
        {
          path: "/books/orders",
          element: <PrivateRoute element={BookOrders} />,
        },

        // Videos
        { path: "/videos", element: <PrivateRoute element={GetVideo} /> },

        {
          path: "/videos/free",
          element: <PrivateRoute element={FreeVideos} />,
        },

        // News
        { path: "/news", element: <PrivateRoute element={GetNews} /> },
        {
          path: "/news/content",
          element: <PrivateRoute element={GetNewsContent} />,
        },

        // Users
        { path: "/users", element: <PrivateRoute element={GetAllUsers} /> },
        {
          path: "/users/:id",
          element: <PrivateRoute element={UserInfo} />,
        },

        // Payments
        {
          path: "/payments",
          element: <PrivateRoute element={GetPayments} />,
        },

        // Settings
        { path: "/setting/slider", element: <PrivateRoute element={Get} /> },
        {
          path: "/setting/images",
          element: <PrivateRoute element={GetImage} />,
        },
        {
          path: "/setting/notification",
          element: <PrivateRoute element={CreateNotification} />,
        },
        {
          path: "/setting/about-us",
          element: <PrivateRoute element={AboutUs} />,
        },
        {
          path: "/setting/privacy-policy",
          element: <PrivateRoute element={PrivacyPolicy} />,
        },
        {
          path: "/setting/terms-and-conditions",
          element: <PrivateRoute element={TermsAndConditions} />,
        },
        {
          path: "/setting/user-purchase",
          element: <PrivateRoute element={MakeUserPurchase} />,
        },
        { path: "/demo", element: <PrivateRoute element={Demo} /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
