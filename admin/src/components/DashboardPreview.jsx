import { useState } from "react";
import { Link } from "react-router-dom";
import Course from "./dashboard/Course";
import Test from "./dashboard/Test";
import Question from "./dashboard/Question";
import Setting from "./Setting";
import right from "../assests/arrowright.svg";
import down from "../assests/arrowdown.svg";
// import Category from "./categories/Category";

function DashboardPreview() {
  const [courseOpen, setCourseOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [testOpen, setTestOpen] = useState(false);
  const [questionOpen, setQuestionOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);

  return (
    <div className="top-0 sticky h-full w-[20vw] overflow-y-auto">
      <div className="scrollbar flex flex-col justify-start items-start overflow-auto bg-gray-800 p-6 gap-6 w-full h-screen">
        <Link to="/" className="text-white text-3xl font-semibold">
          Dashboard
        </Link>
        <div className="flex flex-col text-gray-400 gap-4 w-full">
          <div className="flex flex-col gap-4 cursor-pointer">
            <p
              className="flex text-2xl font-medium justify-between items-center"
              onClick={() => setCourseOpen((prev) => !prev)}
            >
              Course{" "}
              <span className="pl-10">
                {courseOpen ? (
                  <img className="h-6 w-6" src={down} alt="-" />
                ) : (
                  <img className="h-6 w-6" src={right} alt="+" />
                )}
              </span>
            </p>

            {courseOpen && <Course />}
          </div>

          <div className="flex flex-col gap-4 cursor-pointer">
            <p
              className="flex text-2xl font-medium justify-between items-center"
              onClick={() => setCategoryOpen((prev) => !prev)}
            >
              Category{" "}
            </p>

            {categoryOpen && <Link to={"/category"}>Category</Link>}
          </div>

          <div className="flex flex-col gap-4 cursor-pointer">
            <p
              className="flex text-2xl font-medium justify-between "
              onClick={() => setTestOpen((prev) => !prev)}
            >
              Test{" "}
              <span className="pl-10">
                {testOpen ? (
                  <img className="h-6 w-6" src={down} alt="-" />
                ) : (
                  <img className="h-6 w-6" src={right} alt="+" />
                )}
              </span>
            </p>
            {testOpen && <Test />}
          </div>

          <div className="flex flex-col gap-4 cursor-pointer">
            <p
              className="flex text-2xl font-medium justify-between "
              onClick={() => setQuestionOpen((prev) => !prev)}
            >
              Question{" "}
              <span className="pl-10">
                {questionOpen ? (
                  <img className="h-6 w-6" src={down} alt="-" />
                ) : (
                  <img className="h-6 w-6" src={right} alt="+" />
                )}
              </span>
            </p>
            {questionOpen && <Question />}
          </div>

          <div className="flex flex-col gap-4 cursor-pointer">
            <p
              className="flex text-2xl font-medium justify-between "
              onClick={() => setSettingOpen((prev) => !prev)}
            >
              Setting{" "}
              <span className="pl-10">
                {settingOpen ? (
                  <img className="h-6 w-6" src={down} alt="-" />
                ) : (
                  <img className="h-6 w-6" src={right} alt="+" />
                )}
              </span>
            </p>
            {settingOpen && <Setting />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPreview;
