import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";

const GetFullCourseSubjects = () => {

  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  console.log(id);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true)
      try {
        const forData = new FormData();
        forData.append("id", id);
        const response = await axios.post(
          `${API_URL}/admin/courses/getfullcoursesubjects.php`,
          forData,
          { headers: { "content-type": "multipart/form-data" } }
        );
        dispatch(setCourse(response.data.data));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false)
      }
    };

    fetchCourse();
  }, [dispatch, id]);

  return (
    <div className="w-fit flex flex-col justify-center items-center mx-auto">
      {loading ? (<Loader />) : (<><h1 className="text-3xl font-bold text-center my-5">Course List</h1>
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
        </table></>)}
    </div>
  );
};

export default GetFullCourseSubjects;
