import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import { API_URL } from "../../url";
import { useSearchParams } from "react-router-dom";
import Loader from "../../utils/Loader";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import parser from "html-react-parser";
import { Avatar } from "antd";

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

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col justify-center items-center my-5">
          <h1 className="text-3xl font-bold text-center">Course List</h1>
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
