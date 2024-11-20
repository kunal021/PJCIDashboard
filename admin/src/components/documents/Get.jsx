import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../../url";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Loader from "../../utils/Loader";
import toast from "react-hot-toast";
import ConfirmDelete from "../../utils/ConfirmDelete";
import UpdateDoc from "./Update";
import Add from "./Add";
import { Clock, FileBox, IndianRupee } from "lucide-react";
import { truncateData } from "@/utils/truncateData";

const fetchData = async (
  setLoading,
  //   currentPage,
  setDoc
  //   setPaginationData
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    // formData.append("page", currentPage);
    // formData.append("limit", 10);
    formData.append("type", 1);
    const response = await axios.post(
      `${API_URL}/admin/docs/getdoc.php`,
      formData,
      { headers: "content-type/form-data" }
    );
    setDoc(response.data.data);
    // setPaginationData(response.data.pagination);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

function GetDocuments() {
  const [loading, setLoading] = useState(false);
  //   const [paginationData, setPaginationData] = useState({});
  //   const [currentPage, setCurrentPage] = useState(1);
  //   const [updateVideo, setUpdateVideo] = useState(false);
  //   const [updateVideoData, setUpdateVideoData] = useState({});

  const [doc, setDoc] = useState([]);

  useEffect(() => {
    fetchData(
      setLoading,
      //  currentPage,
      setDoc
      //  setPaginationData
    );
  }, []);

  const handleDelete = async (id) => {
    try {
      // setLoading(true);
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
        // dispatch(deleteVideo(id));
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
    // finally {
    //   setLoading(false);
    // }
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

        // console.log(res);
        // Update local state instead of fetching users again
        const updatedDoc = doc.map((doc) =>
          doc.id === docId ? { ...doc, is_active } : doc
        );
        setDoc(updatedDoc);
      } catch (error) {
        console.log("Error updating Doc status:", error);
        // Handle error (e.g., show an error message)
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
      // formData.append("start_range", 0);
      // formData.append("end_range", 524287);

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

  // const handleToggleDocType = async (docId) => {
  //   if (
  //     !doc.img_url ||
  //     !doc.type ||
  //     !doc.price ||
  //     !doc.name ||
  //     !doc.duration ||
  //     !docId
  //   ) {
  //     toast.error("Please fill all fields");
  //     return;
  //   }
  //   try {
  //     setLoading(true);
  //     const formData = new FormData();
  //     formData.append("id", docId);
  //     formData.append("image_url", doc.img_url);
  //     formData.append("name", doc.name);
  //     formData.append("type", doc.type);
  //     formData.append("duration", doc.duration);
  //     formData.append("price", doc.price);
  //     const response = await axios.post(
  //       `${API_URL}/admin/docs/updatedoc.php`,
  //       formData,
  //       { headers: { "content-type": "multipart/form-data" } }
  //     );
  //     // console.log(response);
  //     if (response.status === 200) {
  //       toast.success("Document Updated Successfully");

  //       const updatedDoc = doc.map((doc) =>
  //         doc.id === docId ? { ...doc, is_active } : doc
  //       );
  //       setDoc(updatedDoc);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error?.response?.data?.message || "Error updating Document");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // console.log(doc);

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
              <h1 className="text-3xl font-bold text-center">Materilas List</h1>
              <Add doc={doc} setDoc={setDoc} />
            </div>
            <div className="w-full flex justify-center items-center">
              {doc.length > 0 ? (
                <div className="flex flex-wrap justify-center items-center w-full">
                  {doc.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col w-64 border rounded-lg border-gray-300 shadow-md ml-2 my-5 p-3 gap-4 bg-white"
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
                            className="toggle-switch scale-75"
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
                          <UpdateDoc data={item} setData={setDoc} />
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
                          className="rounded-lg border border-gray-200 w-full h-64"
                        />
                        <h3 className="text-sm font-semibold text-gray-800 truncate">
                          {truncateData(item.name, 5)}
                        </h3>
                      </div>

                      {/* Content Section */}

                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <IndianRupee className="h-4 w-4 text-gray-500" />
                          <span>{item.price}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FileBox className="h-4 w-4 text-gray-500" />
                          <span>{item.size}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{item.duration}</span>
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
      {/* {updateVideo && (
        <UpdateVideo
          setUpdateVideo={setUpdateVideo}
          updateVideoData={updateVideoData}
        />
      )} */}
    </LayoutAdjuster>
  );
}

export default GetDocuments;
