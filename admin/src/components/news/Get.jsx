import ConfirmDelete from "@/utils/ConfirmDelete";
import LayoutAdjuster from "@/utils/LayoutAdjuster";
import Loader from "@/utils/Loader";
import { useEffect, useState } from "react";
import { Avatar } from "antd";
import axios from "axios";
import { API_URL } from "@/url";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { LatexParser } from "@/utils/LatexParser";
import { truncateData } from "@/utils/truncateData";

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

function GetNews() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(
      setLoading,
      //  currentPage,
      setNews
      //  setPaginationData
    );
  }, []);

  const handleDelete = async (id) => {
    try {
      // setLoading(true);
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/gallery/deletegalleryimage.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      if (response.status === 201) {
        // dispatch(deleteVideo(id));
        const newdoc = news.filter((news) => news.id !== id);
        setNews(newdoc);
        toast.success("Image Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error while deleting Image");
    }
    // finally {
    //   setLoading(false);
    // }
  };

  const handleChangeStatus = async (imageId, is_active) => {
    const confirmAlert = window.confirm(
      `${
        is_active === "1"
          ? "News will become Inactive. Do you want to proceed"
          : "News will become Active. Do you want to proceed"
      }`
    );
    if (confirmAlert) {
      try {
        is_active = is_active === "1" ? "0" : "1";
        const formData = new FormData();
        formData.append("id", imageId);
        formData.append("status", is_active);
        await axios.post(
          `${API_URL}/admin/news/updatenewsstatus.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );

        // console.log(res);
        // Update local state instead of fetching users again
        const updatedNews = news.map((news) =>
          news.id === imageId ? { ...news, is_active } : news
        );
        setNews(updatedNews);
      } catch (error) {
        console.log("Error updating user status:", error);
        // Handle error (e.g., show an error message)
      }
    }
  };

  const renderData = (data) => {
    if (typeof data === "string") {
      return LatexParser(data);
    }
    return data;
  };

  return (
    <LayoutAdjuster>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="w-[80%] flex flex-col justify-center items-center mx-auto">
          <div className="w-full flex flex-col justify-center items-center my-5">
            <div className="w-full flex justify-center items-center gap-5">
              <h1 className="text-3xl font-bold text-center">News List</h1>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              {news.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center items-center w-full">
                  {news.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col font-medium w-72 border rounded-md border-zinc-300 ml-2 my-5 p-4 gap-3"
                    >
                      {/* <div className="flex justify-between items-center w-full gap-4">
                        <Avatar className="bg-gray-500 text-white">
                          {idx + 1}
                        </Avatar>

                        <ConfirmDelete
                          handleClick={() => handleDelete(item.id)}
                        />

                        <div className="flex flex-col justify-center items-center">
                          <p className="text-xs font-bold">
                            {item.is_active === "1" ? "Public" : "Private"}
                          </p>
                          <button
                            onClick={() =>
                              handleChangeStatus(item.id, item.is_active)
                            }
                            className="toggle-switch scale-75 align-middle"
                          >
                            <input
                              type="checkbox"
                              checked={item.is_active === "1"}
                              readOnly
                            />
                            <div className="toggle-switch-background">
                              <div className="toggle-switch-handle"></div>
                            </div>
                          </button>
                        </div>
                      </div> */}

                      <div
                        onClick={() =>
                          navigate(`/get-news-content?id=${item.id}`, {
                            state: { title: item.title },
                          })
                        }
                        className="cursor-pointer flex flex-col items-center gap-4"
                      >
                        <img
                          src={item.img_url}
                          className="rounded-lg border-transparent w-full"
                          alt="News thumbnail"
                        />

                        <p className="text-sm font-bold text-center">
                          {truncateData(renderData(item.title), 5)}
                        </p>

                        <div className="text-center text-sm flex justify-between items-center w-full gap-2">
                          <p className="font-medium">
                            By: {truncateData(item.author, 2)}
                          </p>
                          <p className="font-medium bg-gray-200 rounded p-0.5">
                            {item.category}
                          </p>
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
          </div>
        </div>
      )}
    </LayoutAdjuster>
  );
}

export default GetNews;
