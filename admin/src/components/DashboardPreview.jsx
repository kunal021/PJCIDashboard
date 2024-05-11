import { useState } from "react";
import { Link } from "react-router-dom";
import Course from "./dashboard/Course";
import Test from "./dashboard/Test";
import User from "./dashboard/User";
import Setting from "./Setting";
import right from "../assests/arrowright.svg";
import down from "../assests/arrowdown.svg";

function DashboardPreview() {
  const [isOpen, setIsOpen] = useState({
    course: false,
    test: false,
    user: false,
    setting: false,
  });

  const [navOpen, setNavOpen] = useState(true);


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
    <div className="top-0 fixed lg:sticky z-[100]">
      <div
        onClick={() => setNavOpen((prev) => !prev)}
        className="flex cursor-pointer fixed top-1 right-5 z-[100]">
        {
          navOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="40"
              height="40"
              viewBox="0 0 50 50"
            >
              <path
                fill="#000000"
                d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"
              ></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="40"
              height="40"
              viewBox="0 0 24 24"
            >
              <path
                fill="#000000"
                d="M 2 5 L 2 7 L 22 7 L 22 5 L 2 5 z M 2 11 L 2 13 L 22 13 L 22 11 L 2 11 z M 2 17 L 2 19 L 22 19 L 22 17 L 2 17 z"
              ></path>
            </svg>
          )
        }
      </div >
      <div className={`${navOpen ? "block" : "hidden"} top-0 sticky h-full w-[30vw] lg:w-[15vw]`}>
        <div className="scrollbar flex flex-col justify-start items-start overflow-auto bg-gray-800 p-6 gap-6 w-full h-screen">
          <img
            src={"/logo.jpg"}
            alt="logo"
            className="text-white text-xl font-semibold h-14 w-14 rounded-md">
          </img>
          <div className="flex flex-col text-gray-200 gap-4 w-full">
            <div className="flex flex-col gap-4 cursor-pointer">
              <p className="flex text-lg font-medium justify-between items-center">
                <Link to={"/"}>Dashboard</Link>
              </p>
            </div>
            <div className="flex flex-col gap-4 cursor-pointer">
              <p className="flex text-lg font-medium justify-between items-center">
                <Link to={"/category"}>Category</Link>
              </p>
            </div>
            {["course", "test", "user", "setting"].map((section) => (
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
                    user: User,
                    setting: Setting,
                  }[section]
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
}

export default DashboardPreview;
