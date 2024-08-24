import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../url";
import FormField from "../../utils/FormField";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
// import Loader from "../../utils/Loader";
// import Tiptap from "../../utils/TextEditor";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddVideo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    videoid: "",
    video_title: "",
    video_duration: "",
  });

  // const [videoTitle, setVideoTitle] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddVideo = async () => {
    if (!data.videoid || !data.video_title || !data.video_duration) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("videoid", data.videoid);
      formData.append("video_title", data.video_title);
      formData.append("video_duration", data.video_duration);
      const response = await axios.post(
        `${API_URL}/admin/video/addvideo.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("Video Added Successfully");
        navigate("/get-videos");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error adding video");
    } finally {
      setLoading(false);
    }
    setData({
      videoid: "",
      video_title: "",
      video_duration: "",
    });
    // setVideoTitle("");
  };

  // const getVideoData = (html) => {
  //   setVideoTitle(html);
  // };
  return (
    <LayoutAdjuster>
      <div className="w-[80%] flex flex-col justify-center items-center p-5 border rounded-lg border-gray-500">
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
          type={"time"}
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
              // initialContent={data}
              getHtmlData={getVideoData}
              placeholder="Write the question here..."
            />
          </div> */}
        <button
          onClick={handleAddVideo}
          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md"
        >
          {loading ? "Adding..." : "Add Video"}
        </button>
      </div>
    </LayoutAdjuster>
  );
}

export default AddVideo;
