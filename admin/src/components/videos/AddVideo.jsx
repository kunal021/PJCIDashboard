import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../url";
import FormField from "../../utils/FormField";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Loader from "../../utils/Loader";
import Tiptap from "../../utils/TextEditor";
import toast from "react-hot-toast";

function AddVideo() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    videoid: "",
    // video_title: "",
    // video_duration: "",
  });

  const [videoTitle, setVideoTitle] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddVideo = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("videoid", data.videoid);
      formData.append("video_title", videoTitle);
      formData.append("video_duration", "2hrs");
      const response = await axios.post(
        `${API_URL}/admin/video/addvideo.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      console.log(response);
      if (response.status === 201) {
        toast.success("Video Added Successfully");
      }
    } catch (error) {
      toast.error(error.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
    setData({
      videoid: "",
    });
  };

  const getVideoData = (html) => {
    setVideoTitle(html);
  };
  return (
    <LayoutAdjuster>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
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
          <div className="w-full flex flex-col justify-center items-start m-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Video Title:
            </label>
            <Tiptap
              // initialContent={data}
              getHtmlData={getVideoData}
              placeholder="Write the question here..."
            />
          </div>
          <button
            onClick={handleAddVideo}
            className="bg-blue-500 hover:bg-blue-700 text-white w-[20%] font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Video
          </button>
        </div>
      )}
    </LayoutAdjuster>
  );
}

export default AddVideo;
