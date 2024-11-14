import { API_URL } from "@/url";
import LayoutAdjuster from "@/utils/LayoutAdjuster";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const fetchData = async (setLoading, setNews, id) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("id", id);
    const response = await axios.post(
      `${API_URL}/admin/news/getnewscontent.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    console.log(response);
    setNews(response.data.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetNewsContent() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const location = useLocation();
  const { title } = location.state || "";
  const [news, setNews] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(news);

  useEffect(() => {
    fetchData(setLoading, setNews, id);
  }, [id]);
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
              <p className="text-lg font-bold text-center">{title}</p>
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              {news.content}
            </div>
          </div>
        </div>
      )}
    </LayoutAdjuster>
  );
}

export default GetNewsContent;
