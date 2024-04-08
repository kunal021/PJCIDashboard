import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
import AddCourse from "./components/course/AddCourse";
import DashboardPreview from "./components/DashboardPreview";
import Preview from "./components/Preview";
// import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <BrowserRouter>
        <div className="flex">
          <DashboardPreview />
          <Routes>
            <Route path="/" element={<Preview />} />
            <Route path="/add-course" element={<AddCourse />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
