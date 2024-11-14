/* eslint-disable react/prop-types */
import { FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import FormField from "@/utils/FormField";
import { useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "@/url";
import toast from "react-hot-toast";

function CreateDir({
  directoryType,
  parentId,
  contentType,
  directoryTypeId,
  setDirData,
}) {
  const [dirName, setDirName] = useState("");
  const [loading, setLoading] = useState(false);
  const closeRef = useRef(null);

  // console.log(parentId, directoryType, contentType, directoryTypeId, dirName);

  const handleCreate = async () => {
    if (!dirName) {
      toast.error("Please enter directory name");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("directory_name", dirName);
      formData.append("parent_id", parentId);
      formData.append("directory_type", directoryType);
      formData.append("content_type", contentType);
      formData.append("directory_type_id", directoryTypeId);
      const response = await axios.post(
        `${API_URL}/admin/directory/mkdir.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      // console.log(response);

      if (response.status === 201) {
        toast.success("Directory Created Successfully");
        setDirData((prev) => [
          ...prev,
          {
            id: response.data.directory_id,
            content_type: contentType,
            directory_name: dirName,
            directory_type: directoryType,
            directory_type_id: directoryTypeId,
            parent_id: parentId,
            has_subdirectories: "-1",
            is_active: "0",
            created_at: Date.now().toString(),
            updated_at: Date.now().toString(),
          },
        ]);
        setDirName("");
        closeRef.current?.click();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="group relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 bg-white text-center transition-all hover:border-primary hover:shadow-md">
        <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="z-10 flex flex-col items-center justify-center space-y-2">
          <FolderPlus
            strokeWidth={0.75}
            strokeDasharray={4}
            className="h-16 w-16 text-gray-400 transition-all group-hover:text-primary group-hover:stroke-[1]"
          />
          <span className="text-xs font-medium text-gray-500 transition-colors group-hover:text-primary">
            Add Folder
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="z-[100]">
        <DialogHeader>
          <DialogTitle>Create Directory</DialogTitle>
        </DialogHeader>
        <div>
          <FormField
            htmlFor={"dir_name"}
            name={"dir_name"}
            type={"text"}
            value={dirName}
            placeholder={"Enter Directory Name"}
            onChange={(e) => setDirName(e.target.value)}
          >
            Directory name
          </FormField>
        </div>
        <div className="mt-2 flex w-full gap-2.5">
          <DialogClose
            ref={closeRef}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            Close
          </DialogClose>
          <button
            disabled={loading}
            onClick={handleCreate}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDir;
