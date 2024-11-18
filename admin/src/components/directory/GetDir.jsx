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
  const subDir = (location.state && location.state.subDir) || "1";
  const courseId = localStorage.getItem("courseId");
  const docId = searchParams.get("id") ? searchParams.get("id") : "1";
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
      formData.append("content_type", contentType);
      const response = await axios.post(
        `${API_URL}/admin/directory/getdirectorycontent.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );
      console.log(response);
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
    const getDir = async () => {
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
    getDir();
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
          </div>
        ))}

      {showFolders && (
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
            directory_id={docId}
            contentType={contentType}
            onContentAdded={() => refreshDirContent(docId)}
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
                    {/* <div className="flex justify-center items-center w-48">
                    <img
                      src={item.img_url}
                      className="rounded-lg border-transparent h-24 w-full"
                    />
                  </div> */}
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
                      handleDelete(contentDirId, 5, item.doc_id)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      {/* {console.log(getDataContent, value, subDir)} */}

      {/* Video */}
      {!showFolders && getDataContent && subDir == "0" && value == "Video" && (
        <div className="flex flex-wrap justify-center items-center w-72">
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
                        handleDelete(contentDirId, 5, item.v_id)
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
                {/* Test Name and ID */}
                <div className="flex justify-between items-center w-full gap-4">
                  <Avatar className="bg-blue-500 text-white">
                    {item.test_id} {/* Display the test ID */}
                  </Avatar>
                  <div className="flex flex-wrap text-wrap w-full">
                    <h2 className="text-lg font-bold">{item.test_name}</h2>{" "}
                    {/* Display test name */}
                  </div>
                </div>

                <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />

                {/* Description */}
                <div className="flex flex-col gap-2 w-full">
                  <div
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>

                <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />

                {/* Test Details */}
                <div className="cursor-pointer flex justify-between items-center gap-4 w-full">
                  <div className="flex justify-center gap-2 items-center">
                    <span className="font-semibold">Duration:</span>
                    <span>{item.duration}</span>
                  </div>
                  <div className="flex justify-center gap-2 items-center">
                    <span className="font-semibold">Price:</span>
                    <span>{item.price === "0" ? "Free" : `${item.price}`}</span>
                  </div>
                  {/* <div className="flex justify-between items-center">
                    <span className="font-semibold">Number of Questions:</span>
                    <span>{item.number_of_questions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Marks:</span>
                    <span>{item.total_mark}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Marks Per Question:</span>
                    <span>{item.mark_per_qns}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Negative Mark:</span>
                    <span>{item.negative_mark}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Test Date:</span>
                    <span>
                      {item.test_date === "0000-00-00"
                        ? "Not Scheduled"
                        : item.test_date}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Start Time:</span>
                    <span>{item.start_time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">End Time:</span>
                    <span>{item.end_time}</span>
                  </div> */}
                </div>
              </div>

              <div className="flex flex-col justify-between items-end gap-10 w-fit">
                <ConfirmDelete
                  handleClick={
                    () => handleDelete(item.test_id, "test", item.id) // Adjusted to use test_id and id
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
