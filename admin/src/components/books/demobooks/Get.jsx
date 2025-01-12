import axios from "axios";
import { useEffect, useState } from "react";
import { Clock, FileBox, IndianRupee } from "lucide-react";
import { truncateData } from "@/utils/truncateData";
import getPercentage from "@/utils/getPercentage";
import { API_URL } from "@/url";
import toast from "react-hot-toast";
import Loader from "@/utils/Loader";
import ConfirmDelete from "@/utils/ConfirmDelete";
import Add from "./Add";
import Update from "./Update";
import { useHeading } from "@/hooks/use-heading";
import { useIsMobile } from "@/hooks/use-mobile";

const fetchData = async (setLoading, setDoc) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("type", 3);
    const response = await axios.post(
      `${API_URL}/admin/docs/getdoc.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    setDoc(response.data.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetDemoBooks() {
  const { setHeading } = useHeading();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(false);
  const [doc, setDoc] = useState([]);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          Demo Books
        </h1>
        <Add setDoc={setDoc} />
      </div>
    );
    fetchData(setLoading, setDoc);
  }, [setHeading]);

  const handleDelete = async (id) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/docs/deletedoc.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      if (response.status === 200) {
        const newdoc = doc.filter((doc) => doc.id !== id);
        setDoc(newdoc);
        toast.success("Material Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message || "Error while deleting document"
      );
    }
  };

  const handleChangeStatus = async (docId, is_active) => {
    const confirmAlert = window.confirm(
      `${
        is_active === "1"
          ? "Material will become Inactive. Do you want to proceed"
          : "Material will become Active. Do you want to proceed"
      }`
    );
    if (confirmAlert) {
      try {
        is_active = is_active === "1" ? "0" : "1";
        const formData = new FormData();
        formData.append("id", docId);
        formData.append("status_code", is_active);
        await axios.post(
          `${API_URL}/admin/docs/updatedocstatus.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );

        const updatedDoc = doc.map((doc) =>
          doc.id === docId ? { ...doc, is_active } : doc
        );
        setDoc(updatedDoc);
      } catch (error) {
        console.log("Error updating Doc status:", error);
      }
    }
  };

  const handleViewDoc = async (id) => {
    if (!id) {
      toast.error("Please select a document");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("doc_id", id);

      const response = await axios.post(
        `${API_URL}/admin/docs/getdocurl.php`,
        formData,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        window.open(response.data.url, "_blank");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message || "Error while fetching document"
      );
    }
  };

  return (
    <>
      {loading ? (
        <>
          <Loader />
        </>
      ) : (
        <div className="w-full sm:w-[90%] flex flex-col justify-center items-center mx-auto">
          <div className="w-full flex flex-col justify-center items-center my-5">
            <div className="w-full flex justify-center items-center">
              {doc.length > 0 ? (
                <div className="flex flex-wrap justify-center items-center gap-4 w-full">
                  {doc.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col w-44 sm:w-64 border rounded-lg border-gray-300 shadow-md my-5 p-3 gap-4 bg-white"
                    >
                      {/* Header Section */}
                      <div className="flex justify-between items-center">
                        {/* Status and Actions */}
                        <div className="flex flex-col items-center">
                          <p
                            className={`text-xs font-bold ${
                              item.is_active === "1"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {item.is_active === "1" ? "Public" : "Private"}
                          </p>
                          <button
                            onClick={() =>
                              handleChangeStatus(item.id, item.is_active)
                            }
                            className="toggle-switch scale-[60%] sm:scale-75"
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

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Update data={item} setData={setDoc} />
                          <ConfirmDelete
                            handleClick={() => handleDelete(item.id)}
                          />
                        </div>
                      </div>

                      {/* Image Section */}
                      <div
                        onClick={() => handleViewDoc(item.id)}
                        className="cursor-pointer flex flex-col justify-center items-center gap-2"
                      >
                        <img
                          src={item.img_url}
                          alt="Document Thumbnail"
                          className="rounded-md border border-gray-200 h-40 sm:h-64 w-full"
                        />
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {isMobile
                            ? truncateData(item.name, 3)
                            : truncateData(item.name, 5)}
                        </h3>
                      </div>

                      {/* Footer Section */}

                      <div className="flex flex-wrap justify-between items-center text-sm">
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <IndianRupee className="h-4 w-4 text-gray-500" />
                          <span>{item.price}</span>
                          <span className="text-xs text-gray-500 line-through">
                            {item.original_price}
                          </span>
                          {item.original_price && (
                            <span className="text-xs text-green-500">
                              {getPercentage(item.price, item.original_price)}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <FileBox className="h-4 w-4 text-gray-500" />
                          <span>{item.size}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{item.duration}</span>
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
    </>
  );
}

export default GetDemoBooks;