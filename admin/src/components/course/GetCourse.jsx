import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse, deleteCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import UpdateCourse from "./UpdateCourse";
import ConfirmDelete from "../../utils/ConfirmDelete";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CalendarClock, IndianRupee } from "lucide-react";
import { LatexParser } from "@/utils/LatexParser";
import getPercentage from "@/utils/getPercentage";
import { useHeading } from "@/hooks/use-heading";
import AddCourse from "./AddCourse";

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
    dispatch(setCourse(response.data.data));
  } catch (error) {
    console.error("Error fetching courses:", error);
    toast.error(error.response?.data?.message || "Error fetching courses");
  } finally {
    setLoading(false);
  }
};

function GetCourse() {
  const navigate = useNavigate();
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">Course</h1>
        <AddCourse />
      </div>
    );
    fetchCourse(dispatch, setLoading);
  }, [dispatch, setHeading]);

  const handleDelete = useCallback(
    async (courseId) => {
      try {
        const response = await axios.delete(
          `${API_URL}/admin/courses/deletecourse.php?courseid=${courseId}`
        );

        if (response.status === 200) {
          dispatch(deleteCourse(courseId));
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

          const updatedCourse = courses.map((course) =>
            course.id === courseId ? { ...course, isactive } : course
          );
          dispatch(setCourse(updatedCourse));
        } catch (error) {
          console.log("Error updating user status:", error);
        }
      }
    },
    [dispatch, courses]
  );

  const renderCourseData = (data) => {
    if (typeof data === "string") {
      return LatexParser(data);
    }
    return data;
  };

  const handleNavigate = (id, directory_id) => {
    navigate(`/course/get-content?id=${directory_id}`, {
      state: { dirId: directory_id, subDir: "1" },
    });

    localStorage.setItem("initialId", directory_id);
    localStorage.setItem("courseId", id);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full sm:w-[90%] flex flex-col justify-center items-center mx-auto">
          {courses.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center w-full gap-4">
              {courses.map(
                (course, idx) =>
                  course && (
                    <div
                      key={idx}
                      className="flex justify-center items-center font-medium w-44 sm:w-56 border rounded-md border-zinc-300 my-4 py-2 px-1"
                    >
                      <div className="flex flex-col justify-center items-start gap-2 w-full">
                        <div className="flex justify-between items-center w-full gap-2">
                          {/* <Avatar className="bg-gray-500 text-white">
                            {idx + 1}
                          </Avatar> */}
                          <div className="flex flex-col justify-center items-center">
                            <p className="text-[10px] font-bold">
                              {course.isactive === "1" ? "Public" : "Private"}
                            </p>
                            <button
                              onClick={() => {
                                handleChangeStatus(course.id, course.isactive);
                              }}
                              className="toggle-switch scale-50 align-middle"
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
                          <div className="flex justify-between items-end gap-2 w-fit">
                            <UpdateCourse id={course.id} />
                            <ConfirmDelete
                              handleClick={() => handleDelete(course.id)}
                            />
                          </div>
                        </div>

                        <div
                          onClick={() =>
                            handleNavigate(course.id, course.directory_id)
                          }
                          className="flex flex-col justify-center items-center gap-2 w-full cursor-pointer"
                        >
                          <div className="flex justify-center items-center w-full">
                            <img
                              src={course.img_url}
                              alt={"image"}
                              className="rounded-lg border-transparent w-full h-48 sm:h-28"
                            />
                          </div>
                          <div className="text-center text-sm w-full whitespace-pre-wrap">
                            {renderCourseData(course.course_name)}
                          </div>
                          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-2">
                            <div className="flex justify-center items-center gap-0.5">
                              <CalendarClock className="scale-[60%]" />
                              <p className="text-xs">
                                {course.course_duration}
                              </p>
                            </div>
                            {/* <div className="flex justify-center items-center gap-0.5">
                              <SquarePlay className="scale-75" />
                              <p>{course.total_number_of_videos}</p>
                            </div> */}
                            <div className="flex justify-center items-center">
                              <IndianRupee className="scale-[60%]" />
                              <p className="text-xs">{course.price}</p>
                              <p className="text-xs text-gray-500 ml-1 line-through">
                                {course.original_price}
                              </p>
                              {course.price && course.original_price && (
                                <p className="text-xs text-green-500 ml-1">
                                  {getPercentage(
                                    course.original_price,
                                    course.price
                                  )}
                                  %
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
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
    </>
  );
}

export default GetCourse;
