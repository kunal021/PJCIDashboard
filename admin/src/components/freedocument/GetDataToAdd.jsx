/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API_URL } from "@/url";
import Loader from "@/utils/Loader";
import { Avatar } from "antd";
import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getData = async (type, is_paid, setLoading, setData) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("type", type);
    formData.append("is_paid", is_paid);

    const response = await axios.post(
      `${API_URL}/admin/docs/getdoctoaddindirectory.php`,
      formData,
      { headers: "content-type/form-data" }
    );

    setData(response.data.data);
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message || "Error fetching data");
  } finally {
    setLoading(false);
  }
};

function GetDataToAdd({ directory_id, onContentAdded, contentType }) {
  const [loading, setLoading] = useState(false);
  const [material, setMaterial] = useState([]);

  useEffect(() => {
    getData(1, 2, setLoading, setMaterial);
  }, []);

  const handleAddDoc = async (id) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("directory_id", directory_id);
      formData.append("content_type", contentType);
      formData.append("content_id", id);

      const response = await axios.post(
        `${API_URL}/admin/directory/addcontentindirectory.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        toast.success("Document Uploaded Successfully");

        if (onContentAdded) {
          onContentAdded();
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error Uploading Document");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white text-center transition-all hover:border-primary">
        <div className="absolute inset-0 bg-primary/5 transition-opacity group-hover:opacity-100" />
        <div className="z-10 flex flex-col items-center justify-center space-y-2">
          <Plus className="h-8 w-8 text-gray-400 transition-colors group-hover:text-primary" />
          <span className="text-xs font-medium text-gray-500 transition-colors group-hover:text-primary">
            Add Content
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="h-[90%] z-[100] w-full md:min-w-[60%] overflow-y-auto">
        <DialogHeader className="text-2xl font-bold lg:text-left">
          Add Content
        </DialogHeader>
        {loading ? (
          <Loader className="w-full h-full" />
        ) : (
          <div className="w-full flex flex-col justify-center items-center p-4">
            {material.length > 0 ? (
              <div className="flex flex-col justify-center items-center w-full gap-6">
                {material.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col lg:flex-row justify-center items-center font-medium w-full lg:w-4/5 border rounded-md border-zinc-300 my-5 p-3 gap-4"
                  >
                    <div className="flex flex-col justify-center items-start gap-4 w-full">
                      {/* Top Section with Avatar */}
                      <div className="flex justify-between items-center w-full gap-4">
                        <Avatar className="bg-gray-500 text-white">
                          {idx + 1}
                        </Avatar>
                        <button
                          onClick={() => handleAddDoc(item.id)}
                          className="rounded-full bg-green-200 p-2 items-center hover:bg-green-300 transition"
                        >
                          <Plus />
                        </button>
                      </div>

                      <hr className="w-full text-center m-auto bg-slate-300 border-slate-300" />

                      {/* Image and Name */}
                      <div className="cursor-pointer flex flex-col md:flex-row justify-between items-center w-full gap-6">
                        <div className="flex justify-center items-center w-full md:w-48">
                          <img
                            src={item.img_url}
                            alt={item.name}
                            className="rounded-lg border-transparent h-24 w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-wrap text-wrap w-full text-center md:text-left">
                          {item.name}
                        </div>
                      </div>

                      <hr className="w-full text-center m-auto bg-slate-300 border-slate-300" />

                      {/* Price and Duration */}
                      <div className="cursor-pointer flex flex-wrap justify-between items-center w-full gap-6">
                        <div className="flex justify-center items-center">
                          Price: {item.price}
                        </div>
                        <div className="flex justify-center items-center">
                          Duration: {item.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-2xl font-bold text-center mt-20">
                No Data Available
              </div>
            )}
          </div>
        )}

        <DialogClose className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-full">
          Close
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default GetDataToAdd;
