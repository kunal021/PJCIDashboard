import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../redux/courses/courseSlice";
import axios from "axios";

import { useSearchParams } from "react-router-dom";
const GetCourseCategoryWise = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    console.log(id);
    const fetchCourse = async () => {
      try {
        const formData = new FormData();
        formData.append("id", id);
        const response = await axios.post(
          "http://localhost/PJCIDB/admin/courses/getcoursecategorywise.php",
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );
        dispatch(setCourse(response.data.data_course));
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [dispatch, id, searchParams]);

  return (
    <div className="w-fit flex flex-col justify-center items-center mx-auto">
      <h1 className="text-3xl font-bold text-center my-5">Course List</h1>
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
          </tr>
        </thead>
        <tbody className="text-center">
          {courses.map((course) => (
            <tr key={course.id} className="bg-gray-100">
              <td className="border px-4 py-2">{course.id}</td>
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

export default GetCourseCategoryWise;
