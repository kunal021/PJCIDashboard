import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../redux/courses/courseSlice";
import axios from "axios";

function AddCourse() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          "http://localhost/PJCIDB/category/get.php"
        );

        console.log(response.data.data);
        dispatch(setCourse(response.data.data));

        console.log(response);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, [dispatch]);
  return (
    <div>
      <h1>Course List</h1>
      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h2>{course.id}</h2>
            <h2>{course.name}</h2>
            {/* <p>{course.description}</p> */}
            {/* <img src={course.thumbnail} alt={course.name} /> */}
            {/* <button onClick={() => handleDeleteCourse(course._id)}>
              Delete
            </button> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddCourse;
