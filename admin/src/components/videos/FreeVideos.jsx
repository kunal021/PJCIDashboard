import { useEffect, useState } from "react";
import Loader from "../../utils/Loader";
import ConfirmDelete from "../../utils/ConfirmDelete";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../url";
import { deleteVideo, setVideo } from "../../redux/videos/videoSlice";
import toast from "react-hot-toast";
import { truncateData } from "@/utils/truncateData";
import { useHeading } from "@/hooks/use-heading";
import AddFreeVideo from "./AddFreeVideo";

const fetchData = async (
  setLoading,

  dispatch
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    const response = await axios.post(
      `${API_URL}/admin/video/getfreevideos.php`,
      formData,
      { headers: "content-type/form-data" }
    );

    dispatch(setVideo(response.data.data));
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function FreeVideos() {
  const dispatch = useDispatch();
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);

  const video = useSelector((state) => state.video.video);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          Free Video List
        </h1>
        <AddFreeVideo fetchData={() => fetchData(setLoading, dispatch)} />
      </div>
    );
    fetchData(setLoading, dispatch);
  }, [dispatch, setHeading]);

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
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full sm:w-[90%] flex flex-col justify-center items-center mx-auto">
          <div className="flex flex-col justify-center items-center">
            {video.length > 0 ? (
              <div className="flex flex-wrap justify-center items-center w-full gap-4">
                {video.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex  justify-center items-center font-medium w-44 border rounded-md border-zinc-300 ml-2 my-4 py-2 px-1"
                  >
                    <div className="flex flex-col justify-center items-start gap-4 w-full">
                      <div className="flex flex-col justify-between items-center w-full gap-2">
                        <div className="flex justify-center items-center w-40">
                          <img
                            src={`https://img.youtube.com/vi/${item.video_id}/maxresdefault.jpg`}
                            className="rounded-lg border-transparent h-24 w-full"
                          />
                        </div>
                        <div className="flex justify-between items-center w-full">
                          <div className="text-xs flex text-center flex-wrap text-wrap w-full">
                            {truncateData(item.video_title, 5)}
                          </div>
                          <div className="flex flex-col justify-between items-end">
                            <ConfirmDelete
                              handleClick={() => handleDelete(item.video_id)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-2xl font-bold text-center">
                No Data Available
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FreeVideos;
