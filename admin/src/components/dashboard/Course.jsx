import { NavLink } from "react-router-dom";

function Course() {
  return (
    <div>
      <div>
        <NavLink to="/get-course">Courses</NavLink>
      </div>
      <div>
        <NavLink to="/get-full-course">Full Course</NavLink>
      </div>
      {/* <div>
        <NavLink to="/get-full-course-subject">Full Course Subject</NavLink>
      </div> */}
    </div>
  );
}

export default Course;
