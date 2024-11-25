/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { API_URL } from "@/url";
import Loader from "@/utils/Loader";
import { Avatar } from "antd";
import axios from "axios";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getData = async (type, directory_id, setLoading, setData) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("content_type", type);
    formData.append("directory_id", directory_id);

    const response = await axios.post(
      `${API_URL}/admin/directory/getcontenttoaddindir.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    setData(response.data.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function renderContentItem(item, contentType) {
  switch (contentType) {
    case "4": // Video Content
      return (
        <div className="flex justify-between items-center w-full gap-6">
          <div className="flex flex-wrap text-wrap w-full">
            <span className="text-lg font-medium">{item.video_title}</span>
          </div>
          <div className="flex justify-center items-center">
            Duration: {item.video_duration}
          </div>
        </div>
      );

    case "5": // Document Content
      return (
        <>
          <div className="cursor-pointer flex justify-between items-center w-full gap-6">
            <div className="flex justify-center items-center w-48">
              <img
                src={item.img_url}
                alt={item.name}
                className="rounded-lg border-transparent h-24 w-full"
              />
            </div>
            <div className="flex flex-wrap text-wrap w-full">{item.name}</div>
          </div>
          <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
          <div className="cursor-pointer flex justify-between items-center w-full gap-6">
            <div className="flex justify-center items-center">
              Price: {item.price}
            </div>
            <div className="flex justify-center items-center">
              Duration: {item.duration}
            </div>
          </div>
        </>
      );

    case "6": // Note Content
      return (
        <>
          <div className="cursor-pointer flex justify-between items-center w-full gap-6">
            <div className="flex justify-center items-center w-48">
              <img
                src={item.img_url}
                alt={item.name}
                className="rounded-lg border-transparent h-24 w-full"
              />
            </div>
            <div className="flex flex-wrap text-wrap w-full">{item.name}</div>
          </div>
          <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
          <div className="cursor-pointer flex justify-between items-center w-full gap-6">
            <div className="flex justify-center items-center">
              Price: {item.price}
            </div>
            <div className="flex justify-center items-center">
              Duration: {item.duration}
            </div>
          </div>
        </>
      );

    case "3": // Test Content
      return (
        <>
          <div className="cursor-pointer flex justify-between items-center w-full gap-6">
            <div className="flex flex-wrap text-wrap w-full">
              <span className="text-lg font-medium">{item.test_name}</span>
            </div>
          </div>
          <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
          <div className="cursor-pointer flex justify-between items-center w-full gap-6">
            <div className="flex justify-center items-center">
              Price: {item.price}
            </div>
            <div className="flex justify-center items-center">
              Duration: {item.duration}
            </div>
            <div className="flex justify-center items-center">
              Questions: {item.number_of_questions}
            </div>
          </div>
        </>
      );

    default:
      return <div className="text-gray-500">Unknown content type</div>;
  }
}

function GetDataToAdd({
  directory_id,
  onContentAdded,
  contentType,
  isOpen,
  onOpenChange,
}) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState([]);
  const [hasAddedContent, setHasAddedContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getData(contentType, directory_id, setLoading, setContent);
      setHasAddedContent(false); // Reset the flag when dialog opens
    }
  }, [contentType, directory_id, isOpen]);

  const handleDialogClose = () => {
    if (hasAddedContent && onContentAdded) {
      onContentAdded();
    }
    onOpenChange(false);
    setHasAddedContent(false);
  };

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
        toast.success("Content added successfully");
        getData(contentType, directory_id, setLoading, setContent);
        setHasAddedContent(true); // Set flag when content is successfully added
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error adding content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        onClick={() => onOpenChange(true)}
        className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white text-center transition-all hover:border-primary"
      >
        <div className="absolute inset-0 bg-primary/5 transition-opacity group-hover:opacity-100" />
        <div className="z-10 flex flex-col items-center justify-center space-y-2">
          <Plus className="h-8 w-8 text-gray-400 transition-colors group-hover:text-primary" />
          <span className="text-xs font-medium text-gray-500 transition-colors group-hover:text-primary">
            Add Content
          </span>
        </div>
      </DialogTrigger>
      <DialogContent
        onCloseCallback={handleDialogClose}
        className="h-[90%] z-[100] min-w-[60%] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>Add Content</DialogTitle>
        </DialogHeader>
        {loading ? (
          <Loader className="w-full h-full" />
        ) : (
          <div className="w-full flex flex-col justify-center items-center">
            {content.length > 0 ? (
              content.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                >
                  <div className="flex flex-col justify-center items-start gap-4 w-full">
                    <div className="flex justify-between items-center w-full gap-4">
                      <Avatar className="bg-gray-500 text-white">
                        {idx + 1}
                      </Avatar>
                    </div>
                    <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                    {renderContentItem(item, contentType)}
                  </div>
                  <button
                    onClick={() => handleAddDoc(item.id || item.test_id)}
                    className="rounded-full bg-green-200 p-1 items-center"
                  >
                    <Plus />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-2xl font-bold text-center mt-20">
                No Data Available
              </div>
            )}
          </div>
        )}
        <DialogClose
          onClick={handleDialogClose}
          className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-full"
        >
          Close
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default GetDataToAdd;
