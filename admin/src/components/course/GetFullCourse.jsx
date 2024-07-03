import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFullCourse } from "../../redux/courses/fullCourseSlice";
import { deleteFullCourse } from "../../redux/courses/fullCourseSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";
import UpdateFullCourse from "./UpdateFullCourse";
import { API_URL } from "../../url";
import toast from "react-hot-toast";
import Loader from "../../utils/Loader";
import ConfirmDelete from "../../utils/ConfirmDelete";
import UpdateBtn from "../../utils/UpdateBtn";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import parser from "html-react-parser";
import { Avatar } from "antd";
import SeeAll from "../../utils/SeeAll";

const fetchFullCourse = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${API_URL}/admin/courses/getallcourse.php`
    );
    console.log(response);
    dispatch(setFullCourse(response.data.data_fullcourse));
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetFullCourse() {
  const [loading, setLoading] = useState(false);
  const [updateCourse, setUpdateCourse] = useState(false);
  const [updateCourseData, setUpdateCourseData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fullCourse = useSelector((state) => state.fullCourse.fullCourse);

  useEffect(() => {
    setLoading(true);
    fetchFullCourse(dispatch, setLoading);
  }, [dispatch]);

  const handleDelete = async (courseId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/courses/deletefullcourse.php?fullcourseid=${courseId}`
      );

      console.log(response);
      if (courseId && response.data.success) {
        dispatch(deleteFullCourse(response.data));
      }
      if (response.status == 204) {
        toast.success("Full Course Deleted Successfully");
      }
      fetchFullCourse(dispatch);
    } catch (error) {
      toast.error(error.response.data.massage);
    }
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
          } `}
        >
          <div className="flex justify-center items-center space-x-10">
            <h1 className="text-3xl font-bold text-center my-5">
              Full Course List
            </h1>
            <LinkButton to={"/add-full-course"}>Add Full Course</LinkButton>
          </div>
          {fullCourse ? (
            <div className="flex flex-col justify-center items-center w-full overflow-ellipsis">
              {fullCourse.map(
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
                          <div>Duration: {course.full_course_duration}</div>
                          <div>Videos: {course.total_number_of_videos}</div>
                          <div>Price: {course.full_course_price}</div>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div>
                          <div className="flex flex-wrap text-wrap justify-center items-center gap-10">
                            <img
                              src={course.img_url}
                              alt={parser(course.full_course_name)}
                              height={150}
                              width={150}
                              className="rounded-lg border-transparent"
                            />
                            {parser(course.full_course_name)}
                          </div>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div className="flex flex-row-reverse flex-wrap text-wrap justify-end items-start gap-4 w-full">
                          {parser(course.full_course_description)}
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end gap-10 w-fit">
                        <SeeAll
                          handleClick={() =>
                            navigate(`/get-full-course-subject?id=${course.id}`)
                          }
                          childern={"See All Subjects"}
                        />
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
        <UpdateFullCourse
          fetchFullCourse={() => fetchFullCourse(dispatch, setLoading)}
          setUpdateCourse={setUpdateCourse}
          updateCourseData={updateCourseData}
        />
      )}
    </LayoutAdjuster>
  );
}

export default GetFullCourse;
