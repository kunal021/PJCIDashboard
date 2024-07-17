import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse, deleteCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import { API_URL } from "../../url";
import { useSearchParams } from "react-router-dom";
import Loader from "../../utils/Loader";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import parser from "html-react-parser";
import { Avatar } from "antd";
import { CalendarClock, IndianRupee, SquarePlay } from "lucide-react";
import ConfirmDelete from "../../utils/ConfirmDelete";
import toast from "react-hot-toast";

const GetCourseCategoryWise = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("id", id);
        const response = await axios.post(
          `${API_URL}/admin/courses/getcoursecategorywise.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );
        dispatch(setCourse(response.data.data_course));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [dispatch, id, searchParams]);

  const renderCourseData = (data) => {
    if (typeof data === "string") {
      return parser(data);
    }
    return data;
  };

  const handleDelete = async (courseId) => {
    try {
      const formData = new FormData();
      formData.append("c_id", id);
      formData.append("course_id", courseId);
      console.log(courseId, id, formData);
      const response = await axios.post(
        `${API_URL}/admin/category/deletecourseandfcfromcategory.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      console.log(response);
      if (response.status === 200) {
        toast.success("Course Deleted Sucessfully");
        dispatch(deleteCourse(courseId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(courses);

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center my-5 w-full">
          <h1 className="text-3xl font-bold text-center">Course List</h1>
          {courses.length > 0 ? (
            <div className="flex flex-col justify-center items-center w-[80%]">
              {courses.map(
                (course, idx) =>
                  course && (
                    <div
                      key={idx}
                      className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-2 gap-4"
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
                          <div className="flex flex-col justify-center items-start gap-3 w-full cursor-pointer">
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
                          <div>
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
    </LayoutAdjuster>
  );
};

export default GetCourseCategoryWise;
