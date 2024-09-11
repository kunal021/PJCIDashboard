/* eslint-disable react/prop-types */
import { API_URL } from "@/url";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import CreateDir from "./CreateDir";
import ConfirmDelete from "@/utils/ConfirmDelete";
import toast from "react-hot-toast";
import UpdateDir from "./UpdateDir";

function GetDir({ parentId, directoryType, directoryTypeId, contentType }) {
  const [dirData, setDirData] = useState();
  const [openDirectories, setOpenDirectories] = useState({});

  const handleDirClick = (id) => {
    setOpenDirectories((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  useEffect(() => {
    const getDir = async () => {
      try {
        const formData = new FormData();
        formData.append("parent_id", parentId);
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
        console.log(response.data.data);
        setDirData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getDir();
  }, []);

  const deleteDir = async (id) => {
    try {
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        `${API_URL}/admin/directory/deletedir.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );
      //   console.log(response);
      if (response.status === 201) {
        setDirData((prevData) => prevData.filter((data) => data.id !== id));
        toast.success("Directory Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-2">
      {dirData?.map((data) => (
        <div key={data.id} className="my-2">
          <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition duration-200 ease-in-out text-gray-800 px-2 rounded-lg shadow-sm border border-gray-200">
            <span
              onClick={() => handleDirClick(data.id)}
              className="cursor-pointer font-medium py-2 w-full"
            >
              {data.directory_name}
            </span>
            <div className="flex justify-end items-center py-2 gap-2 w-[30%]">
              <CreateDir
                type={"directory"}
                directoryType={data.directory_type}
                parentId={data.id}
                contentType={data.content_type}
                directoryTypeId={data.directory_type_id}
              />

              <div className="scale-75 flex justify-center items-center gap-5">
                <UpdateDir
                  name={data.directory_name}
                  type={"directory"}
                  directoryType={data.directory_type}
                  parentId={data.id}
                  contentType={data.content_type}
                  directoryTypeId={data.directory_type_id}
                  id={data.id}
                />
                <ConfirmDelete handleClick={() => deleteDir(data.id)} />
              </div>
              <ChevronRight
                onClick={() => handleDirClick(data.id)}
                className={`cursor-pointer w-5 h-5 transform transition-transform duration-200 ${
                  openDirectories[data.id] ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>
          {data.has_subdirectories === "1" && openDirectories[data.id] && (
            <div className="ml-2 border-l-2 border-gray-200 pl-2 mt-1">
              <GetDir
                parentId={data.id}
                contentType={data.content_type}
                directoryType={data.directory_type}
                directoryTypeId={data.directory_type_id}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default GetDir;
