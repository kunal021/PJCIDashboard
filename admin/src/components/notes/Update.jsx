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
import { SquarePen } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

function UpdateDoc({ data, setData }) {
  const id = data?.id;
  const closeRef = useRef(null);
  const dur = data?.duration ? data?.duration.split(" ") : ["", ""];
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    id: data?.id,
    name: data?.name,
    // price: data?.price,
    type: data?.type,
    // img_url: data?.img_url,
    duration: dur[0],
    download: data?.download,
  });

  const [durationUnit, setDurationunit] = useState(dur[1]);

  // const [description, setDescription] = useState(data?.description);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      // !newData.img_url ||
      !newData.type ||
      // !newData.price ||
      !newData.name ||
      !newData.duration ||
      !newData.download
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("id", id);
      // formData.append("image_url", newData.img_url);
      formData.append("name", newData.name);
      formData.append("type", newData.type);
      // formData.append("description", description);
      formData.append("duration", `${newData.duration} ${durationUnit}`);
      // formData.append("price", newData.price);
      formData.append("download", newData.download);
      const response = await axios.post(
        `${API_URL}/admin/docs/updatedoc.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      // console.log(response);
      if (response.status === 200) {
        toast.success("Document Updated Successfully");

        setData((prevData) => {
          // Check if prevData is an array
          if (!Array.isArray(prevData)) {
            console.error("prevData is not an array");
            return prevData; // Return unchanged if it's not an array
          }

          // Update the specific object with matching id
          return prevData.map((item) =>
            item.id === id ? { ...item, ...newData } : item
          );
        });

        if (closeRef.current) {
          closeRef.current.click();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error updating Document");
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
      <SheetTrigger className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 text-xs rounded group relative">
        <SquarePen />
        <p className="absolute -left-[20%] -top-full mt-1 hidden group-hover:block bg-white/50 text-black rounded p-1">
          Update
        </p>
      </SheetTrigger>
      <SheetContent className="z-[100] w-[70%] overflow-auto">
        <SheetHeader>
          <SheetTitle>Edit Document</SheetTitle>
        </SheetHeader>
        {/* <div>
          <select
            name="type"
            value={data.type}
            onChange={handleChange}
            className="w-96 h-fit mt-2.5 py-1.5 px-1 flex justify-center items-center border rounded-md border-gray-300"
          >
            <option value={"0"}>None</option>
            <option value={"1"}>Course</option>
            <option value={"2"}>Batch</option>
            <option value={"3"}>Test</option>
          </select>
        </div> */}

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
          <Tiptap
            placeholder={"Category"}
            getHtmlData={getDescriptionData}
            initialContent={description}
          />
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
            Update
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default UpdateDoc;
