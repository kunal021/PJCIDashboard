import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../url";
import FormField from "../../utils/FormField";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import toast from "react-hot-toast";

function AddFreeVideo() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    video_id: "",
    video_title: "",
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
    if (!data.video_id || !data.video_title) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("videoid", data.video_id);
      formData.append("video_title", data.video_title);

      const response = await axios.post(
        `${API_URL}/admin/video/addfreevideo.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      console.log(response);
      if (response.status === 201) {
        toast.success("Video Added Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Error adding video");
    } finally {
      setLoading(false);
    }
    setData({
      video_id: "",
      video_title: "",
    });
    // setVideoTitle("");
  };

  // const getVideoData = (html) => {
  //   setVideoTitle(html);
  // };
  return (
    <LayoutAdjuster>
      <div className="w-[60%] flex flex-col justify-center items-center p-5 border rounded-lg border-gray-500">
        <FormField
          id={"videoid"}
          type={"text"}
          placeholder={"Enter Video Id"}
          htmlFor={"videoid"}
          name={"videoid"}
          value={data.video_id}
          onChange={handleChange}
        >
          Video Id
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

        <button
          onClick={handleAddVideo}
          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md"
        >
          {loading ? "Adding..." : "Add Free Video"}
        </button>
      </div>
    </LayoutAdjuster>
  );
}

export default AddFreeVideo;
