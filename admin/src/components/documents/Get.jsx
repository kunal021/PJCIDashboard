import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../url";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Loader from "../../utils/Loader";
import { Avatar } from "antd";
import toast from "react-hot-toast";
import ConfirmDelete from "../../utils/ConfirmDelete";
import UpdateBtn from "../../utils/UpdateBtn";

const fetchData = async (
  setLoading,
  //   currentPage,
  setVideo
  //   setPaginationData
) => {
  try {
    setLoading(true);
    // const formData = new FormData();
    // formData.append("page", currentPage);
    // formData.append("limit", 10);
    const response = await axios.post(
      `${API_URL}/admin/docs/getdoc.php`
      //   formData,
      //   { headers: "content-type/form-data" }
    );
    setVideo(response.data.data);
    // setPaginationData(response.data.pagination);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetDocuments() {
  const [loading, setLoading] = useState(false);
  //   const [paginationData, setPaginationData] = useState({});
  //   const [currentPage, setCurrentPage] = useState(1);
  //   const [updateVideo, setUpdateVideo] = useState(false);
  //   const [updateVideoData, setUpdateVideoData] = useState({});

  const [video, setVideo] = useState([]);

  useEffect(() => {
    fetchData(
      setLoading,
      //  currentPage,
      setVideo
      //  setPaginationData
    );
  }, []);

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
        // dispatch(deleteVideo(id));
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

        // console.log(res);
        // Update local state instead of fetching users again
        const updatedVideo = video.map((video) =>
          video.id === videoId ? { ...video, is_active } : video
        );
        setVideo(updatedVideo);
      } catch (error) {
        console.log("Error updating user status:", error);
        // Handle error (e.g., show an error message)
      }
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
          className={`${"w-[80%] flex flex-col justify-center items-center mx-auto"} `}
        >
          <div className="w-full flex flex-col justify-center items-center my-5">
            <h1 className="text-3xl font-bold text-center">Documnets List</h1>
            <div className="w-full flex flex-col justify-center items-center">
              {video.length > 0 ? (
                <div className="flex flex-col justify-center items-center w-full">
                  {video.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                    >
                      <div className="flex flex-col justify-center items-start gap-4 w-full">
                        <div className="flex justify-between items-center w-full gap-4">
                          <Avatar className="bg-gray-500 text-white">
                            {/* {(currentPage - 1) * 10 + (idx + 1)} */}
                            {idx + 1}
                          </Avatar>
                          {/* <div>Video ID: {item.video_id}</div> */}
                          <div className="flex flex-col justify-center items-center">
                            <p className="text-xs font-bold">
                              {item.is_active === "1" ? "Public" : "Private"}
                            </p>
                            <button
                              onClick={() => {
                                handleChangeStatus(item.id, item.is_active);
                              }}
                              className="toggle-switch scale-75 align-middle"
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
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div
                          onClick={() => window.open(item.url, "_blank")}
                          className="cursor-pointer flex justify-between items-center w-full gap-6"
                        >
                          <div className="flex justify-center items-center w-48">
                            <img
                              src={item.img_url}
                              className="rounded-lg border-transparent h-24 w-full"
                            />
                          </div>
                          <div className="flex flex-wrap text-wrap w-full">
                            {item.name}
                          </div>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div className=" cursor-pointer flex justify-between items-center w-full gap-6">
                          <div className="flex justify-center items-center">
                            Price: {item.price}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end gap-10 w-fit">
                        <UpdateBtn
                        //   handleClick={() => {
                        //     setUpdateVideo((prev) => !prev);
                        //     setUpdateVideoData(item);
                        //   }}
                        />
                        <ConfirmDelete
                          handleClick={() => handleDelete(item.id)}
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
                <div className="text-2xl font-bold text-center mt-20">
                  No Data Available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* {updateVideo && (
        <UpdateVideo
          setUpdateVideo={setUpdateVideo}
          updateVideoData={updateVideoData}
        />
      )} */}
    </LayoutAdjuster>
  );
}

export default GetDocuments;
