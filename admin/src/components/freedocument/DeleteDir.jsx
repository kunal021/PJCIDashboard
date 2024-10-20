/* eslint-disable react/prop-types */
import { API_URL } from "@/url";
import axios from "axios";
import toast from "react-hot-toast";

function DeleteDir({ id, setDirData }) {
  const handleDelete = async () => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/directory/deletedir.php`,
        formData,
        {
          headers: "multipart/form-data",
        }
      );

      if (response.status === 201) {
        toast.success(response.data.message);
        setDirData((prev) =>
          prev.filter((item) => {
            return item.id !== id;
          })
        );
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Failed to delete directory");
    }
  };
  return (
    <div onClick={handleDelete} className="cursor-pointer text-red-500">
      Delete
    </div>
  );
}

export default DeleteDir;
