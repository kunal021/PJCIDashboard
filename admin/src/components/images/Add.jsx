/* eslint-disable react/prop-types */
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { Loader, Plus, UploadCloud } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/url";
import toast from "react-hot-toast";
import FormField from "@/utils/FormField";

function Add({ fetchData }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [tags, setTags] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    setFile(file);
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
  };

  const resetForm = () => {
    setFile(null);
    setPreview("");
    setTags("");
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select an image");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      formData.append("tags", tags);
      const response = await axios.post(
        `${API_URL}/admin/images/uploadimage.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        fetchData();
        resetForm();
        toast.success("Image Uploaded Successfully");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      setOpen;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger
        asChild
        className="cursor-pointer border rounded-md bg-blue-50 p-2 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200 md:w-auto"
      >
        <div onClick={() => setOpen(true)}>
          {useIsMobile() ? <Plus className="h-5 w-5" /> : "Add Image"}
        </div>
      </DialogTrigger>
      <DialogContent className="z-[100] max-h-[90vh] overflow-auto">
        <DialogHeader className="text-2xl font-bold">Add Image</DialogHeader>
        {/* <div className="flex flex-col justify-center items-center"> */}
        <div className="flex flex-wrap justify-between items-center w-full">
          <div className="my-4 flex flex-col items-center md:flex-row gap-5 w-full">
            <input
              id="fileinput"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label
              htmlFor="fileinput"
              className="flex flex-col justify-center items-center w-full max-w-xs h-36 cursor-pointer bg-gray-50 text-black rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
            >
              {!loading ? (
                <>
                  <UploadCloud />
                  <p>Upload Image</p>
                </>
              ) : (
                <>
                  <Loader className="animate-spin h-6 w-6" />
                  <p>Uploading...</p>
                </>
              )}
            </label>
            {preview ? (
              <img
                src={preview}
                alt="image"
                className="w-full max-w-xs h-36 rounded-lg"
              />
            ) : (
              <div className="rounded-lg border-2 border-gray-300 border-dashed h-36 w-full max-w-xs flex justify-center items-center">
                Preview
              </div>
            )}
          </div>
          <FormField
            label="Tags"
            value={tags}
            setValue={setTags}
            id={"tags"}
            name={"tags"}
            placeholder={"Tags (Comma , Separated)"}
            onChange={(e) => setTags(e.target.value)}
          >
            Tags
          </FormField>
        </div>
        {/* </div> */}
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
            Add Image
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Add;
