import { useState } from "react";
import { Link } from "react-router-dom";
import Course from "./dashboard/Course";
import Test from "./dashboard/Test";
import Question from "./dashboard/Question";
import Setting from "./Setting";
import right from "../assests/arrowright.svg";
import down from "../assests/arrowdown.svg";

function DashboardPreview() {
  const [isOpen, setIsOpen] = useState({
    course: false,
    test: false,
    question: false,
    setting: false,
  });

  const toggleOpen = (section) => {
    setIsOpen((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const renderSection = (section, Component) => {
    return (
      isOpen[section] && (
        <div className="bg-white/20 rounded-md px-2 py-1 w-[80%]">
          <Component />
        </div>
      )
    );
  };

  return (
    <div className="top-0 sticky h-full w-[15vw] overflow-y-auto">
      <div className="scrollbar flex flex-col justify-start items-start overflow-auto bg-gray-800 p-6 gap-6 w-full h-screen">
        <Link to="/" className="text-white text-xl font-semibold">
          Dashboard
        </Link>
        <div className="flex flex-col text-gray-200 gap-4 w-full">
          <div className="flex flex-col gap-4 cursor-pointer">
            <p className="flex text-lg font-medium justify-between items-center">
              <Link to={"/category"}>Category</Link>
            </p>
          </div>
          {["course", "test", "setting"].map((section) => (
            <div
              key={section}
              className="flex flex-col space-y-1 cursor-pointer"
            >
              <p
                className="flex text-lg font-medium justify-between items-center"
                onClick={() => toggleOpen(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}{" "}
                <span className="pl-10">
                  {isOpen[section] ? (
                    <img className="h-6 w-6" src={down} alt="-" />
                  ) : (
                    <img className="h-6 w-6" src={right} alt="+" />
                  )}
                </span>
              </p>
              {renderSection(
                section,
                {
                  course: Course,
                  test: Test,
                  question: Question,
                  setting: Setting,
                }[section]
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPreview;
