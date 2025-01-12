/* eslint-disable react/prop-types */
import { deleteImage, setImage } from "@/redux/image/imageSlice";
import { API_URL } from "@/url";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RenderImages from "./RenderImages";
import Loader from "@/utils/Loader";
import toast from "react-hot-toast";
import Add from "./Add";
import { X } from "lucide-react";

const fetchData = async (
  dispatch,
  setLoading,
  currentPage,
  setPaginationData,
  tag
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("page", currentPage);
    formData.append("limit", 25);
    formData.append("tags", tag || "");
    const response = await axios.post(
      `${API_URL}/admin/images/getimageswithpagination.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    // console.log(response.data);
    dispatch(setImage(response.data.data));
    setPaginationData(response.data.pagination);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetImageToUpload({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const image = useSelector((state) => state.image.image);
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [tag, setTag] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(dispatch, setLoading, currentPage, setPaginationData);
  }, [currentPage, dispatch]);

  const handleDelete = async (id) => {
    try {
      // setLoading(true);
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/images/deleteimage.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      if (response.status === 200) {
        dispatch(deleteImage(id));
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

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleTagChange = () => {
    dispatch(setImage([]));
    setPaginationData({});
    setCurrentPage(1);
    fetchData(dispatch, setLoading, currentPage, setPaginationData, tag);
  };

  {
    return isOpen ? (
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50"
      >
        <div className="bg-white rounded-lg p-6 w-full mx-4 sm:mx-auto shadow-lg max-w-4xl max-h-[90vh] overflow-auto">
          {loading ? (
            <Loader />
          ) : (
            <div className="flex flex-col justify-center items-center relative">
              <h2 className="text-lg font-semibold mb-4 text-center">
                <Add
                  fetchData={() =>
                    fetchData(
                      dispatch,
                      setLoading,
                      currentPage,
                      setPaginationData
                    )
                  }
                />
              </h2>
              <button onClick={onClose}>
                <X className="h-5 w-5 absolute top-2 right-2 cursor-pointer" />
              </button>
              <RenderImages
                image={image}
                tag={tag}
                setTag={setTag}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                handleDelete={handleDelete}
                paginationData={paginationData}
                handleTagChange={handleTagChange}
              />
              <button
                onClick={onClose}
                className="bg-red-50 border border-red-200 py-2 px-4 rounded hover:bg-red-100"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    ) : null;
  }
}

export default GetImageToUpload;
