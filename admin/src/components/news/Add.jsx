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
import { Loader, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

const fetchData = async (
  setLoading,
  //   currentPage,
  setNews
  //   setPaginationData
) => {
  try {
    setLoading(true);
    // const formData = new FormData();
    // formData.append("page", currentPage);
    // formData.append("limit", 10);
    // formData.append("type", 2);
    const response = await axios.post(
      `${API_URL}/admin/news/getallnews.php`
      //   formData,
      //   { headers: "content-type/form-data" }
    );
    setNews(response.data.data);
    // setPaginationData(response.data.pagination);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function Add({ setNews }) {
  const closeRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    category: "",
    img_url: "",
    author: "",
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
      !newData.category ||
      !newData.author ||
      !title ||
      !content
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      console.log(newData);
      setLoading(true);
      const formData = new FormData();

      formData.append("img_url", newData.img_url);
      formData.append("author", newData.author);
      formData.append("category", newData.category);
      formData.append("content", content);
      formData.append("title", title);

      const response = await axios.post(
        `${API_URL}/admin/news/addnews.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      // console.log(response);
      if (response.status === 201) {
        toast.success("News Uploaded Successfully");

        fetchData(setLoading, setNews);

        if (closeRef.current) {
          closeRef.current.click();
        }

        setNewData({
          author: "",
          img_url: "",
          category: "",
        });
        setTitle("");
        setContent("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error Uploading Document");
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

  const getContentData = (html) => {
    setContent(html);
  };
  const getTitleData = (html) => {
    setTitle(html);
  };

  return (
    <Sheet>
      <SheetTrigger className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md ">
        Add
      </SheetTrigger>
      <SheetContent className="z-[100] w-[70%] overflow-auto">
        <SheetHeader>
          <SheetTitle>Add News</SheetTitle>
        </SheetHeader>

        <p className="block text-gray-700 text-sm font-bold">Title</p>
        <div className=" w-full my-2">
          <Tiptap placeholder={"Title"} getHtmlData={getTitleData} />
        </div>
        <p className="block text-gray-700 text-sm font-bold">Content</p>
        <div className=" w-full my-2">
          <Tiptap placeholder={"Content"} getHtmlData={getContentData} />
        </div>
        <div className="my-4 gap-5 flex justify-between items-center">
          <FormField
            htmlFor={"author"}
            id={"author"}
            type={"text"}
            placeholder={"Author"}
            name={"author"}
            value={newData.author}
            onChange={handleChange}
          >
            Author
          </FormField>
          <FormField
            htmlFor={"category"}
            id={"category"}
            type={"text"}
            placeholder={"Category"}
            name={"category"}
            value={newData.category}
            onChange={handleChange}
          >
            Category
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
