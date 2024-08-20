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
import * as Tabs from "@radix-ui/react-tabs";
import {
  deleteFullCourse,
  setFullCourse,
} from "../../redux/courses/fullCourseSlice";

const GetCourseCategoryWise = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);
  const fullCourses = useSelector((state) => state.fullCourse.fullCourse);

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
        // console.log(response.data);
        if (response.status === 200) {
          dispatch(setCourse(response.data.data_course));
          dispatch(setFullCourse(response.data.data_full_course));
        }
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

  const handleDelete = async (courseId, courseType) => {
    try {
      const formData = new FormData();
      formData.append("course_type", courseType);
      formData.append("c_id", id);
      formData.append("course_id", courseId);
      const response = await axios.post(
        `${API_URL}/admin/category/deletecourseandfcfromcategory.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      // console.log(response);
      if (response.status === 200) {
        if (courseType === "1") {
          dispatch(deleteCourse(courseId));
        }
        if (courseType === "0") {
          dispatch(deleteFullCourse(courseId));
        }
        toast.success("Course Deleted Sucessfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error deleting course");
    }
  };

  return (
    <LayoutAdjuster>
      <Tabs.Root
        className="flex flex-col w-[80%] shadow-[0_2px_10px] shadow-blackA2 mt-2"
        defaultValue="tab1"
      >
        <Tabs.List
          className="shrink-0 flex border-b border-mauve6"
          aria-label="Manage your account"
        >
          <Tabs.Trigger
            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
            value="tab1"
          >
            Course
          </Tabs.Trigger>
          <Tabs.Trigger
            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-mauve11 select-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black outline-none cursor-default"
            value="tab2"
          >
            Full Course
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          value="tab1"
        >
          {loading ? (
            <Loader className="animate-spin text-blue-500 text-center w-full" />
          ) : (
            <div
              className={`w-full flex flex-col justify-center items-center mx-auto`}
            >
              <div className="w-full flex flex-col justify-center items-center my-2">
                <div className="w-full flex flex-col justify-center items-center">
                  {courses.length > 0 ? (
                    <div className="flex flex-col justify-center items-center w-full">
                      {courses.map((course, idx) => (
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
                                      {idx + 1}
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
                                  handleClick={() =>
                                    handleDelete(course.id, course.course_type)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-center mt-20">
                      No Data Available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Tabs.Content>
        <Tabs.Content
          className="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
          value="tab2"
        >
          {loading ? (
            <Loader className="animate-spin text-blue-500" />
          ) : (
            <div
              className={`w-full flex flex-col justify-center items-center mx-auto`}
            >
              <div className="w-full flex flex-col justify-center items-center my-2">
                <div className="w-full flex flex-col justify-center items-center">
                  {fullCourses.length > 0 ? (
                    <div className="flex flex-col justify-center items-center w-full">
                      {fullCourses.map((course, idx) => (
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
                                    {renderCourseData(course.full_course_name)}
                                  </div>
                                </div>
                                <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                                <div className="flex justify-between items-center w-full gap-2">
                                  <div className="flex justify-center items-center gap-0.5">
                                    <CalendarClock className="scale-75" />
                                    <p>{course.full_course_duration}</p>
                                  </div>
                                  <div className="flex justify-center items-center gap-0.5">
                                    <SquarePlay className="scale-75" />
                                    <p>{course.total_number_of_videos}</p>
                                  </div>
                                  <div className="flex justify-center items-center gap-0.5">
                                    <IndianRupee className="scale-75" />
                                    <p>{course.full_course_price}</p>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <ConfirmDelete
                                  handleClick={() =>
                                    handleDelete(course.id, course.course_type)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-center mt-20">
                      No Data Available
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Tabs.Content>
      </Tabs.Root>
    </LayoutAdjuster>
  );
};

export default GetCourseCategoryWise;
