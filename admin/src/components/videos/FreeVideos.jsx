import { useEffect, useState } from "react";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import LinkButton from "../../utils/LinkButton";
import Loader from "../../utils/Loader";
import ConfirmDelete from "../../utils/ConfirmDelete";
import { Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../url";
import { deleteVideo, setVideo } from "../../redux/videos/videoSlice";
import toast from "react-hot-toast";

const fetchData = async (
  setLoading,
  //   currentPage,
  dispatch
  //   setPaginationData
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    // formData.append("page", currentPage);
    // formData.append("limit", 10);
    const response = await axios.post(
      `${API_URL}/admin/video/getfreevideos.php`,
      formData,
      { headers: "content-type/form-data" }
    );

    // console.log(response);
    dispatch(setVideo(response.data.data));
    // setPaginationData(response.data.pagination);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function FreeVideos() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  //   const [paginationData, setPaginationData] = useState({});
  //   const [currentPage, setCurrentPage] = useState(1);
  const video = useSelector((state) => state.video.video);

  useEffect(() => {
    fetchData(setLoading, dispatch);
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("video_id", id);
      const response = await axios.post(
        `${API_URL}/admin/video/deletefreevideo.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      console.log(response);

      if (response.status === 200) {
        dispatch(deleteVideo(id));
        toast.success("Video Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error while deleting video");
    } finally {
      setLoading(false);
    }
  };
  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[80%] flex flex-col justify-center items-center mx-auto">
          <div className="flex justify-center items-center space-x-10 my-5">
            <h1 className="text-3xl font-bold text-center">Free Video List</h1>
            <LinkButton to="/add-free-video">Add Free Video</LinkButton>
          </div>
          {show ? (
            <div
              onClick={() => setShow(false)}
              className="cursor-pointer font-semibold border rounded-md border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2 my-10"
            >
              Close
            </div>
          ) : (
            <div
              onClick={() => setShow(true)}
              className="cursor-pointer font-semibold border rounded-md border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 my-10"
            >
              See Free Videos
            </div>
          )}
          {show && (
            <div>
              <div className=" flex flex-col justify-center items-center">
                {video.length > 0 ? (
                  <div className="flex flex-col justify-center items-center w-full">
                    {video.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex  justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                      >
                        <div className="flex flex-col justify-center items-start gap-4 w-full">
                          <div className="flex justify-between items-center w-full gap-4">
                            <Avatar className="bg-gray-500 text-white">
                              {idx + 1}
                            </Avatar>
                            <div>Video ID: {item.video_id}</div>
                          </div>
                          <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                          <div className="flex justify-between items-center w-full gap-6">
                            <div className="flex justify-center items-center w-48">
                              <img
                                src={`https://img.youtube.com/vi/${item.video_id}/maxresdefault.jpg`}
                                className="rounded-lg border-transparent h-24 w-full"
                              />
                            </div>
                            <div className="flex flex-wrap text-wrap w-full">
                              {item.video_title}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-between items-end gap-10 w-fit">
                          {/* <UpdateBtn
                            handleClick={() => {
                              setUpdateVideo((prev) => !prev);
                              setUpdateVideoData(item);
                            }}
                          /> */}
                          <ConfirmDelete
                            handleClick={() => handleDelete(item.video_id)}
                          />
                        </div>
                      </div>
                    ))}
                    {/* <div>
                      <Pagination
                        totalPage={paginationData.total_pages}
                        currPage={currentPage}
                        setCurrPage={setCurrentPage}
                      />
                    </div> */}
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-center">
                    No Data Available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </LayoutAdjuster>
  );
}

export default FreeVideos;
