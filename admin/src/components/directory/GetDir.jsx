/* eslint-disable react/prop-types */
import { API_URL } from "@/url";
import axios from "axios";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Actions from "./Actions";
import CreateDir from "./CreateDir";
import toast from "react-hot-toast";

function GetDir({
  directoryType,
  directoryTypeId,
  contentType,
  dirData,
  setDirData,
  handleNavigate,
}) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { dirId } = location.state || {};
  const courseId = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  // console.log(dirId);

  useEffect(() => {
    const getDir = async () => {
      if (!dirId) return;
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("parent_id", dirId);
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
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    getDir();
  }, [contentType, dirId, directoryType, directoryTypeId, setDirData]);

  if (loading) {
    return <p className="text-center m-auto h-full">Loading...</p>;
  }
  return (
    <div className="p-2 flex flex-wrap gap-8">
      {dirData?.map((data) => (
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
                  onClick={() =>
                    handleNavigate(data.id, data.directory_name, data.parent_id)
                  }
                  className="flex flex-col justify-center items-center w-full"
                >
                  <Folder fill="#60a5fa" className="w-16 h-16 text-blue-400" />
                  <span className="text-xs break-words text-center">
                    {data?.directory_name}
                  </span>
                </div>
              </div>
            </Actions>
          </div>
        </div>
      ))}
      <div className="cursor-pointer flex justify-center items-center w-20 pb-8 ">
        <CreateDir
          contentType={contentType}
          directoryType={directoryType}
          directoryTypeId={directoryTypeId}
          parentId={courseId}
          setDirData={setDirData}
        />
      </div>
    </div>
  );
}

export default GetDir;
