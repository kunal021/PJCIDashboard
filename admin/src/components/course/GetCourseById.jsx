import { useEffect, useState } from "react";
// import { setCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
// import LinkButton from "../../utils/LinkButton";
// import ConfirmDelete from "../../utils/ConfirmDelete";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
// import toast from "react-hot-toast";
// import UpdateBtn from "../../utils/UpdateBtn";
// import parser from "html-react-parser";
// import { Avatar } from "antd";
// import AddVideoInCourse from "./AddVideoInCourse";
// import SeeAll from "../../utils/SeeAll";
import { CalendarClock, IndianRupee, SquarePlay } from "lucide-react";
// import AddVideoInCourse from "./AddVideoInCourse";
import { LatexParser } from "@/utils/LatexParser";
import MakeUserPurchase from "../setting/MakeUserPurchase";
import expiryDate from "@/utils/ExpiryDate";
import MakeUserPurchaseResponse from "@/utils/MakeUserPurchaseResponse";

const fetchCourse = async (setCourses, setLoading, id) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("course_type", 1);
    formData.append("course_id", id);
    const response = await axios.post(
      `${API_URL}/admin/courses/getcoursebyid.php`,
      formData,
      { headers: { "content-type": "multipart/form-data" } }
    );
    // console.log(response);
    if (response.status === 200) {
      setCourses(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

// eslint-disable-next-line react/prop-types
function GetCourseById({ id }) {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [makePurchaseData, setMakePurchaseData] = useState(null);
  const [makePurchaseStatus, setMakePurchaseStatus] = useState(false);

  //   console.log(courses);

  useEffect(() => {
    fetchCourse(setCourses, setLoading, id);
  }, [id]);

  //   const handleDelete = useCallback(
  //     async (courseId) => {
  //       try {
  //         const response = await axios.delete(
  //           `${API_URL}/admin/courses/deletecourse.php?courseid=${courseId}`
  //         );
  //         if (response.data.success) {
  //           dispatch(deleteCourse({ courseId }));
  //           toast.success("Course Deleted Successfully");
  //         }
  //       } catch (error) {
  //         toast.error(error.response?.data?.message || "Error deleting course");
  //       }
  //     },
  //     [dispatch]
  //   );

  //   const handleChangeStatus = useCallback(
  //     async (courseId, isactive) => {
  //       const confirmAlert = window.confirm(
  //         `${
  //           isactive === "1"
  //             ? "course will become Inactive. Do you want to proceed"
  //             : "course will become Active. Do you want to proceed"
  //         }`
  //       );
  //       if (confirmAlert) {
  //         try {
  //           isactive = isactive === "1" ? "0" : "1";
  //           const formData = new FormData();
  //           formData.append("course_id", courseId);
  //           formData.append("statuscode", isactive);
  //           formData.append("course_type", 1);
  //           await axios.post(
  //             `${API_URL}/admin/courses/updatecoursestatus.php`,
  //             formData,
  //             { headers: { "content-type": "multipart/form-data" } }
  //           );

  //           // Update local state instead of fetching users again
  //           const updatedCourse = courses.map((course) =>
  //             course.id === courseId ? { ...course, isactive } : course
  //           );
  //           dispatch(setCourse(updatedCourse));
  //         } catch (error) {
  //           console.log("Error updating user status:", error);
  //           // Handle error (e.g., show an error message)
  //         }
  //       }
  //     },
  //     [dispatch, courses]
  //   );

  const renderCourseData = (data) => {
    if (typeof data === "string") {
      return LatexParser(data);
    }
    return data;
  };

  // console.log(courses);

  return (
    <div className="w-full">
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`w-full flex flex-col justify-center items-center mx-auto`}
        >
          {courses ? (
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex justify-center items-center gap-5">
                <h1 className="text-3xl font-bold text-center my-2">
                  Course Detail
                </h1>

                {courses && (
                  <MakeUserPurchase
                    id={courses.id}
                    amount={courses.price}
                    expiryDate={expiryDate(courses?.course_duration, 7)}
                    productInfo={courses.course_name}
                    type={"1"}
                    setMakePurchaseStatus={setMakePurchaseStatus}
                    setMakePurchaseData={setMakePurchaseData}
                  />
                )}
              </div>

              {makePurchaseStatus && (
                <MakeUserPurchaseResponse
                  data={makePurchaseData}
                  onClose={() => setMakePurchaseStatus(false)}
                />
              )}
              <div className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-2 gap-4">
                <div className="flex flex-col justify-center items-start gap-2 w-full">
                  <div className="flex justify-between items-center w-full gap-4">
                    {/* <Avatar className="bg-gray-500 text-white">
                      {courses.id}
                    </Avatar> */}
                    {/* <button
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
                          </button> */}
                  </div>
                  {/* <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" /> */}
                  <div className="flex justify-center items-center gap-6 w-full">
                    <div className="flex justify-center items-center w-48">
                      <img
                        src={courses.img_url}
                        alt={"image"}
                        className="rounded-lg border-transparent w-full h-24"
                      />
                    </div>
                    <div className="flex flex-col justify-center items-start gap-3 w-full">
                      <div className="text-start w-full whitespace-pre-wrap">
                        {renderCourseData(courses.course_name)}
                      </div>
                      <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                      <div className="flex justify-between items-center w-full gap-2">
                        <div className="flex justify-center items-center gap-0.5">
                          <CalendarClock className="scale-75" />
                          <p>{courses.course_duration}</p>
                        </div>
                        <div className="flex justify-center items-center gap-0.5">
                          <SquarePlay className="scale-75" />
                          <p>{courses.total_number_of_videos}</p>
                        </div>
                        <div className="flex justify-center items-center gap-0.5">
                          <IndianRupee className="scale-75" />
                          <p>{courses.price}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                  <div className="flex justify-between items-center w-full gap-2 whitespace-pre-wrap">
                    {renderCourseData(courses.course_description)}
                  </div>
                </div>
                {/* <div className="flex flex-col justify-between items-end gap-10 w-fit">
                  <AddVideoInCourse courseId={courses.id} />
                  <SeeAll
                    handleClick={() =>
                      navigate(`/get-course-videos?id=${course.id}`)
                    }
                    childern={"See All Videos"}
                  />
                  <UpdateBtn
                    handleClick={() => {
                      setUpdateCourse(true);
                      setUpdateCourseData(course.id);
                    }}
                  />
                  <ConfirmDelete handleClick={() => handleDelete(course.id)} />
                </div> */}
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetCourseById;
