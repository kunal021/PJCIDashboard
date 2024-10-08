/* eslint-disable react/prop-types */
import * as Dialog from "@radix-ui/react-dialog";
import axios from "axios";
import { Plus, SquarePlay, X } from "lucide-react";
import { API_URL } from "../../url";
import { useCallback, useEffect, useState, useMemo } from "react";
import Loader from "../../utils/Loader";
import Pagination from "../../utils/Pagination";
// import parser from "html-react-parser";
import { Avatar } from "antd";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addVideo } from "../../redux/videos/videoSlice";

const fetchData = async (
  courseId,
  currentPage,
  setLoading,
  setVideo,
  setPaginationData
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("course_id", courseId);
    formData.append("page", currentPage);
    formData.append("limit", 10);

    const response = await axios.post(
      `${API_URL}/admin/courses/getvideoavailabletoadd.php`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (response.status === 200) {
      setVideo(response.data.data);
      setPaginationData(response.data.pagination);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    // toast.error(error.response.data.message || "Error fetching data");
  } finally {
    setLoading(false);
  }
};

function AddVideoInCourse({ courseId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [video, setVideo] = useState([]);

  const memoizedVideoList = useMemo(() => video, [video]);

  const handleAddVideo = useCallback(
    async (vid, cid) => {
      try {
        const formData = new FormData();
        formData.append("c_id", cid);
        formData.append("v_id", vid);
        const response = await axios.post(
          `${API_URL}/admin/courses/addvideoincourse.php`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.status === 200) {
          dispatch(addVideo(memoizedVideoList.find((item) => item.id === vid)));
          setVideo(memoizedVideoList.filter((item) => item.id !== vid));
          toast.success("Video added successfully");
        }
      } catch (error) {
        console.error("Error adding video:", error);
        toast.error("Failed to add video");
      }
    },
    [dispatch, memoizedVideoList]
  );

  useEffect(() => {
    fetchData(courseId, currentPage, setLoading, setVideo, setPaginationData);
  }, [courseId, currentPage]);

  const renderVideos = () => {
    if (!memoizedVideoList.length) {
      return (
        <div className="text-2xl font-bold text-center mt-20">
          No Data Found
        </div>
      );
    }

    return (
      <>
        {memoizedVideoList.map((item, idx) => (
          <VideoItem
            key={idx}
            idx={idx}
            item={item}
            courseId={courseId}
            handleAddVideo={handleAddVideo}
          />
        ))}
        <Pagination
          totalPage={paginationData.total_pages}
          currPage={currentPage}
          setCurrPage={setCurrentPage}
        />
      </>
    );
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-white bg-green-500 hover:bg-green-700 items-center text-xs font-bold justify-center rounded p-1 group relative">
          <SquarePlay />
          <p className="absolute -left-[20%] -top-full mt-1 hidden group-hover:block bg-white text-black rounded p-1">
            Add Video
          </p>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-blackA6 data-[state=open]:animate-overlayShow fixed inset-0" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] overflow-auto left-[55%] max-h-[95vh] w-[90vw] max-w-[750px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
          <Dialog.Title className="text-mauve12 m-0 text-2xl font-bold">
            Add Video
          </Dialog.Title>
          {loading ? <Loader /> : renderVideos()}
          <div className="mt-[25px] flex justify-end">
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="bg-red-500 text-white hover:bg-red-700  inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none"
              >
                Close
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Close asChild>
            <button className="text-black hover:bg-blue-100 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full">
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const VideoItem = ({ idx, item, courseId, handleAddVideo }) => (
  <div className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-2 p-3 gap-3">
    <div className="flex flex-col justify-center items-start gap-4 w-[90%]">
      <div className="flex justify-start items-center text-sm w-full gap-4">
        <Avatar className="bg-gray-500 text-white w-8 h-8">{idx + 1}</Avatar>
        <div className="flex flex-wrap text-wrap">{item.video_title}</div>
      </div>
    </div>
    <button
      onClick={() => handleAddVideo(item.id, courseId)}
      className="rounded-full bg-green-200 p-1 items-center"
    >
      <Plus />
    </button>
  </div>
);

export default AddVideoInCourse;
