/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../url";
import FormField from "../../utils/FormField";
// import Tiptap from "../../utils/TextEditor";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateVideo } from "../../redux/videos/videoSlice";

function UpdateVideo({ setUpdateVideo, updateVideoData }) {
  const [data, setData] = useState({
    videoid: updateVideoData.video_id,
    video_duration: updateVideoData.video_duration,
    video_title: updateVideoData.video_title,
  });
  // const [videoTitle, setVideoTitle] = useState(updateVideoData.video_title);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdateVideo = async () => {
    try {
      const formData = new FormData();
      formData.append("id", updateVideoData.id);
      formData.append("videoid", data.videoid);
      formData.append("video_title", data.video_title);
      formData.append("video_duration", data.video_duration);
      const response = await axios.post(
        `${API_URL}/admin/video/updatevideo.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        dispatch(
          updateVideo({
            id: updateVideoData.id,
            video_id: data.videoid,
            video_title: data.video_title,
            video_duration: data.video_duration,
            is_active: updateVideoData.is_active,
            is_deleted: updateVideoData.is_deleted,
          })
        );
        toast.success("Video Updated Successfully");
      }
    } catch (error) {
      console.log(error);
    }
    setUpdateVideo((prev) => !prev);
  };

  // const getVideoData = (html) => {
  //   setVideoTitle(html);
  // };
  return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center my-5">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-center text-3xl font-bold">Update Course</h1>
        <div className="w-full flex flex-col justify-center items-center ml-2">
          <FormField
            id={"videoid"}
            type={"text"}
            placeholder={"Enter Video Id"}
            htmlFor={"videoid"}
            name={"videoid"}
            value={data.videoid}
            onChange={handleChange}
          >
            Video Id
          </FormField>
          <FormField
            id={"video_duration"}
            type={"text"}
            placeholder={"Enter Video Duration"}
            htmlFor={"video_duration"}
            name={"video_duration"}
            value={data.video_duration}
            onChange={handleChange}
          >
            Video Duration
          </FormField>
          <FormField
            id={"video_title"}
            type={"text"}
            placeholder={"Enter Video Title"}
            htmlFor={"video_title"}
            name={"video_title"}
            value={data.video_title}
            onChange={handleChange}
          >
            Video Tile
          </FormField>
          {/* <div className="w-full flex flex-col justify-center items-start m-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Video Title:
            </label>
            <Tiptap
              initialContent={videoTitle}
              getHtmlData={getVideoData}
              placeholder="Write the question here..."
            />
          </div> */}
          <button
            onClick={handleUpdateVideo}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md"
          >
            Update Video
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateVideo;
