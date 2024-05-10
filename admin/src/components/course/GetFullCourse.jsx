import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFullCourse } from "../../redux/courses/fullCourseSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";

const GetFullCourse = () => {
  const dispatch = useDispatch();
  const fullCourse = useSelector((state) => state.fullCourse.fullCourse);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.post(
          "http://localhost/PJCIDB/courses/getallcourse.php"
        );
        dispatch(setFullCourse(response.data.data_fullcourse));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, [dispatch]);

  return (
    <div className="w-fit flex flex-col justify-center items-center mx-auto">
      <div className="flex justify-center items-center space-x-10">
        <h1 className="text-3xl font-bold text-center my-5">Full Course List</h1>
        <LinkButton to={"/add-full-course"}>Add Full Course</LinkButton>
      </div>
      <table className="table-auto w-full m-5 border-2">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-sm">Id</th>
            <th className="p-2 text-sm">Image</th>
            <th className="p-2 text-sm">Course Name</th>
            <th className="p-2 text-sm">Description</th>
            <th className="p-2 text-sm">Price</th>
            <th className="p-2 text-sm">Duration</th>
            <th className="p-2 text-sm">Total Videos</th>
            <th className="p-2 text-sm">See All Subject</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {fullCourse.map((course) => (
            <tr key={course.id} className="bg-gray-100">
              <td className="border p-2 text-sm">{course.id}</td>
              <td className="border p-2 text-sm">
                <img
                  src={course.img_url}
                  alt={course.course_name}
                  height={150}
                  width={150}
                  className="rounded-lg border-transparent"
                />
              </td>
              <td className="border p-2 text-sm">{course.course_name}</td>
              <td className="border p-2 text-sm">
                {course.course_description}
              </td>
              <td className="border p-2 text-sm">{course.price}</td>
              <td className="border p-2 text-sm">{course.course_duration}</td>
              <td className="border p-2 text-sm">
                {course.total_number_of_videos}
              </td>
              <td className="border p-2 text-sm">
                <Link to={`/get-full-course-subject?id=${course.id}`}>
                  <button className="bg-green-500 hover:bg-green-700 text-white font-bold p-1 text-xs rounded">
                    See All Subject
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetFullCourse;
