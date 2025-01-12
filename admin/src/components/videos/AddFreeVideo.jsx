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

function AddFreeVideo({ fetchData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    video_id: "",
    video_title: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async () => {
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

      if (response.status === 201) {
        fetchData();
        toast.success("Video Added Successfully");
        setData({
          video_id: "",
          video_title: "",
        });
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message || "Error adding video");
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
        <DialogHeader className="text-2xl font-bold">
          Add Free Video
        </DialogHeader>
        <div className="flex flex-col justify-center items-center w-full">
          <div className="w-full flex flex-col justify-center items-center">
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
            Add Free Video
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddFreeVideo;
