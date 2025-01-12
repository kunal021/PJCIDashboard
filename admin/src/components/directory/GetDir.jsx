/* eslint-disable react/prop-types */
import { API_URL } from "@/url";
import axios from "axios";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Actions from "./Actions";
import CreateDir from "./CreateDir";
import toast from "react-hot-toast";
import ConfirmDelete from "@/utils/ConfirmDelete";
import { Avatar } from "antd";
import GetDataToAdd from "./GetDataToAdd";

const getDir = async (
  docId,
  directoryType,
  courseId,
  contentType,
  setLoading,
  setDirData,
  setShowFolders
) => {
  if (!docId) return;
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("parent_id", docId);
    formData.append("directory_type", directoryType);
    formData.append("directory_type_id", courseId);
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

function GetDir({
  directoryType,
  contentType,
  dirData,
  value,
  setDirData,
  handleNavigate,
}) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [subDir, setSubDir] = useState("1");
  const courseId = localStorage.getItem("courseId");
  const docId = searchParams.get("id") ? searchParams.get("id") : "1";
  const [loading, setLoading] = useState(false);
  const [getDataContent, setGetDataContent] = useState([]);
  const [showFolders, setShowFolders] = useState(true); // Track folder/content view
  const [contentDirId, setContentDirId] = useState();
  const [isAddContentDialogOpen, setIsAddContentDialogOpen] = useState(false);

  const refreshDirContent = async (dirId) => {
    if (!dirId) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("directory_id", dirId);
      formData.append("content_type", contentType);
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
    if (location.state && location.state.subDir) {
      setSubDir(location.state.subDir);
    }
  }, [location.state]);

  useEffect(() => {
    getDir(
      docId,
      directoryType,
      courseId,
      contentType,
      setLoading,
      setDirData,
      setShowFolders
    );
  }, [contentType, docId, directoryType, courseId, setDirData]);

  const getDirDataContent = async (dirId) => {
    setContentDirId(dirId);
    await refreshDirContent(dirId);
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

      if (response.status === 201) {
        if (!getDataContent || getDataContent.length <= 1) {
          setSubDir("-1");
        }
        refreshDirContent(did);
        toast.success("Content Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data.message || "Error while deleting document"
      );
    }
  };

  const handleContentAdded = () => {
    setSubDir("0");
    refreshDirContent(docId);
  };

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
                      );
                      if (data?.has_subdirectories == 0) {
                        getDirDataContent(data.id);
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
          </div>
        ))}

      {subDir != "0" && (
        <div className="cursor-pointer flex justify-center items-center w-20 pb-8 ">
          <CreateDir
            contentType={contentType}
            directoryType={directoryType}
            directoryTypeId={courseId}
            parentId={docId}
            setDirData={setDirData}
          />
        </div>
      )}

      {subDir != "1" && (
        <div className="flex justify-center items-center w-20 pb-8 ">
          <GetDataToAdd
            isOpen={isAddContentDialogOpen}
            onOpenChange={setIsAddContentDialogOpen}
            directory_id={docId}
            contentType={contentType}
            onContentAdded={handleContentAdded}
          />
        </div>
      )}

      {/* Material */}
      {!showFolders &&
        getDataContent &&
        subDir == "0" &&
        value === "Material" && (
          <div className="flex flex-col justify-center items-center w-full">
            {getDataContent?.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
              >
                <div className="flex flex-col justify-center items-start gap-4 w-full">
                  <div className="flex justify-between items-center w-full gap-4">
                    <Avatar className="bg-gray-500 text-white">
                      {idx + 1}
                    </Avatar>
                  </div>
                  <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                  <div
                    onClick={() => handleViewDoc(item.doc_id)}
                    className="cursor-pointer flex justify-between items-center w-full gap-6"
                  >
                    <div className="flex flex-wrap text-wrap w-full">
                      {item.name}
                    </div>
                  </div>
                  <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                  <div className=" cursor-pointer flex justify-between items-center w-full gap-6">
                    <div className="flex justify-center items-center">
                      Price: {item.price}
                    </div>
                    <div className="flex justify-center items-center">
                      Duration: {item.duration}
                    </div>
                    <div className="flex justify-center items-center">
                      Size: {item.size}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end gap-10 w-fit">
                  <ConfirmDelete
                    handleClick={() =>
                      handleDelete(contentDirId, contentType, item.doc_id)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Note */}
      {!showFolders && getDataContent && subDir == "0" && value === "Note" && (
        <div className="flex flex-col justify-center items-center w-full">
          {getDataContent?.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
            >
              <div className="flex flex-col justify-center items-start gap-4 w-full">
                <div className="flex justify-between items-center w-full gap-4">
                  <Avatar className="bg-gray-500 text-white">{idx + 1}</Avatar>
                </div>
                <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                <div
                  onClick={() => handleViewDoc(item.doc_id)}
                  className="cursor-pointer flex justify-between items-center w-full gap-6"
                >
                  <div className="flex flex-wrap text-wrap w-full">
                    {item.name}
                  </div>
                </div>
                <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                <div className=" cursor-pointer flex justify-between items-center w-full gap-6">
                  <div className="flex justify-center items-center">
                    Duration: {item.duration}
                  </div>
                  <div className="flex justify-center items-center">
                    Size: {item.size}
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end gap-10 w-fit">
                <ConfirmDelete
                  handleClick={() =>
                    handleDelete(contentDirId, contentType, item.doc_id)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video */}
      {!showFolders && getDataContent && subDir == "0" && value == "Video" && (
        <div className="flex flex-col justify-center items-center w-full">
          {getDataContent?.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
            >
              <div className="flex flex-col justify-between items-start gap-6 w-full p-4 border rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.video_title}
                    </h2>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <hr className="border-slate-300" />
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium">Duration:</span>
                      <span className="ml-2">{item.video_duration}</span>
                    </div>
                    <ConfirmDelete
                      handleClick={() =>
                        handleDelete(contentDirId, contentType, item.v_id)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Test */}
      {!showFolders && getDataContent && subDir == "0" && value == "Test" && (
        <div className="flex flex-col justify-center items-center w-full">
          {getDataContent?.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
            >
              <div className="flex flex-col justify-center items-start gap-4 w-full">
                <div className="flex justify-between items-center w-full gap-4">
                  <Avatar className="bg-blue-500 text-white">
                    {item.test_id}
                  </Avatar>
                  <div className="flex flex-wrap text-wrap w-full">
                    <h2 className="text-lg font-bold">{item.test_name}</h2>
                  </div>
                </div>

                <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />

                <div className="flex flex-col gap-2 w-full">
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>

                <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />

                <div className="cursor-pointer flex justify-between items-center gap-4 w-full">
                  <div className="flex justify-center gap-2 items-center">
                    <span className="font-semibold">Duration:</span>
                    <span>{item.duration}</span>
                  </div>
                  <div className="flex justify-center gap-2 items-center">
                    <span className="font-semibold">Price:</span>
                    <span>{item.price === "0" ? "Free" : `${item.price}`}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end gap-10 w-fit">
                <ConfirmDelete
                  handleClick={() =>
                    handleDelete(item.test_id, contentType, item.id)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GetDir;
