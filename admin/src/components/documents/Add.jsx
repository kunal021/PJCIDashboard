/* eslint-disable react/prop-types */
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
import GetImageToUpload from "../images/GetImageToUpload";
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
  const imageURL = useSelector((state) => state.imageURL.imageURL);

  const [file, setFile] = useState(null);
  const [durationUnit, setDurationUnit] = useState("Day");
  const [description, setDescription] = useState("");

  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);

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
      formData.append("type", "1");
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
        setNewData({
          name: "",
          price: "",
          original_price: "",
          description: "",
          duration: "",
        });

        setDurationUnit("");
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
        <button type="button" onClick={() => setOpen(true)}>
          {useIsMobile() ? <Plus className="w-5 h-5" /> : "Add"}
        </button>
      </SheetTrigger>
      <SheetContent className="z-[100] w-full sm:w-[70%] overflow-auto">
        <SheetHeader className="text-2xl font-bold text-center sm:text-left">
          Add Document
        </SheetHeader>

        <div className="w-full flex flex-col space-y-4">
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

          <p className="block text-gray-700 text-sm font-bold">Description</p>
          <div className="w-full my-2">
            <Tiptap placeholder={"Category"} getHtmlData={getDescriptionData} />
          </div>

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
              onChange={(e) => setDurationUnit(e.target.value)}
              className="w-full md:w-1/4 py-2 px-3 border rounded-md border-gray-300"
            >
              <option value={"Day"}>Day</option>
              <option value={"Month"}>Month</option>
              <option value={"Year"}>Year</option>
            </select>
          </div>

          <div className="w-full md:max-w-2xl">
            <div className="my-4 flex flex-col md:flex-row gap-4">
              <button
                type="button"
                onClick={() => setIsUploadImageOpen(true)}
                className="flex flex-col justify-center items-center w-full h-48 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
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
              </button>
              {imageURL ? (
                <img
                  src={imageURL}
                  alt="Document preview"
                  className="w-full h-48 rounded-lg mt-2"
                />
              ) : (
                <div className="rounded-lg border-2 border-gray-300 border-dashed h-48 w-full text-center flex justify-center items-center">
                  Preview
                </div>
              )}
            </div>
          </div>

          <GetImageToUpload
            isOpen={isUploadImageOpen}
            onClose={() => setIsUploadImageOpen(false)}
          />

          <div className="my-4 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <input
              disabled={loading}
              id="pdfinput"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <div>File Already Uploaded</div>
            ) : (
              <label
                htmlFor="pdfinput"
                className="flex flex-col justify-center items-center w-full md:w-1/3 h-16 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
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
            onClick={() => setOpen(false)}
            disabled={loading}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            Close
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            Add
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default Add;
