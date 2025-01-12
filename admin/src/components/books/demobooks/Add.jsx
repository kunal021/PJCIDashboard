/* eslint-disable react/prop-types */
import GetImageToUpload from "@/components/images/GetImageToUpload";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { API_URL } from "@/url";
import FormField from "@/utils/FormField";
import Tiptap from "@/utils/TextEditor";
import axios from "axios";
import { Loader, Plus, UploadCloud } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function Add({ setDoc }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    name: "",
    price: "",
    original_price: "",
    img_url: "",
    duration: "",
  });

  const [file, setFile] = useState(null);
  const [durationUnit, setDurationunit] = useState("Day");
  const [description, setDescription] = useState("");
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const imageURL = useSelector((state) => state.imageURL.imageURL);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    try {
      setLoading(true);
      const file = e.target.files[0];
      setFile(file);
      toast.success("File Selected");
    } catch {
      console.log("error");
      toast.error("Error Uploading File");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !imageURL ||
      !newData.price ||
      !newData.original_price ||
      !durationUnit ||
      !description ||
      !newData.name ||
      !newData.duration ||
      !file
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (Number(newData.original_price) < Number(newData.price)) {
      toast.error("Price must be smaller than original price");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("image_url", imageURL);
      formData.append("name", newData.name);
      formData.append("description", description);
      formData.append("type", "3");
      formData.append("duration", `${newData.duration} ${durationUnit}`);
      formData.append("price", newData.price);
      formData.append("original_price", newData.original_price);
      formData.append("file", file);
      const response = await axios.post(
        `${API_URL}/admin/docs/uplodedoc.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("Document Uploaded Successfully");

        setDoc((prev) => [
          {
            id: response.data.id,
            name: newData.name,
            price: newData.price,
            original_price: newData.original_price,
            type: "1",
            img_url: imageURL,
            duration: newData.duration,
          },
          ...prev,
        ]);

        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error Uploading Document");
    } finally {
      setLoading(false);
    }
  };

  const getDescriptionData = (html) => {
    setDescription(html);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        asChild
        className="cursor-pointer bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md "
      >
        <div onClick={() => setOpen(true)}>
          {useIsMobile() ? <Plus className="w-5 h-5" /> : "Add"}
        </div>
      </SheetTrigger>
      <SheetContent className="z-[100] w-full md:w-[50%] overflow-auto">
        <SheetHeader className="text-2xl text-center font-bold lg:text-left">
          Add Demo Book
        </SheetHeader>

        <div className="w-full flex flex-col gap-6">
          {/* Name Field */}
          <div className="w-full">
            <FormField
              htmlFor={"name"}
              id={"name"}
              type={"text"}
              placeholder={"Name"}
              name={"name"}
              value={newData.name}
              onChange={handleChange}
            >
              Name
            </FormField>
          </div>

          {/* Description */}
          <p className="block text-gray-700 text-sm font-bold">Description</p>
          <div className="w-full">
            <Tiptap
              placeholder={"Description"}
              getHtmlData={getDescriptionData}
            />
          </div>

          {/* Price, Original Price, and Duration Fields */}
          <div className="flex flex-col justify-center items-center md:flex-row md:space-x-6">
            <FormField
              htmlFor={"price"}
              id={"price"}
              type={"number"}
              placeholder={"Price"}
              name={"price"}
              value={newData.price}
              onChange={handleChange}
            >
              Price
            </FormField>
            <FormField
              htmlFor={"original_price"}
              id={"original_price"}
              type={"number"}
              placeholder={"Original Price"}
              name={"original_price"}
              value={newData.original_price}
              onChange={handleChange}
            >
              Original Price
            </FormField>
            <FormField
              htmlFor={"duration"}
              id={"duration"}
              type={"number"}
              placeholder={"Duration"}
              name={"duration"}
              value={newData.duration}
              onChange={handleChange}
            >
              Duration
            </FormField>
            <select
              value={durationUnit}
              onChange={(e) => setDurationunit(e.target.value)}
              className="w-full mt-2.5 py-1.5 px-2 border rounded-md border-gray-300"
            >
              <option value={"Day"}>Day</option>
              <option value={"Month"}>Month</option>
              <option value={"Year"}>Year</option>
            </select>
          </div>

          {/* Image Upload and Preview */}
          <div className="w-full flex flex-col md:flex-row items-center gap-4">
            <div
              onClick={() => setIsUploadImageOpen(true)}
              className="flex flex-col justify-center items-center w-full md:w-60 h-36 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
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
            </div>
            {imageURL ? (
              <img
                src={imageURL}
                alt="Preview"
                className="w-full md:w-60 h-36 rounded-lg object-cover"
              />
            ) : (
              <div className="rounded-lg border-2 border-gray-300 border-dashed h-36 w-full md:w-60 flex justify-center items-center">
                Preview
              </div>
            )}
          </div>

          <GetImageToUpload
            isOpen={isUploadImageOpen}
            onClose={() => setIsUploadImageOpen(false)}
          />

          {/* PDF Upload */}
          <div className="w-full flex flex-col md:flex-row items-center gap-4">
            <input
              disabled={loading}
              id="pdfinput"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div>File Already Selected</div>
            ) : (
              <label
                htmlFor="pdfinput"
                className="flex flex-col justify-center items-center w-full md:w-40 h-16 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
              >
                {!loading ? (
                  <>
                    <UploadCloud />
                    <p>Upload File</p>
                  </>
                ) : (
                  <>
                    <Loader className="animate-spin h-6 w-6" />
                    <p>Uploading...</p>
                  </>
                )}
              </label>
            )}
          </div>
        </div>

        <SheetFooter className="flex w-full gap-4 mt-4">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            Add
          </button>
          <button
            onClick={() => setOpen(false)}
            disabled={loading}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            Close
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default Add;
