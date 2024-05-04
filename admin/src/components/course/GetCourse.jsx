import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../redux/courses/courseSlice";
import axios from "axios";

const GetCourse = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.post(
          "http://localhost/PJCIDB/admin/courses/getallcourse.php"
        );

        console.log(response.data);
        dispatch(setCourse(response.data.data_course));

        // console.log(response);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, [dispatch]);

  return (
    <div className="container w-[80%]">
      <h1 className="text-3xl font-bold text-center my-10">Course List</h1>
      <table className="table-auto w-[70vw] m-10 border-2">
        <thead>
          <tr>
            <th className="p-2 text-sm">Id</th>
            <th className="p-2 text-sm">Image</th>
            <th className="p-2 text-sm">Course Name</th>
            <th className="p-2 text-sm">Description</th>
            <th className="p-2 text-sm">Price</th>
            <th className="p-2 text-sm">Duration</th>
            <th className="p-2 text-sm">Total Videos</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {courses.map((course) => (
            <tr key={course.id}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetCourse;
