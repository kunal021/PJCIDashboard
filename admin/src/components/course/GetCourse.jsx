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
import { Avatar } from "antd";
// import AddVideoInCourse from "./AddVideoInCourse";
// import SeeAll from "../../utils/SeeAll";
import { useNavigate } from "react-router-dom";
import { CalendarClock, IndianRupee, SquarePlay } from "lucide-react";

const fetchCourse = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("course_type", 1);
    const response = await axios.post(
      `${API_URL}/admin/courses/getallcourse.php`,
      formData,
      { headers: { "content-type": "multipart/form-data" } }
    );
    // console.log(response);
    dispatch(setCourse(response.data.data));
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetCourse() {
  const navigate = useNavigate();
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

  const handleChangeStatus = useCallback(
    async (courseId, isactive) => {
      const confirmAlert = window.confirm(
        `${
          isactive === "1"
            ? "course will become Inactive. Do you want to proceed"
            : "course will become Active. Do you want to proceed"
        }`
      );
      if (confirmAlert) {
        try {
          isactive = isactive === "1" ? "0" : "1";
          const formData = new FormData();
          formData.append("course_id", courseId);
          formData.append("statuscode", isactive);
          formData.append("course_type", 1);
          await axios.post(
            `${API_URL}/admin/courses/updatecoursestatus.php`,
            formData,
            { headers: { "content-type": "multipart/form-data" } }
          );

          // Update local state instead of fetching users again
          const updatedCourse = courses.map((course) =>
            course.id === courseId ? { ...course, isactive } : course
          );
          dispatch(setCourse(updatedCourse));
        } catch (error) {
          console.log("Error updating user status:", error);
          // Handle error (e.g., show an error message)
        }
      }
    },
    [dispatch, courses]
  );

  const renderCourseData = (data) => {
    if (typeof data === "string") {
      return parser(data);
    }
    return data;
  };

  // console.log(courses);

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${
            updateCourse
              ? "hidden"
              : "w-[80%] flex flex-col justify-center items-center mx-auto"
          }`}
        >
          <div className="flex justify-center items-center space-x-10 my-5">
            <h1 className="text-3xl font-bold text-center">Course List</h1>
            <LinkButton to="/add-course">Add Course</LinkButton>
          </div>
          {courses.length > 0 ? (
            <div className="flex flex-col justify-center items-center w-full">
              {courses.map(
                (course, idx) =>
                  course && (
                    <div
                      key={idx}
                      className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-2 gap-4"
                    >
                      <div className="flex flex-col justify-center items-start gap-2 w-full">
                        <div className="flex justify-between items-center w-full gap-4">
                          <Avatar className="bg-gray-500 text-white">
                            {course.id}
                          </Avatar>
                          <button
                            onClick={() => {
                              handleChangeStatus(course.id, course.isactive);
                            }}
                            className="toggle-switch scale-75 align-middle"
                          >
                            <input
                              type="checkbox"
                              checked={course.isactive === "1"}
                              readOnly
                            />
                            <div className="toggle-switch-background">
                              <div className="toggle-switch-handle"></div>
                            </div>
                          </button>
                        </div>
                        {/* <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" /> */}
                        <div className="flex justify-center items-center gap-6 w-full">
                          <div className="flex justify-center items-center">
                            <img
                              src={course.img_url}
                              alt={renderCourseData(course.course_name)}
                              className="rounded-lg border-transparent w-36 h-24"
                            />
                          </div>
                          <div
                            onClick={() =>
                              navigate(`/get-course-videos?id=${course.id}`)
                            }
                            className="flex flex-col justify-center items-start gap-3 w-full cursor-pointer"
                          >
                            <div className="text-start w-full">
                              {renderCourseData(course.course_name)}
                            </div>
                            <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                            <div className="flex justify-between items-center w-full gap-2">
                              <div className="flex justify-center items-center gap-0.5">
                                <CalendarClock className="scale-75" />
                                <p>{course.course_duration}</p>
                              </div>
                              <div className="flex justify-center items-center gap-0.5">
                                <SquarePlay className="scale-75" />
                                <p>{course.total_number_of_videos}</p>
                              </div>
                              <div className="flex justify-center items-center gap-0.5">
                                <IndianRupee className="scale-75" />
                                <p>{course.price}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end gap-10 w-fit">
                        {/* <AddVideoInCourse courseId={course.id} />
                        <SeeAll
                          handleClick={() =>
                            navigate(`/get-course-videos?id=${course.id}`)
                          }
                          childern={"See All Videos"}
                        /> */}
                        <UpdateBtn
                          handleClick={() => {
                            setUpdateCourse(true);
                            setUpdateCourseData(course.id);
                          }}
                        />
                        <ConfirmDelete
                          handleClick={() => handleDelete(course.id)}
                        />
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className="text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
      {updateCourse && (
        <UpdateCourse
          setUpdateCourse={setUpdateCourse}
          updateCourseData={updateCourseData}
        />
      )}
    </LayoutAdjuster>
  );
}

export default GetCourse;
