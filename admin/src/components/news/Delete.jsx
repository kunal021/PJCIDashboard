/* eslint-disable react/prop-types */
import { API_URL } from "@/url";
import axios from "axios";
import toast from "react-hot-toast";

function Delete({ id, news, setNews }) {
  const handleDelete = async () => {
    try {
      // setLoading(true);
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/news/deletenews.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      console.log(response);

      if (response.status === 200) {
        // dispatch(deleteVideo(id));
        const newdoc = news.filter((news) => news.id !== id);
        setNews(newdoc);
        toast.success("News Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error while deleting News");
    }
    // finally {
    //   setLoading(false);
    // }
  };
  return (
    <div onClick={handleDelete} className="cursor-pointer text-red-500">
      Delete
    </div>
  );
}

export default Delete;
