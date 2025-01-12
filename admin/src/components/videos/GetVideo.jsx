import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import Pagination from "../../utils/Pagination";
import toast from "react-hot-toast";
import ConfirmDelete from "../../utils/ConfirmDelete";
import { useDispatch, useSelector } from "react-redux";
import { deleteVideo, setVideo } from "../../redux/videos/videoSlice";
import UpdateVideo from "./UpdateVideo";
import { useNavigate } from "react-router-dom";
import { truncateData } from "@/utils/truncateData";
import { useHeading } from "@/hooks/use-heading";
import AddVideo from "./AddVideo";

const fetchData = async (
  setLoading,
  currentPage,
  dispatch,
  setPaginationData
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("page", currentPage);
    formData.append("limit", 12);
    const response = await axios.post(
      `${API_URL}/admin/video/getvideolist.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    dispatch(setVideo(response.data.data));
    setPaginationData(response.data.pagination);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetVideo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const video = useSelector((state) => state.video.video);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          Videos List
        </h1>
        <AddVideo
          fetchData={() =>
            fetchData(setLoading, currentPage, dispatch, setPaginationData)
          }
        />
      </div>
    );
    fetchData(setLoading, currentPage, dispatch, setPaginationData);
  }, [currentPage, dispatch, navigate, setHeading]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("video_id", id);
      const response = await axios.post(
        `${API_URL}/admin/video/deletevideo.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      if (response.status === 201) {
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

  const handleChangeStatus = async (videoId, is_active) => {
    const confirmAlert = window.confirm(
      `${
        is_active === "1"
          ? "Video will become Inactive. Do you want to proceed"
          : "Video will become Active. Do you want to proceed"
      }`
    );
    if (confirmAlert) {
      try {
        is_active = is_active === "1" ? "0" : "1";
        const formData = new FormData();
        formData.append("videoid", videoId);
        formData.append("status", is_active);
        await axios.post(
          `${API_URL}/admin/video/updatevideostatus.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );

        const updatedVideo = video.map((video) =>
          video.id === videoId ? { ...video, is_active } : video
        );
        dispatch(setVideo(updatedVideo));
      } catch (error) {
        console.log("Error updating user status:", error);
      }
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="w-full flex flex-col justify-center items-center mx-auto">
          <div className="w-full flex flex-col justify-center items-center my-5">
            <div className="w-full sm:w-[90%] flex flex-col justify-center items-center my-5">
              {video.length > 0 ? (
                <div className="flex flex-wrap justify-center items-center w-full gap-4">
                  {video.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-center items-start font-medium w-44 h-60 border rounded-md border-zinc-300 ml-2 my-4 py-2 px-0"
                    >
                      <div className="flex flex-col justify-center items-start gap-1 w-full">
                        <div className="flex justify-between items-center w-full gap-1">
                          <div className="flex flex-col justify-center items-center">
                            <p className="text-[10px] font-bold">
                              {item.is_active === "1" ? "Public" : "Private"}
                            </p>
                            <button
                              onClick={() => {
                                handleChangeStatus(item.id, item.is_active);
                              }}
                              className="toggle-switch scale-50 align-middle"
                            >
                              <input
                                type="checkbox"
                                checked={item.is_active === "1"}
                                readOnly
                              />
                              <div className="toggle-switch-background">
                                <div className="toggle-switch-handle"></div>
                              </div>
                            </button>
                          </div>
                          <div className="flex scale-75 justify-between items-end gap-2 w-fit">
                            <UpdateVideo updateVideoData={item} />
                            <ConfirmDelete
                              handleClick={() => handleDelete(item.video_id)}
                            />
                          </div>
                        </div>
                        <div className="flex flex-col justify-between items-center w-full gap-2">
                          <div className="flex justify-center items-center w-40">
                            <img
                              src={`https://img.youtube.com/vi/${item.video_id}/maxresdefault.jpg`}
                              className="rounded-lg border-transparent h-24 w-full"
                            />
                          </div>
                          <div className="text-sm text-center text-wrap w-full">
                            {truncateData(item.video_title, 5)}
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

              <div>
                <Pagination
                  totalPage={paginationData.total_pages}
                  currPage={currentPage}
                  setCurrPage={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GetVideo;
