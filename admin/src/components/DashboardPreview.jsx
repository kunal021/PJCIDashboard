import { useState } from "react";
import { Link } from "react-router-dom";
import Course from "./dashboard/Course";
import Test from "./dashboard/Test";
import Question from "./dashboard/Question";
import Setting from "./Setting";
import right from "../assests/arrowright.svg";
import down from "../assests/arrowdown.svg";

function DashboardPreview() {
  const [aboutOpen, setAboutOpen] = useState(false);
  const [skillOpen, setSkillOpen] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);

  return (
    <div className="scrollbar flex flex-col justify-start items-start overflow-auto bg-gray-800 p-6 gap-6 w-[20%] h-screen">
      <Link to="/" className="text-white text-3xl font-semibold">
        Dashboard
      </Link>
      <div className="flex flex-col text-gray-400 gap-4 w-full">
        <div className="flex flex-col gap-4 cursor-pointer">
          <p
            className="flex text-2xl font-medium justify-between items-center"
            onClick={() => setAboutOpen((prev) => !prev)}
          >
            Course{" "}
            <span className="pl-10">
              {aboutOpen ? (
                <img className="h-6 w-6" src={down} alt="-" />
              ) : (
                <img className="h-6 w-6" src={right} alt="+" />
              )}
            </span>
          </p>

          {aboutOpen && <Course />}
        </div>

        <div className="flex flex-col gap-4 cursor-pointer">
          <p
            className="flex text-2xl font-medium justify-between "
            onClick={() => setSkillOpen((prev) => !prev)}
          >
            Test{" "}
            <span className="pl-10">
              {skillOpen ? (
                <img className="h-6 w-6" src={down} alt="-" />
              ) : (
                <img className="h-6 w-6" src={right} alt="+" />
              )}
            </span>
          </p>
          {skillOpen && <Test />}
        </div>

        <div className="flex flex-col gap-4 cursor-pointer">
          <p
            className="flex text-2xl font-medium justify-between "
            onClick={() => setEducationOpen((prev) => !prev)}
          >
            Question{" "}
            <span className="pl-10">
              {educationOpen ? (
                <img className="h-6 w-6" src={down} alt="-" />
              ) : (
                <img className="h-6 w-6" src={right} alt="+" />
              )}
            </span>
          </p>
          {educationOpen && <Question />}
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
  );
}

export default DashboardPreview;
