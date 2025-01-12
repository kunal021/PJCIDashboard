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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import GetImageToUpload from "../images/GetImageToUpload";

const fetchDataDemoBook = async (setDoc) => {
  try {
    const formData = new FormData();
    formData.append("type", 3);
    const response = await axios.post(
      `${API_URL}/admin/docs/getdoc.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    setDoc(response.data.data);
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message || "Error while fetching data");
  }
};

function Add({ setBook }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({
    name: "",
    price: "",
    original_price: "",
    img_url: "",
    author: "",
    demo_book_id: "",
  });
  const [description, setDescription] = useState("");
  const [demoBook, setDemoBook] = useState([]);
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const imageURL = useSelector((state) => state.imageURL.imageURL);

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
      !imageURL ||
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
      console.log(newData);
      const formData = new FormData();

      formData.append("imgurl", imageURL);
      formData.append("name", newData.name);
      formData.append("type", "2");
      formData.append("author", newData.author);
      formData.append("price", newData.price);
      formData.append("original_price", newData.original_price);
      formData.append("description", description);
      formData.append("demo_book_id", newData.demo_book_id);

      const response = await axios.post(
        `${API_URL}/admin/book/addbook.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("Book Uploaded Successfully");
        setBook((prev) => [
          {
            id: response.data.id,
            name: newData.name,
            description: description,
            img_url: imageURL,
            author: newData.author,
            price: newData.price,
            original_price: newData.original_price,
            demo_book_id: newData.demo_book_id,
          },
          ...prev,
        ]);

        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error Uploading Book");
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
        <SheetHeader className="text-2xl font-bold items-center lg:text-left">
          Add Book
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
            <Tiptap placeholder={"Category"} getHtmlData={getDescriptionData} />
          </div>

          {/* Price, Original Price, and Author Fields */}
          <div className="w-full flex flex-col md:flex-row gap-4">
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
              placeholder={"Author"}
              name={"author"}
              value={newData.author}
              onChange={handleChange}
            >
              Author
            </FormField>
          </div>

          {/* Image Upload and Preview */}
          <div className="w-full flex flex-col md:flex-row gap-4 items-center">
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
                className="w-full md:w-60 h-36 rounded-lg m-auto object-cover"
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

          {/* Demo Book Dropdown */}
          <div className="w-full">
            <select
              value={newData.demo_book_id || ""}
              onChange={(e) =>
                setNewData({ ...newData, demo_book_id: e.target.value })
              }
              className="w-full h-fit py-2 px-3 border rounded-md border-gray-300"
            >
              <option value={""}>Select Demo Book</option>
              {demoBook?.map((item, idx) => (
                <option key={idx} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
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
            disabled={loading}
            onClick={() => setOpen(false)}
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
