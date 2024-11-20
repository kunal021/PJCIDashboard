import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../url";
import FormField from "../../utils/FormField";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AddFreeVideo() {
  const navigate = useNavigate();
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
      formData.append("video_id", data.video_id);
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
      <div className="flex flex-col justify-center items-center w-full">
        <h3 className="text-3xl font-bold my-5">Add Free Video</h3>
        <div className="w-[60%] flex flex-col justify-center items-center p-5 my-10 border rounded-lg border-gray-500">
          <FormField
            id={"video_id"}
            type={"text"}
            placeholder={"Enter Video Id"}
            htmlFor={"video_id"}
            name={"video_id"}
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

          <div className="flex justify-between items-center gap-5 w-full">
            <button
              onClick={() => navigate("/free-video")}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md"
            >
              Cancel
            </button>

            <button
              onClick={handleAddVideo}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md"
            >
              {loading ? "Adding..." : "Add Free Video"}
            </button>
          </div>
        </div>
      </div>
    </LayoutAdjuster>
  );
}

export default AddFreeVideo;
