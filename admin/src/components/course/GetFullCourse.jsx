import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFullCourse } from "../../redux/courses/fullCourseSlice";
import { deleteFullCourse } from "../../redux/courses/fullCourseSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";
import UpdateFullCourse from "./UpdateFullCourse";
import { API_URL } from "../../url";
import toast from "react-hot-toast";
import Loader from "../../utils/Loader";
import ConfirmDelete from "../../utils/ConfirmDelete";
import UpdateBtn from "../../utils/UpdateBtn";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import parser from "html-react-parser";

const fetchFullCourse = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${API_URL}/admin/courses/getallcourse.php`
    );
    console.log(response);
    dispatch(setFullCourse(response.data.data_fullcourse));
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetFullCourse() {
  const [loading, setLoading] = useState(false);
  const [updateCourse, setUpdateCourse] = useState(false);
  const [updateCourseData, setUpdateCourseData] = useState({});

  const dispatch = useDispatch();
  const fullCourse = useSelector((state) => state.fullCourse.fullCourse);

  useEffect(() => {
    setLoading(true);
    fetchFullCourse(dispatch, setLoading);
  }, [dispatch]);

  const handleDelete = async (courseId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/courses/deletefullcourse.php?fullcourseid=${courseId}`
      );

      console.log(response);
      if (courseId && response.data.success) {
        dispatch(deleteFullCourse(response.data));
      }
      if (response.status == 204) {
        toast.success("Full Course Deleted Successfully");
      }
      fetchFullCourse(dispatch);
    } catch (error) {
      toast.error(error.response.data.massage);
    }
  };

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
          } `}
        >
          <div className="flex justify-center items-center space-x-10">
            <h1 className="text-3xl font-bold text-center my-5">
              Full Course List
            </h1>
            <LinkButton to={"/add-full-course"}>Add Full Course</LinkButton>
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
                <th className="p-2 text-sm">See All Subject</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {fullCourse.map((course) => (
                <tr key={course.id} className="bg-gray-50">
                  <td className="border p-2 text-sm">{course.id}</td>
                  <td className="border p-2 text-sm">
                    <img
                      src={course.img_url}
                      alt={parser(course.full_course_name)}
                      height={150}
                      width={150}
                      className="rounded-lg border-transparent"
                    />
                  </td>
                  <td className="border p-2 text-sm">
                    {parser(course.full_course_name)}
                  </td>
                  <td className="border p-2 text-sm">
                    {parser(course.full_course_description)}
                  </td>
                  <td className="border p-2 text-sm">
                    {course.full_course_price}
                  </td>
                  <td className="border p-2 text-sm">
                    {course.full_course_duration}
                  </td>
                  <td className="border p-2 text-sm">
                    {course.total_number_of_videos}
                  </td>
                  <td className="border p-2 text-sm">
                    <UpdateBtn
                      handleClick={() => {
                        setUpdateCourse((prev) => !prev);
                        setUpdateCourseData(course);
                      }}
                    />
                  </td>
                  <td className="border p-2 text-sm">
                    <ConfirmDelete
                      handleClick={() => handleDelete(course.id)}
                    />
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
      )}
      {updateCourse && (
        <UpdateFullCourse
          fetchFullCourse={() => fetchFullCourse(dispatch, setLoading)}
          setUpdateCourse={setUpdateCourse}
          updateCourseData={updateCourseData}
        />
      )}
    </LayoutAdjuster>
  );
}

export default GetFullCourse;
