import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPreview from "./components/DashboardPreview";
import Preview from "./components/Preview";
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
// import AddQns from "./components/tests/AddQns";
// import QuestionForm from "./components/tests/QnsForm";
import NewAddQns from "./components/tests/NewAddQns";

function App() {
  return (
    <div>
      <BrowserRouter>
        <div className="flex">
          <DashboardPreview />
          <Routes>
            <Route path="/" element={<Preview />} />
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
            <Route path="/get-test" element={<GetTest />} />
            <Route path="/get-test-question" element={<GetQuestions />} />
            <Route path="/add-test-question" element={<NewAddQns />} />
            <Route path="/add-test" element={<AddTest />} />
            {/* <Route path="/demo" element={<QuestionForm />} /> */}
            {/* <Route path="/demo1" element={<NewAddQns />} /> */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
