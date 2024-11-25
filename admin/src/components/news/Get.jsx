import LayoutAdjuster from "@/utils/LayoutAdjuster";
import Loader from "@/utils/Loader";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/url";
import { useNavigate } from "react-router-dom";
import { LatexParser } from "@/utils/LatexParser";
import { truncateData } from "@/utils/truncateData";
import Actions from "./Actions";
import Add from "./Add";
import toast from "react-hot-toast";

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
        const res = await axios.post(
          `${API_URL}/admin/news/updatenewsstatus.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );

        console.log(res);

        if (res.status === 200) {
          const updatedNews = news.map((news) =>
            news.id === imageId ? { ...news, is_active } : news
          );
          setNews(updatedNews);
          toast.success("Status Updated Successfully");
        }
      } catch (error) {
        console.log("Error updating user status:", error);
        toast.error("Error updating user status");
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
        <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
          <div className="w-full flex flex-col justify-center items-center my-5">
            <div className="w-full flex justify-center items-center gap-5">
              <h1 className="text-3xl font-bold text-center">News List</h1>
              <Add setNews={setNews} />
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              {news.length > 0 ? (
                <div className="flex flex-wrap gap-4 justify-center items-center w-full ">
                  {news.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col font-medium w-64 border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                    >
                      <Actions
                        id={item.id}
                        news={news}
                        setNews={setNews}
                        is_active={item.is_active}
                        handleChangeStatus={handleChangeStatus}
                      >
                        <div
                          onClick={() =>
                            navigate(`/get-news-content?id=${item.id}`, {
                              state: { title: renderData(item.title) },
                            })
                          }
                          className="cursor-pointer flex flex-col items-center gap-4"
                        >
                          <img
                            src={item.img_url}
                            className="rounded-lg border-transparent w-full h-64"
                            alt="News thumbnail"
                          />

                          <p className="text-sm font-bold text-center">
                            {truncateData(renderData(item.title), 5)}
                          </p>

                          <div className="text-center text-sm flex justify-between items-center w-full gap-2">
                            <p className="font-medium">
                              By: {truncateData(item.author, 3)}
                            </p>
                            <p className="font-medium bg-gray-200 rounded p-0.5">
                              {truncateData(item.category, 3)}
                            </p>
                          </div>
                        </div>
                      </Actions>
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
