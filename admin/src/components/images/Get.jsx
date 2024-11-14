import ConfirmDelete from "@/utils/ConfirmDelete";
import LayoutAdjuster from "@/utils/LayoutAdjuster";
import Loader from "@/utils/Loader";
import { useEffect, useState } from "react";
import Add from "./Add";
import { Avatar } from "antd";
import axios from "axios";
import { API_URL } from "@/url";
import toast from "react-hot-toast";

const fetchData = async (
  setLoading,
  //   currentPage,
  setImage
  //   setPaginationData
) => {
  try {
    setLoading(true);
    // const formData = new FormData();
    // formData.append("page", currentPage);
    // formData.append("limit", 10);
    // formData.append("type", 2);
    const response = await axios.post(
      `${API_URL}/admin/gallery/getallgalleryimages.php`
      //   formData,
      //   { headers: "content-type/form-data" }
    );
    setImage(response.data.data);
    // setPaginationData(response.data.pagination);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetImage() {
  const [image, setimage] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(
      setLoading,
      //  currentPage,
      setimage
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
        const newdoc = image.filter((image) => image.id !== id);
        setimage(newdoc);
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
          ? "Document will become Inactive. Do you want to proceed"
          : "Document will become Active. Do you want to proceed"
      }`
    );
    if (confirmAlert) {
      try {
        is_active = is_active === "1" ? "0" : "1";
        const formData = new FormData();
        formData.append("id", imageId);
        formData.append("status_code", is_active);
        await axios.post(
          `${API_URL}/gallery/updategalleryimagestatus.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );

        // console.log(res);
        // Update local state instead of fetching users again
        const updatedVideo = image.map((image) =>
          image.id === imageId ? { ...image, is_active } : image
        );
        setimage(updatedVideo);
      } catch (error) {
        console.log("Error updating user status:", error);
        // Handle error (e.g., show an error message)
      }
    }
  };
  return (
    <LayoutAdjuster>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div
          className={`${"w-[80%] flex flex-col justify-center items-center mx-auto"} `}
        >
          <div className="w-full flex flex-col justify-center items-center my-5">
            <div className="w-full flex justify-center items-center gap-5">
              <h1 className="text-3xl font-bold text-center">Images List</h1>
              <Add image={image} setimage={setimage} />
            </div>
            <div className="w-full flex flex-col justify-center items-center">
              {image.length > 0 ? (
                <div className="flex flex-wrap justify-center items-center w-full">
                  {image.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-center items-center font-medium w-96 border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                    >
                      <div className="flex flex-col justify-center items-start gap-4 w-full">
                        <div className="flex justify-between items-center w-full gap-4">
                          <Avatar className="bg-gray-500 text-white">
                            {/* {(currentPage - 1) * 10 + (idx + 1)} */}
                            {idx + 1}
                          </Avatar>
                          {/* <div>Doc ID: {item.video_id}</div> */}

                          <ConfirmDelete
                            handleClick={() => handleDelete(item.id)}
                          />

                          <div className="flex flex-col justify-center items-center">
                            <p className="text-xs font-bold">
                              {item.is_active === "1" ? "Public" : "Private"}
                            </p>
                            <button
                              onClick={() => {
                                handleChangeStatus(item.id, item.is_active);
                              }}
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
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div
                          onClick={() => window.open(item.url, "_blank")}
                          className="cursor-pointer flex justify-between items-center w-full gap-6"
                        >
                          <div className="flex justify-center items-center w-full">
                            <img
                              src={item.img_url}
                              className="rounded-lg border-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* <div>
                    <Pagination
                      totalPage={paginationData.total_pages}
                      currPage={currentPage}
                      setCurrPage={setCurrentPage}
                    />
                  </div> */}
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

export default GetImage;
