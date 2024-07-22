import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCourse, setCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import parser from "html-react-parser";
import { Avatar } from "antd";
import { CalendarClock, IndianRupee, SquarePlay } from "lucide-react";
import GetFullCourseById from "./GetFullCourseById";
import ConfirmDelete from "../../utils/ConfirmDelete";
import toast from "react-hot-toast";

const GetFullCourseSubjects = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [show, setShow] = useState(false);

  const handleOpenAndFetchData = async () => {
    setLoading(true);
    try {
      const forData = new FormData();
      forData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/courses/getfullcoursesubjects.php`,
        forData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      console.log(response);
      dispatch(setCourse(response.data.data));
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
      setShow(true);
    }
  };

  // useEffect(() => {
  //   fetchCourse();
  // }, [dispatch,  id]);

  const handleDelete = async (courseId) => {
    try {
      const formData = new FormData();
      formData.append("c_id", courseId);
      formData.append("fc_id", id);
      const response = await axios.post(
        `${API_URL}/admin/courses/deletecoursefromfc.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      console.log(response);
      if (response.status == 200) {
        dispatch(deleteCourse(courseId));
        toast.success("Course Deleted Successfully");
      }
    } catch (error) {
      console.log("error");
    }
  };

  const renderCourseData = (data) => {
    if (typeof data === "string") {
      return parser(data);
    }
    return data;
  };

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center my-5 w-full">
          <GetFullCourseById id={id} />
          {show ? (
            <div
              onClick={() => setShow(false)}
              className="cursor-pointer font-semibold border rounded-md border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2"
            >
              Close
            </div>
          ) : (
            <div
              onClick={handleOpenAndFetchData}
              className="cursor-pointer font-semibold border rounded-md border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2"
            >
              See Courses
            </div>
          )}
          {show && (
            <div className="flex flex-col justify-center items-center my-5 w-[80%]">
              <h1 className="text-3xl font-bold text-center">
                Full Course List
              </h1>
              {courses.length ? (
                <div className="flex flex-col justify-center items-center">
                  {courses.map(
                    (course, idx) =>
                      course && (
                        <div
                          key={idx}
                          className="flex  justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-2 gap-4 cursor-pointer"
                        >
                          <div className="flex flex-col justify-center items-start gap-2 w-full">
                            <div className="flex justify-center items-center gap-6 w-full">
                              <div className="flex justify-center items-center w-48">
                                <img
                                  src={course.img_url}
                                  alt={"image"}
                                  className="rounded-lg border-transparent w-full h-24"
                                />
                              </div>
                              <div
                                onClick={() =>
                                  navigate(`/get-course-videos?id=${course.id}`)
                                }
                                className="flex flex-col justify-center items-start gap-3 w-full"
                              >
                                <div className="flex justify-center items-center gap-2 w-full">
                                  <div>
                                    <Avatar className="bg-gray-500 text-white w-8">
                                      {course.id}
                                    </Avatar>
                                  </div>
                                  <div className="text-start w-full">
                                    {renderCourseData(course.course_name)}
                                  </div>
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
                              <div className="flex flex-col justify-between items-end gap-10 w-fit">
                                <ConfirmDelete
                                  handleClick={() => handleDelete(course.id)}
                                />
                              </div>
                            </div>
                          </div>
                          {/* <div className="flex flex-col justify-between items-end gap-10 w-fit">
                      <UpdateBtn
                        handleClick={() => {
                          setUpdateCourse(true);
                          setUpdateCourseData(course);
                        }}
                      />
                      <ConfirmDelete
                        handleClick={() => handleDelete(course.id)}
                      />
                    </div> */}
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
        </div>
      )}
    </LayoutAdjuster>
  );
};

export default GetFullCourseSubjects;
