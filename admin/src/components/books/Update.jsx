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
import Tiptap from "@/utils/TextEditor";
import axios from "axios";
import { Loader, SquarePen, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const fetchDataDemoBook = async (setDoc) => {
  try {
    const formData = new FormData();
    // formData.append("page", currentPage);
    // formData.append("limit", 10);
    formData.append("type", 3);
    const response = await axios.post(
      `${API_URL}/admin/docs/getdoc.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    // console.log(response);
    setDoc(response.data.data);
    // setPaginationData(response.data.pagination);
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message || "Error while fetching data");
  }
};

function Update({ data, setData }) {
  const id = data?.id;
  const closeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    id: data?.id,
    name: data?.name,
    price: data?.price,
    original_price: data?.original_price,
    img_url: data?.img_url,
    author: data?.author,
    demo_book_id: data?.demo_book_id,
  });
  const [description, setDescription] = useState(data?.description);

  const [demoBook, setDemoBook] = useState([]);

  useEffect(() => {
    fetchDataDemoBook(setDemoBook);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !newData.img_url ||
      !newData.price ||
      !newData.original_price ||
      !newData.name ||
      !newData.author ||
      !newData.demo_book_id ||
      !description
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
      formData.append("id", id);
      formData.append("imgurl", newData.img_url);
      formData.append("name", newData.name);
      formData.append("author", newData.author);
      formData.append("price", newData.price);
      formData.append("original_price", newData.original_price);
      formData.append("description", description);
      formData.append("demo_book_id", newData.demo_book_id);
      const response = await axios.post(
        `${API_URL}/admin/book/updatebook.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Book Updated Successfully");

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
      toast.error(error?.response?.data?.message || "Error updating Book");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        `${API_URL}/admin/courses/uplodecourseimage.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      // console.log(response.data);
      if (response.status === 200) {
        setNewData((prev) => ({ ...prev, img_url: response.data.url }));
        toast.success("Image Uploaded Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image");
    }
  };

  const getDescriptionData = (html) => {
    setDescription(html);
  };

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
          <SheetTitle>Edit Book</SheetTitle>
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
        <div className="my-4 gap-5 flex justify-between items-center">
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
        <div className=" w-full my-2">
          <Tiptap
            placeholder={"Category"}
            getHtmlData={getDescriptionData}
            initialContent={description}
          />
        </div>
        <div className="my-4 gap-5 flex justify-between items-center">
          <FormField
            htmlFor={"price"}
            id={"price"}
            type={"text"}
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
            htmlFor={"author"}
            id={"author"}
            type={"text"}
            placeholder={"Duration"}
            name={"author"}
            value={newData.author}
            onChange={handleChange}
          >
            Duration
          </FormField>
        </div>
        <div className="my-4 flex justify-between items-center">
          <input
            disabled={loading}
            id="fileinput"
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            className="hidden"
          />
          <label
            htmlFor="fileinput"
            className="flex flex-col justify-center items-center w-60 h-36 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
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
          {newData.img_url ? (
            <img
              src={newData.img_url}
              alt="image"
              className="w-60 h-36 rounded-lg m-auto"
            />
          ) : (
            <div className="rounded-lg border-2 border-gray-300 border-dashed h-36 w-60 text-center items-center m-auto">
              Preview
            </div>
          )}
        </div>
        <FormField
          htmlFor={"img_url"}
          id={"img_url"}
          type={"text"}
          placeholder={"Image Url"}
          name={"img_url"}
          value={newData.img_url}
          onChange={handleChange}
        >
          Image Url
        </FormField>
        <select
          value={newData.demo_book_id || ""}
          onChange={(e) =>
            setNewData({ ...newData, demo_book_id: e.target.value })
          }
          className="w-full h-fit mt-2.5 py-1.5 px-1 flex justify-center items-center border rounded-md border-gray-300"
        >
          <option value={""}>Select Demo Book</option>
          {demoBook?.map((item, idx) => (
            <option key={idx} value={item.id}>
              {item.name}
            </option>
          ))}
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

export default Update;
