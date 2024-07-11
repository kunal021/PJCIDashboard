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
        <div className="flex flex-col justify-center items-center my-5">
          <h1 className="text-3xl font-bold text-center">Course List</h1>
          {courses.length > 0 ? (
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
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div className="flex justify-center items-center gap-10">
                          <img
                            src={course.img_url}
                            alt={renderCourseData(course.course_name)}
                            className="rounded-lg border-transparent w-36 h-24"
                          />
                          <div className="text-start w-full">
                            {renderCourseData(course.course_name)}
                          </div>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        {/* <div className="flex flex-row-reverse flex-wrap text-wrap justify-end items-start gap-4 w-full">
                          {parser(course.course_description)}
                        </div> */}
                        <div className="flex justify-between items-center w-full gap-4">
                          <div>Duration: {course.course_duration}</div>
                          <div>Videos: {course.total_number_of_videos}</div>
                          <div>Price: {course.price}</div>
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
