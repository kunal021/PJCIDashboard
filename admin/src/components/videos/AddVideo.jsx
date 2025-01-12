/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../url";
import FormField from "../../utils/FormField";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus } from "lucide-react";
import TimePicker from "@/utils/TimePicker";

function AddVideo({ fetchData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    videoid: "",
    video_title: "",
    video_duration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
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
        fetchData();
        setData({
          videoid: "",
          video_title: "",
          video_duration: "",
        });
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error adding video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        className="cursor-pointer border rounded-md bg-blue-50 p-2 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200 md:w-auto"
      >
        <div onClick={() => setOpen(true)}>
          {useIsMobile() ? <Plus className="h-5 w-5" /> : "Add Video"}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-2xl font-bold">Add Video</DialogHeader>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="w-full flex flex-col justify-center items-center">
            <div className="w-full flex justify-between items-center gap-3">
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
            </div>
            <div className="w-full flex flex-col gap-2 mb-3">
              <label className="text-sm font-bold text-gray-700">
                Video Duration
              </label>
              <TimePicker
                value={data.video_duration}
                onChange={(time) => {
                  setData((prev) => ({
                    ...prev,
                    video_duration: time,
                  }));
                }}
              />
            </div>
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
          </div>
        </div>
        <DialogFooter className="flex flex-col gap-4 mt-5">
          <button
            disabled={loading}
            onClick={() => !loading && setOpen(false)}
            className="border rounded-md bg-red-50 py-2 px-4 text-sm font-semibold hover:bg-red-100 border-red-200 text-black w-full disabled:opacity-50"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-blue-50 p-2 text-sm font-semibold hover:bg-blue-100 border-blue-200 text-black border w-full"
          >
            Add Video
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddVideo;
