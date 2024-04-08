import { NavLink } from "react-router-dom";

function Course() {
  return (
    <div>
      <div>
        <NavLink to="/add-course">Courses</NavLink>
      </div>
      <div>
        <NavLink>Bundle Course</NavLink>
      </div>
    </div>
  );
}

export default Course;
