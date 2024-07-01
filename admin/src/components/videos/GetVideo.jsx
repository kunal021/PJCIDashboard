import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../url";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Loader from "../../utils/Loader";
import { Avatar } from "antd";
import Pagination from "../../utils/Pagination";
import parser from "html-react-parser";
import toast from "react-hot-toast";
import ConfirmDelete from "../../utils/ConfirmDelete";
import UpdateBtn from "../../utils/UpdateBtn";
import { useNavigate } from "react-router-dom";

function GetVideo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("page", currentPage);
        formData.append("limit", 10);
        const response = await axios.post(
          `${API_URL}/admin/video/getvideolist.php`,
          formData,
          { headers: "content-type/form-data" }
        );
        console.log(response);
        setData(response.data.data);
        setPaginationData(response.data.pagination);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("video_id", id);
      const response = await axios.post(
        `${API_URL}/admin/video/deletevideo.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      console.log(response);
      if (response.status === 201) {
        setData((prevData) => prevData.filter((item) => item.id !== id));
        toast.success("Video Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <LayoutAdjuster>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-center">Videos List</h1>
          <div className="w-full flex flex-col justify-center items-center">
            {data ? (
              <div className="flex flex-col justify-center items-center w-full">
                {data.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex  justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                  >
                    <div className="flex flex-col justify-center items-start gap-4 w-full">
                      <div className="flex justify-between items-center w-full gap-4">
                        <Avatar className="bg-gray-500 text-white">
                          {item.id}
                        </Avatar>
                        <div>Video ID: {item.video_id}</div>
                      </div>
                      <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                      <div>
                        <div className="flex flex-wrap text-wrap">
                          Video Title:{" "}
                          {typeof item.video_title == "string"
                            ? parser(item.video_title)
                            : item.video_title}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end gap-10 w-fit">
                      <UpdateBtn
                        handleClick={() => {
                          navigate(`/update-video?id=${item.id}`);
                        }}
                      />
                      <ConfirmDelete
                        handleClick={() => handleDelete(item.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-2xl font-bold text-center mt-20">
                No Data Available
              </div>
            )}
            <div className="mb-4">
              <Pagination
                totalPage={paginationData.total_pages}
                currPage={currentPage}
                setCurrPage={setCurrentPage}
              />
            </div>
          </div>
        </div>
      )}
    </LayoutAdjuster>
  );
}

export default GetVideo;
