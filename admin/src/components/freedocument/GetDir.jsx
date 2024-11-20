/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Clock, FileBox, Folder } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Actions from "./Actions";
import CreateDir from "./CreateDir";
import { API_URL } from "@/url";
import ConfirmDelete from "@/utils/ConfirmDelete";
import GetDataToAdd from "./GetDataToAdd";

function GetDir({
  directoryType,
  directoryTypeId,
  contentType,
  dirData,
  setDirData,
  handleNavigate,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { subDir } = location.state ? location.state : { subDir: "1" };
  const docId = searchParams.get("id") ? searchParams.get("id") : 49;
  const [loading, setLoading] = useState(false);
  const [getDataContent, setGetDataContent] = useState();
  const [showFolders, setShowFolders] = useState(true); // Track folder/content view
  const [contentDirId, setContentDirId] = useState();

  const refreshDirContent = async (dirId) => {
    if (!dirId) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("directory_id", dirId);
      formData.append("content_type", 5);
      const response = await axios.post(
        `${API_URL}/admin/directory/getdirectorycontent.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );
      if (response.status === 201) {
        setGetDataContent(response.data.data || []);
        setShowFolders(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Error fetching content");
      setGetDataContent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      window.performance.getEntriesByType("navigation")[0].type === "reload"
    ) {
      navigate("/get-free-materials");
    }
  }, [navigate]);

  useEffect(() => {
    const getDir = async () => {
      if (!docId) return;

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("parent_id", docId);
        formData.append("directory_type", directoryType);
        formData.append("directory_type_id", directoryTypeId);
        formData.append("content_type", contentType);
        const response = await axios.post(
          `${API_URL}/admin/directory/getdir.php`,
          formData,
          {
            headers: { "content-type": "multipart/form-data" },
          }
        );
        setDirData(response.data.data);
        if (response.data.data.some((item) => item.has_subdirectories != 0)) {
          setShowFolders(true);
        }
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    getDir();
  }, [contentType, docId, directoryType, directoryTypeId, setDirData]);

  const getDirDataContent = async (dirId) => {
    setContentDirId(dirId);
    await refreshDirContent(dirId);
  };

  // const handleContentUpdate = (newContent) => {
  //   // Ensure we're always working with an array
  //   setGetDataContent((prevContent) => {
  //     const currentContent = Array.isArray(prevContent) ? prevContent : [];
  //     return [...currentContent, newContent];
  //   });
  // };

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

  const handleDelete = async (did, type, cid) => {
    try {
      // setLoading(true);
      const formData = new FormData();
      formData.append("directory_id", did);
      formData.append("content_type", type);
      formData.append("content_id", cid);
      const response = await axios.post(
        `${API_URL}/admin/directory/deletecontentfromdir.php`,
        formData,
        {
          headers: "content-type/form-data",
        }
      );

      //   console.log(response);

      if (response.status === 201) {
        // dispatch(deleteVideo(id));
        const newdoc = getDataContent.filter((doc) => doc.doc_id !== cid);
        setGetDataContent(newdoc);
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

  //   console.log(showFolders);

  if (loading) {
    return <p className="text-center m-auto h-full">Loading...</p>;
  }

  return (
    <div className="p-2 flex flex-wrap gap-8">
      {subDir == "1" &&
        dirData?.map((data) => (
          <div key={data?.id} className="my-2">
            <div className="flex items-center justify-between ">
              <Actions
                id={data?.id}
                name={data?.directory_name}
                contentType={data?.content_type}
                directoryType={data?.directory_type}
                parentId={data?.parent_id}
                directoryTypeId={data?.directory_type_id}
                setDirData={setDirData}
              >
                <div className="cursor-pointer relative w-20">
                  <div
                    onClick={() => {
                      handleNavigate(
                        data.id,
                        data.directory_name,
                        data.parent_id,
                        data.has_subdirectories
                      ); // Navigate to subdirectory
                      if (data?.has_subdirectories == 0) {
                        getDirDataContent(data.id); // Fetch content if no subdirectories
                      }
                    }}
                    className="flex flex-col justify-center items-center w-full"
                  >
                    <Folder
                      fill="#60a5fa"
                      className="w-16 h-16 text-blue-400"
                    />
                    <span className="text-xs break-words text-center">
                      {data?.directory_name}
                    </span>
                  </div>
                </div>
              </Actions>
            </div>
            {/* {data?.has_subdirectories == 0 && (
              <div className="flex justify-center items-center w-20 pb-8 ">
                <GetDataToAdd directory_id={contentDirId} />
              </div>
            )} */}
          </div>
        ))}

      {showFolders && (
        <div className="cursor-pointer flex justify-center items-center w-20 pb-8 ">
          <CreateDir
            contentType={contentType}
            directoryType={directoryType}
            directoryTypeId={directoryTypeId}
            parentId={docId}
            setDirData={setDirData}
          />
        </div>
      )}

      {subDir != "1" && (
        <div className="flex justify-center items-center w-20 pb-8 ">
          <GetDataToAdd
            directory_id={docId}
            contentType={contentType}
            onContentAdded={() => refreshDirContent(docId)}
          />
        </div>
      )}

      {/* Render content if has_subdirectories == 0 */}
      {!showFolders && getDataContent && subDir == "0" && (
        <div className="flex flex-wrap justify-center items-center w-full">
          {getDataContent?.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col w-64 border rounded-lg border-gray-300 shadow-md ml-2 my-5 p-3 gap-4 bg-white"
            >
              {/* <div className="flex justify-between items-center">
                Status and Actions
                Actions
                <div className="flex gap-2">
                  <UpdateDoc data={item} setData={setDoc} />
                  <ConfirmDelete
                    handleClick={() =>
                      handleDelete(contentDirId, 5, item.doc_id)
                    }
                  />
                </div>
              </div> */}
              {/* <div
                onClick={() => handleViewDoc(item.doc_id)}
                className="flex justify-center items-center"
              >
                <img
                  src={item.img_url}
                  alt="Document Thumbnail"
                  className="rounded-lg border border-gray-200 object-cover w-full h-64"
                />
              </div> */}
              <div className="flex flex-col gap-3">
                <h3
                  onClick={() => handleViewDoc(item.doc_id)}
                  className="cursor-pointer text-sm font-semibold text-gray-800 truncate"
                >
                  {item.name}
                </h3>
                <div className="flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <ConfirmDelete
                      handleClick={() =>
                        handleDelete(contentDirId, 5, item.doc_id)
                      }
                    />
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
            </div>
          ))}
          {/* <GetDataToAdd
            directory_id={contentDirId}
            data={getDataContent}
            setData={setGetDataContent}
          /> */}
        </div>
      )}
    </div>
  );
}

export default GetDir;
