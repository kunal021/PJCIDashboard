/* eslint-disable react/prop-types */
import GetImageToUpload from "@/components/images/GetImageToUpload";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { setImageURL } from "@/redux/image/imageURLSlice";
import { API_URL } from "@/url";
import FormField from "@/utils/FormField";
import Tiptap from "@/utils/TextEditor";
import UpdateBtn from "@/utils/UpdateBtn";
import axios from "axios";
import { Loader, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

function Update({ data, setData }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newData, setNewData] = useState({});
  const [durationUnit, setDurationunit] = useState("");
  const [description, setDescription] = useState("");
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const imageURL = useSelector((state) => state.imageURL.imageURL);

  useEffect(() => {
    if (open) {
      const dur = data?.duration ? data?.duration.split(" ") : ["", ""];
      setNewData({
        id: data?.id,
        name: data?.name,
        price: data?.price,
        original_price: data?.original_price,
        type: data?.type,
        img_url: data?.img_url,
        duration: dur[0],
      });
      setDescription(data?.description);
      setDurationunit(dur[1]);
      dispatch(setImageURL(data?.img_url));
    }
  }, [data, dispatch, open]);

  useEffect(() => {
    if (!open) {
      setNewData({});
      setDescription("");
      dispatch(setImageURL(""));
    }
  }, [dispatch, open]);

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
      !newData.type ||
      !newData.price ||
      !newData.original_price ||
      !description ||
      !newData.name ||
      !newData.duration ||
      !durationUnit
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
      formData.append("id", newData.id);
      formData.append("image_url", imageURL);
      formData.append("name", newData.name);
      formData.append("description", description);
      formData.append("type", newData.type);
      formData.append("duration", `${newData.duration} ${durationUnit}`);
      formData.append("price", newData.price);
      formData.append("original_price", newData.original_price);
      const response = await axios.post(
        `${API_URL}/admin/docs/updatedoc.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("Document Updated Successfully");

        setData((prevData) => {
          if (!Array.isArray(prevData)) {
            console.error("prevData is not an array");
            return prevData;
          }

          return prevData.map((item) =>
            item.id === newData.id
              ? { ...item, ...newData, img_url: imageURL }
              : item
          );
        });

        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error updating Document");
    } finally {
      setLoading(false);
    }
  };

  const getDescriptionData = (html) => {
    setDescription(html);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div onClick={() => setOpen(true)}>
          <UpdateBtn />
        </div>
      </SheetTrigger>
      <SheetContent className="z-[100] w-full md:w-[50%] overflow-auto">
        <SheetHeader className="text-2xl font-bold text-center sm:text-left">
          Update Document
        </SheetHeader>

        <div className="space-y-4">
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

          <p className="block text-gray-700 text-sm font-bold">Description</p>
          <div className="w-full my-2">
            <Tiptap
              placeholder={"Category"}
              getHtmlData={getDescriptionData}
              initialContent={description}
            />
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
              onChange={(e) => setDurationunit(e.target.value)}
              className="w-full mt-2.5 py-1.5 px-2 border rounded-md border-gray-300"
            >
              <option value={"Day"}>Day</option>
              <option value={"Month"}>Month</option>
              <option value={"Year"}>Year</option>
            </select>
          </div>

          <div className="my-4 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div
              onClick={() => setIsUploadImageOpen(true)}
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
            </div>
            {imageURL ? (
              <img
                src={imageURL}
                alt="image"
                className="w-full sm:w-60 h-36 rounded-lg m-auto"
              />
            ) : (
              <div className="rounded-lg border-2 border-gray-300 border-dashed h-36 w-full sm:w-60 text-center flex justify-center items-center m-auto">
                Preview
              </div>
            )}
          </div>
          <GetImageToUpload
            isOpen={isUploadImageOpen}
            onClose={() => setIsUploadImageOpen(false)}
          />
        </div>

        <SheetFooter className="flex w-full gap-4 mt-4">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            Update
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

export default Update;