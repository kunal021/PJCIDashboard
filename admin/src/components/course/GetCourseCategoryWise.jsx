import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../redux/courses/courseSlice";
// import { setCategory } from "../../redux/categories/categorySlice";
import axios from "axios";

import { useSearchParams } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const GetCourseCategoryWise = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);

  // const location = useLocation();
  // const id = new URLSearchParams(location.search).get("id");

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  // console.log(id);

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

        console.log(response.data);
        dispatch(setCourse(response.data.data_course));

        // console.log(response);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [dispatch, id, searchParams]);

  return (
    <div className="container w-[80%]">
      <h1 className="text-3xl font-bold text-center my-10">Course List</h1>
      <table className="table-auto w-[70vw] m-10 border-2">
        <thead>
          <tr>
            <th className="px-2 py-2">Id</th>
            <th className="px-2 py-2">Image</th>
            <th className="px-2 py-2">Course Name</th>
            <th className="px-2 py-2">Description</th>
            <th className="px-2 py-2">Price</th>
            <th className="px-2 py-2">Duration</th>
            <th className="px-2 py-2">Total Videos</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="border px-4 py-2">{course.id}</td>
              <td className="border px-2 py-2">
                <img
                  src={course.img_url}
                  alt={course.course_name}
                  height={150}
                  width={150}
                  className="rounded-lg border-transparent"
                />
              </td>
              <td className="border px-2 py-2">{course.course_name}</td>
              <td className="border px-2 py-2">{course.course_description}</td>
              <td className="border px-2 py-2">{course.price}</td>
              <td className="border px-2 py-2">{course.course_duration}</td>
              <td className="border px-2 py-2">
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
