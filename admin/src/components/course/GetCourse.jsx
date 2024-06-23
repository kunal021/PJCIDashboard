import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse, deleteCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import LinkButton from "../../utils/LinkButton";
import UpdateCourse from "./UpdateCourse";
import ConfirmDelete from "../../utils/ConfirmDelete";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import toast from "react-hot-toast";
import UpdateBtn from "../../utils/UpdateBtn";
import parser from "html-react-parser";
import LayoutAdjuster from "../../utils/LayoutAdjuster";

const fetchCourse = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${API_URL}/admin/courses/getallcourse.php`
    );
    dispatch(setCourse(response.data.data_course));
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetCourse() {
  const [loading, setLoading] = useState(false);
  const [updateCourse, setUpdateCourse] = useState(false);
  const [updateCourseData, setUpdateCourseData] = useState({});

  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);

  useEffect(() => {
    fetchCourse(dispatch, setLoading);
  }, [dispatch]);

  const handleDelete = useCallback(
    async (courseId) => {
      try {
        const response = await axios.delete(
          `${API_URL}/admin/courses/deletecourse.php?courseid=${courseId}`
        );
        if (response.data.success) {
          dispatch(deleteCourse({ courseId }));
          toast.success("Course Deleted Successfully");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error deleting course");
      }
    },
    [dispatch]
  );

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${
            updateCourse
              ? "hidden"
              : "w-fit flex flex-col justify-center items-center mx-auto"
          }`}
        >
          <div className="flex justify-center items-center space-x-10 my-5">
            <h1 className="text-3xl font-bold text-center">Course List</h1>
            <LinkButton to="/add-course">Add Course</LinkButton>
          </div>
          <table className="table-auto w-full m-5 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-sm">Id</th>
                <th className="p-2 text-sm">Image</th>
                <th className="p-2 text-sm">Course Name</th>
                <th className="p-2 text-sm">Description</th>
                <th className="p-2 text-sm">Price</th>
                <th className="p-2 text-sm">Duration</th>
                <th className="p-2 text-sm">Total Videos</th>
                <th className="p-2 text-sm">Update</th>
                <th className="p-2 text-sm">Delete</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {courses.map((course) => (
                <tr key={course.id} className="bg-gray-50">
                  <td className="border p-2 text-sm">{course.id}</td>
                  <td className="border p-2 text-sm">
                    <img
                      src={course.img_url}
                      alt={parser(course.course_name)}
                      height={150}
                      width={150}
                      className="rounded-lg border-transparent"
                    />
                  </td>
                  <td className="border p-2 text-sm">
                    {parser(course.course_name)}
                  </td>
                  <td className="border p-2 text-sm">
                    {parser(course.course_description)}
                  </td>
                  <td className="border p-2 text-sm">{course.price}</td>
                  <td className="border p-2 text-sm">
                    {course.course_duration}
                  </td>
                  <td className="border p-2 text-sm">
                    {course.total_number_of_videos}
                  </td>
                  <td className="border p-2 text-sm">
                    <UpdateBtn
                      handleClick={() => {
                        setUpdateCourse(true);
                        setUpdateCourseData(course);
                      }}
                    />
                  </td>
                  <td className="border p-2 text-sm">
                    <ConfirmDelete
                      handleClick={() => handleDelete(course.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {updateCourse && (
        <UpdateCourse
          fetchCourse={() => fetchCourse(dispatch, setLoading)}
          setUpdateCourse={setUpdateCourse}
          updateCourseData={updateCourseData}
        />
      )}
    </LayoutAdjuster>
  );
}

export default GetCourse;
