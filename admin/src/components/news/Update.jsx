/* eslint-disable react/prop-types */
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { API_URL } from "@/url";
import FormField from "@/utils/FormField";
import Tiptap from "@/utils/TextEditor";
import axios from "axios";
import { Loader, SquarePen, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const fetchData = async (setLoading, setNews) => {
  try {
    setLoading(true);
    const response = await axios.post(`${API_URL}/admin/news/getallnews.php`);
    setNews(response.data.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function Update({ data, setData, onClose }) {
  const id = data?.id;
  const closeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    id: data?.id,
    category: data?.category,
    author: data?.author,
    img_url: data?.img_url,
    title: data?.title,
  });
  const [content, setContent] = useState(data?.content);

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
      !newData.author ||
      !newData.category ||
      !newData.title ||
      !content
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("id", id);
      formData.append("img_url", newData.img_url);
      formData.append("author", newData.author);
      formData.append("category", newData.category);
      formData.append("title", newData.title);
      formData.append("content", content);
      const response = await axios.post(
        `${API_URL}/admin/news/updatenews.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("Document Updated Successfully");
        fetchData(setLoading, setData);

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

      if (response.status === 200) {
        setNewData((prev) => ({ ...prev, img_url: response.data.url }));
        toast.success("Image Uploaded Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image");
    }
  };

  const getContentData = (html) => {
    setContent(html);
  };

  return (
    <Sheet open onOpenChange={onClose}>
      <SheetTrigger className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 text-xs rounded group relative">
        <SquarePen />
        <p className="absolute -left-[20%] -top-full mt-1 hidden group-hover:block bg-white/50 text-black rounded p-1">
          Update
        </p>
      </SheetTrigger>
      <SheetContent className="z-[100] w-full sm:w-[70%] overflow-auto">
        <SheetHeader className="text-2xl font-bold text-center lg:text-left">
          Edit News
        </SheetHeader>

        <div className="w-full flex flex-col gap-4">
          {/* Title Field */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <FormField
              htmlFor="title"
              id="title"
              type="text"
              placeholder="Title"
              name="title"
              value={newData.title}
              onChange={handleChange}
            >
              Title
            </FormField>
          </div>

          {/* Content Field */}
          <p className="block text-gray-700 text-sm font-bold">Content</p>
          <div className="w-full my-2">
            <Tiptap
              placeholder="Content"
              getHtmlData={getContentData}
              initialContent={content}
            />
          </div>

          {/* Author and Category Fields */}
          <div className="my-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <FormField
              htmlFor="author"
              id="author"
              type="text"
              placeholder="Author"
              name="author"
              value={newData.author}
              onChange={handleChange}
            >
              Author
            </FormField>
            <FormField
              htmlFor="category"
              id="category"
              type="text"
              placeholder="Category"
              name="category"
              value={newData.category}
              onChange={handleChange}
            >
              Category
            </FormField>
          </div>

          {/* File Upload Section */}
          <div className="my-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
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
              className="flex flex-col justify-center items-center w-full sm:w-60 h-36 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
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
                className="w-full sm:w-60 h-36 rounded-lg"
              />
            ) : (
              <div className="w-full sm:w-60 h-36 rounded-lg border-2 border-gray-300 border-dashed flex justify-center items-center">
                Preview
              </div>
            )}
          </div>

          {/* Image URL Field */}
          <FormField
            htmlFor="img_url"
            id="img_url"
            type="text"
            placeholder="Image Url"
            name="img_url"
            value={newData.img_url}
            onChange={handleChange}
          >
            Image Url
          </FormField>
        </div>

        <SheetFooter className="flex w-full gap-4 mt-4">
          <button
            ref={closeRef}
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
            Update
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default Update;
