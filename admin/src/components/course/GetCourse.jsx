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
import { truncateData } from "../../utils/truncateData";
import { Avatar } from "antd";

const fetchCourse = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${API_URL}/admin/courses/getallcourse.php`
    );
    console.log(response);
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
  const [readMore, setReadMore] = useState({});

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

  const handleReadMoreToggle = (courseId) => {
    setReadMore((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const isLongDescription = (description) => {
    return parser(description).split(" ").length > 50;
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
          }`}
        >
          <div className="flex justify-center items-center space-x-10 my-5">
            <h1 className="text-3xl font-bold text-center">Course List</h1>
            <LinkButton to="/add-course">Add Course</LinkButton>
          </div>
          {courses ? (
            <div className="flex flex-col justify-center items-center w-full">
              {courses.map(
                (course, idx) =>
                  course && (
                    <div
                      key={idx}
                      className="flex  justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                    >
                      <div className="flex flex-col justify-center items-start gap-4 w-full">
                        <div className="flex justify-between items-center w-full gap-4">
                          <div>
                            <Avatar className="bg-gray-500 text-white">
                              {course.id}
                            </Avatar>
                          </div>
                          <div>Duration: {course.course_duration}</div>
                          <div>Videos: {course.total_number_of_videos}</div>
                          <div>Price: {course.price}</div>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div>
                          <div className="flex flex-wrap text-wrap justify-center items-center gap-10">
                            <img
                              src={course.img_url}
                              alt={parser(course.course_name)}
                              height={150}
                              width={150}
                              className="rounded-lg border-transparent"
                            />
                            {parser(course.course_name)}
                          </div>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div className="flex flex-row-reverse flex-wrap text-wrap justify-end items-start gap-4 w-full">
                          {/* {isLongDescription ? (
                            <div>
                              {readMore[course.id]
                                ? parser(course.course_description)
                                : truncateData(
                                    parser(course.course_description),
                                    50
                                  )}
                              <span
                                className="text-blue-500 cursor-pointer px-1"
                                onClick={() => handleReadMoreToggle(course.id)}
                              >
                                {readMore[course.id]
                                  ? "Read Less"
                                  : "Read More"}
                              </span>
                            </div>
                          ) : ( */}
                          {parser(course.course_description)}
                          {/* )} */}
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end gap-10 w-fit">
                        <UpdateBtn
                          handleClick={() => {
                            setUpdateCourse(true);
                            setUpdateCourseData(course);
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
          fetchCourse={() => fetchCourse(dispatch, setLoading)}
          setUpdateCourse={setUpdateCourse}
          updateCourseData={updateCourseData}
        />
      )}
    </LayoutAdjuster>
  );
}

export default GetCourse;
