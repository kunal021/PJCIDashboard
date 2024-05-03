import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFullCourse } from "../../redux/courses/fullCourseSlice";
import axios from "axios";

function CourseCategoryWise() {
  const dispatch = useDispatch();
  const fullCourse = useSelector((state) => state.fullCourse.fullCourse);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.post(
          "http://localhost/PJCIDB/courses/getcoursecategorywise.php"
        );

        console.log(response.data.data);
        dispatch(setFullCourse(response.data.data));

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
        {fullCourse.map((course) => (
          <li key={course.id}>
            <h2>{course.id}</h2>
            {/* <h2>{course.course_name}</h2>
            <h2>{course.course_description}</h2>
            <h2>{course.price}</h2>
            <h2>{course.course_duration}</h2>
            <h2>{course.total_number_of_videos}</h2>
            <img src={course.img_url} alt="image" height={300} width={300} /> */}
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

export default CourseCategoryWise;
