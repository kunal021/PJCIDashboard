/* eslint-disable react/prop-types */
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { API_URL } from "@/url";
import FormField from "@/utils/FormField";
// import Tiptap from "@/utils/TextEditor";
import axios from "axios";
import { Loader, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

function Add({ setDoc }) {
  const closeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    name: "",
    // price: "",
    // type: "",
    // img_url: "",
    duration: "",
    download: "",
  });

  const [file, setFile] = useState(null);
  const [durationUnit, setDurationunit] = useState("Day");
  // const [description, setDescription] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
  };

  const handleSubmit = async () => {
    if (
      // !newData.img_url ||
      // !newData.price ||
      !newData.name ||
      !newData.duration ||
      !file ||
      !newData.download
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();

      // formData.append("image_url", newData.img_url);
      formData.append("name", newData.name);
      // formData.append("description", description);
      formData.append("type", "2");
      formData.append("duration", `${newData.duration} ${durationUnit}`);
      // formData.append("price", newData.price);
      formData.append("file", file);
      formData.append("download", newData.download);
      const response = await axios.post(
        `${API_URL}/admin/docs/uplodedoc.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      // console.log(response);
      if (response.status === 200) {
        toast.success("Document Uploaded Successfully");

        setDoc((prev) => [
          ...prev,
          {
            id: response.data.id,
            name: newData.name,
            // price: newData.price,
            type: "1",
            // img_url: newData.img_url,
            duration: newData.duration,
            download: newData.download,
          },
        ]);

        if (closeRef.current) {
          closeRef.current.click();
        }

        setNewData({
          name: "",
          // price: "",
          // img_url: "",
          duration: "",
          download: "",
        });

        setDurationunit("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error Uploading Document");
    } finally {
      setLoading(false);
    }
  };

  // const handleUploadImage = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;
  //   try {
  //     const formData = new FormData();
  //     formData.append("image", file);
  //     const response = await axios.post(
  //       `${API_URL}/admin/courses/uplodecourseimage.php`,
  //       formData,
  //       { headers: { "content-type": "multipart/form-data" } }
  //     );

  //     // console.log(response.data);
  //     if (response.status === 200) {
  //       setNewData((prev) => ({ ...prev, img_url: response.data.url }));
  //       toast.success("Image Uploaded Successfully");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Error Uploading Image");
  //   }
  // };

  // const getDescriptionData = (html) => {
  //   setDescription(html);
  // };

  return (
    <Sheet>
      <SheetTrigger className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md ">
        Add
      </SheetTrigger>
      <SheetContent className="z-[100] w-[70%] overflow-auto">
        <SheetHeader>
          <SheetTitle>Add Document</SheetTitle>
        </SheetHeader>

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
        {/* <p className="block text-gray-700 text-sm font-bold">Description</p>
        <div className=" w-full my-2">
          <Tiptap placeholder={"Category"} getHtmlData={getDescriptionData} />
        </div> */}
        <div className="my-4 gap-5 flex justify-between items-center">
          {/* <FormField
            htmlFor={"price"}
            id={"price"}
            type={"number"}
            placeholder={"Price"}
            name={"price"}
            value={newData.price}
            onChange={handleChange}
          >
            Price
          </FormField> */}
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
            className="w-96 h-fit mt-2.5 py-1.5 px-1 flex justify-center items-center border rounded-md border-gray-300"
          >
            <option value={"Day"}>Day</option>
            <option value={"Month"}>Month</option>
            <option value={"Year"}>Year</option>
          </select>
        </div>
        <label
          htmlFor="download"
          className="block text-sm font-medium text-gray-700"
        >
          Downloadable
        </label>
        <select
          value={newData.download}
          id="download"
          name="download"
          onChange={handleChange}
          className="w-full md:w-1/4 py-2 px-3 border rounded-md border-gray-300"
        >
          <option value="0">NO</option>
          <option value="1">YES</option>
        </select>
        <div className="my-4 flex justify-between items-center">
          <input
            disabled={loading}
            id="pdfinput"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="pdfinput"
            className="flex flex-col justify-center items-center w-40 h-16 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
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
        </div>
        <div className="mt-[25px] flex w-full gap-2.5">
          <SheetClose ref={closeRef} asChild>
            <button
              disabled={loading}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-1/2"
            >
              Close
            </button>
          </SheetClose>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-1/2"
          >
            Add
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default Add;
