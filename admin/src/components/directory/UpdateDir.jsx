/* eslint-disable react/prop-types */
import { Pen } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import FormField from "@/utils/FormField";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/url";
import toast from "react-hot-toast";

function UpdateDir({
  name,
  type,
  directoryType,
  parentId,
  contentType,
  directoryTypeId,
  id,
}) {
  const [dirName, setDirName] = useState(name);
  const [loading, setLoading] = useState(false);

  //   console.log(parentId, directoryType, contentType, directoryTypeId, dirName);
  //   console.log(name, id);

  const handleUpdate = async () => {
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
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/directory/updatedir.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      console.log(response);

      if (response.status === 201) {
        type === "directory" && toast.success("Directory Updated Successfully");
        setDirName("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Pen className="cursor-pointer w-5 h-5 text-blue-500" />
      </DialogTrigger>
      <DialogContent className="z-[100]">
        <DialogHeader>
          <DialogTitle>
            {type === "directory" && "Update Directory"}
          </DialogTitle>
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
            Directory Name
          </FormField>
        </div>
        <div className="mt-2 flex w-full gap-2.5">
          <DialogClose className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-full">
            Close
          </DialogClose>
          <button
            disabled={loading}
            onClick={handleUpdate}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateDir;
