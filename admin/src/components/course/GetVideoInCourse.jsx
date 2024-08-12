import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../url";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Loader from "../../utils/Loader";
import { Avatar } from "antd";
import Pagination from "../../utils/Pagination";
import parser from "html-react-parser";
import toast from "react-hot-toast";
import ConfirmDelete from "../../utils/ConfirmDelete";
import { useSearchParams } from "react-router-dom";
import GetCourseById from "./GetCourseById";
import { useDispatch, useSelector } from "react-redux";
import { setVideo } from "../../redux/videos/videoSlice";

const fetchData = async (
  setLoading,
  currentPage,
  setPaginationData,
  courseId,
  setVideo,
  dispatch
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("course_id", courseId);
    formData.append("page", currentPage);
    formData.append("limit", 10);
    const response = await axios.post(
      `${API_URL}/admin/courses/getvideolistofcourse.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    console.log(response);
    if (response.status === 200) {
      dispatch(setVideo(response.data.data));
      setPaginationData(response.data.pagination);
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetVideoInCourse() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);

  const video = useSelector((state) => state.video.video);

  useEffect(() => {
    fetchData(
      setLoading,
      currentPage,
      setPaginationData,
      courseId,
      setVideo,
      dispatch
    );
  }, [courseId, currentPage, dispatch]);

  const handleOpenAndFetchData = () => {
    setShow(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("v_id", id);
      formData.append("c_id", courseId);
      const response = await axios.post(
        `${API_URL}/admin/courses/deletevideofromcourse.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      if (response.status === 200) {
        dispatch(setVideo(video.filter((item) => item.id !== id)));
        toast.success("Video Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error deleting video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAdjuster>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div
          className={`w-full flex flex-col justify-center items-center mx-auto`}
        >
          <div className="w-full flex flex-col justify-center items-center my-5">
            <GetCourseById id={courseId} />
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
                See Videos
              </div>
            )}
            {show && (
              <div className="flex flex-col justify-center items-center my-5 w-[80%]">
                <h1 className="text-3xl font-bold text-center">Videos List</h1>
                <div className="w-full flex flex-col justify-center items-center">
                  {video.length > 0 ? (
                    <div className="flex flex-col justify-center items-center w-full">
                      {video.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex  justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                        >
                          <div className="flex justify-center items-center gap-4 w-full">
                            <Avatar className="bg-gray-500 text-white w-8">
                              {item.id}
                            </Avatar>
                            <div className="flex flex-wrap text-wrap w-full">
                              {typeof item.video_title == "string"
                                ? parser(item.video_title)
                                : item.video_title}
                            </div>
                          </div>
                          <div className="flex flex-col justify-between items-end gap-10 w-fit">
                            <ConfirmDelete
                              handleClick={() => handleDelete(item.id)}
                            />
                          </div>
                        </div>
                      ))}
                      <div>
                        <Pagination
                          totalPage={paginationData.total_pages || 1}
                          currPage={currentPage}
                          setCurrPage={setCurrentPage}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-center mt-20">
                      No Data Available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </LayoutAdjuster>
  );
}

export default GetVideoInCourse;
