/* eslint-disable react/prop-types */
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import FormField from "@/utils/FormField";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "@/url";
import toast from "react-hot-toast";

function UpdateDir({
  name,
  directoryType,
  parentId,
  contentType,
  // directoryTypeId,
  id,
  onClose,
}) {
  const [dirName, setDirName] = useState(name);
  const [loading, setLoading] = useState(false);

  // console.log("Open");

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
      // formData.append("directory_type_id", directoryTypeId);
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/directory/updatedir.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      // console.log(response);

      if (response.status === 201) {
        toast.success("Directory Updated Successfully");
        setDirName("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Failed to update directory");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Sheet open onOpenChange={onClose}>
      <SheetContent className="z-[100]">
        <SheetHeader>
          <SheetTitle>Update Directory</SheetTitle>
        </SheetHeader>
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
          <SheetClose className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md w-full">
            Close
          </SheetClose>
          <button
            disabled={loading}
            onClick={handleUpdate}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default UpdateDir;
