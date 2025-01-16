import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse, deleteCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import { API_URL } from "../../url";
import { useSearchParams } from "react-router-dom";
import Loader from "../../utils/Loader";
// import parser from "html-react-parser";
import { Avatar } from "antd";
import { CalendarClock, IndianRupee, SquarePlay } from "lucide-react";
import ConfirmDelete from "../../utils/ConfirmDelete";
import toast from "react-hot-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  deleteFullCourse,
  setFullCourse,
} from "../../redux/courses/fullCourseSlice";
import { LatexParser } from "@/utils/LatexParser";
import { useHeading } from "@/hooks/use-heading";

const GetCourseCategoryWise = () => {
  const { setHeading } = useHeading();
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

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">Courses</h1>
      </div>
    );
  }, [setHeading]);

  const renderCourseData = (data) => {
    if (typeof data === "string") {
      return LatexParser(data);
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
        toast.success("Course Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error deleting course");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-6 w-[90%] mx-auto mt-5">
        <Tabs defaultValue="course" className="w-full">
          <TabsList className="w-full flex justify-center">
            <TabsTrigger value="course" className="flex-1">
              Course
            </TabsTrigger>
            <TabsTrigger value="full-course" className="flex-1">
              Full Course
            </TabsTrigger>
          </TabsList>

          <TabsContent value="course">
            {loading ? (
              <Loader className="animate-spin text-blue-500 text-center w-full" />
            ) : (
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full py-4">
                  <div className="w-full">
                    {courses.length > 0 ? (
                      <div className="space-y-4">
                        {courses.map((course, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row w-full border rounded-lg border-zinc-300 p-4 gap-4"
                          >
                            {/* Image Section */}
                            <div className="flex justify-center sm:justify-start w-full sm:w-48 h-48 sm:h-24">
                              <img
                                src={course.img_url}
                                alt={course.course_name}
                                className="rounded-lg object-cover w-full h-full"
                              />
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-col flex-grow gap-4">
                              {/* Course Title */}
                              <div className="flex items-start gap-2">
                                <Avatar className="bg-gray-500 text-white w-8 flex-shrink-0">
                                  {idx + 1}
                                </Avatar>
                                <div className="text-start flex-grow break-words">
                                  {renderCourseData(course.course_name)}
                                </div>
                              </div>

                              <hr className="border-slate-300" />

                              {/* Course Details */}
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <CalendarClock className="w-4 h-4" />
                                  <span>{course.course_duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <SquarePlay className="w-4 h-4" />
                                  <span>{course.total_number_of_videos}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="w-4 h-4" />
                                  <span>{course.price}</span>
                                </div>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <div className="flex justify-end sm:justify-center items-start pt-2">
                              <ConfirmDelete
                                handleClick={() =>
                                  handleDelete(course.id, course.course_type)
                                }
                              />
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
          </TabsContent>

          <TabsContent value="full-course">
            {loading ? (
              <Loader className="animate-spin text-blue-500" />
            ) : (
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full py-4">
                  {fullCourses.length > 0 ? (
                    <div className="space-y-4">
                      {fullCourses.map((course) => (
                        <div
                          key={course.id}
                          className="flex flex-col sm:flex-row w-full border rounded-lg border-zinc-300 p-4 gap-4"
                        >
                          {/* Course Image */}
                          <div className="w-full sm:w-48 h-48 sm:h-24 flex items-center justify-center">
                            <img
                              src={course.img_url}
                              alt={course.full_course_name}
                              className="rounded-lg object-cover w-full h-full"
                            />
                          </div>

                          {/* Course Content */}
                          <div className="flex flex-col flex-grow space-y-4">
                            {/* Course Title */}
                            <div className="flex items-start gap-2">
                              <Avatar className="bg-gray-500 text-white w-8 flex-shrink-0">
                                {course.id}
                              </Avatar>
                              <div className="text-start flex-grow break-words">
                                {renderCourseData(course.full_course_name)}
                              </div>
                            </div>

                            <hr className="border-slate-300" />

                            {/* Course Details */}
                            <div className="flex flex-wrap justify-between items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <CalendarClock className="w-4 h-4" />
                                <span>{course.full_course_duration}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <SquarePlay className="w-4 h-4" />
                                <span>{course.total_number_of_videos}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IndianRupee className="w-4 h-4" />
                                <span>{course.full_course_price}</span>
                              </div>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <div className="flex justify-end sm:justify-center items-start pt-2">
                            <ConfirmDelete
                              handleClick={() =>
                                handleDelete(course.id, course.course_type)
                              }
                            />
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
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default GetCourseCategoryWise;
