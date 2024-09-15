/* eslint-disable react/prop-types */
import { API_URL } from "@/url";
import axios from "axios";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Actions from "./Actions";
import CreateDir from "./CreateDir";

function GetDir({
  directoryType,
  directoryTypeId,
  contentType,
  dirData,
  setDirData,
  handleNavigate,
}) {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDir = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("parent_id", courseId);
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
      } finally {
        setLoading(false);
      }
    };
    getDir();
  }, [contentType, courseId, directoryType, directoryTypeId, setDirData]);

  if (loading) {
    return <p className="text-center m-auto h-full">Loading...</p>;
  }
  return (
    <div className="p-2 flex flex-wrap gap-8">
      {dirData?.map((data) => (
        <div key={data.id} className="my-2">
          <div className="flex items-center justify-between ">
            <Actions>
              <div className="cursor-pointer relative w-20">
                <div
                  onClick={() =>
                    handleNavigate(data.id, data.directory_name, data.parent_id)
                  }
                  className="flex flex-col justify-center items-center w-full"
                >
                  <Folder fill="#60a5fa" className="w-16 h-16 text-blue-400" />
                  <span className="text-xs break-words text-center">
                    {data.directory_name}
                  </span>
                </div>
              </div>
            </Actions>
          </div>
        </div>
      ))}
      <div className="cursor-pointer flex justify-center items-center w-20 pb-8 ">
        <CreateDir />
      </div>
    </div>
  );
}

export default GetDir;
