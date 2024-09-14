/* eslint-disable react/prop-types */
import { API_URL } from "@/url";
import axios from "axios";
import { Folder } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GetDir({
  directoryType,
  directoryTypeId,
  contentType,
  dirData,
  setDirData,
  setBreadcrumbData,
}) {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("id");
  const navigate = useNavigate();
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

  const insertBreadcrumb = (data, id, name, parentId) => {
    const updateData = data.map((item) => {
      if (item.id === parentId) {
        return {
          ...item,
          children: [{ id, name, parentId }],
        };
      } else if (item.children) {
        return {
          ...item,
          children: insertBreadcrumb(item.children, id, name, parentId),
        };
      }

      return item;
    });
    return updateData;
  };

  const removeBreadCrumbChildren = (data, id) => {
    return data.map((item) => {
      if (item.id === id) {
        // Clear only children but retain the breadcrumb itself
        return {
          ...item,
          children: [],
        };
      } else if (item.children) {
        // Recursively apply the removal on nested children
        return {
          ...item,
          children: removeBreadCrumbChildren(item.children, id),
        };
      }
      return item;
    });
  };

  const handleNavigate = (id, name, parentId) => {
    navigate(`/get-course-videos?id=${id}`);

    setBreadcrumbData((prevData) => {
      let updatedData;
      if (parentId) {
        // Insert breadcrumb for the current item
        updatedData = insertBreadcrumb(prevData, id, name, parentId);
      } else {
        // Add new breadcrumb item at the root
        updatedData = [...prevData, { id, name, parentId }];
      }
      // Remove only children of the clicked breadcrumb
      return removeBreadCrumbChildren(updatedData, id);
    });
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="p-2 flex flex-wrap gap-8">
      {dirData?.map((data) => (
        <div key={data.id} className="my-2">
          <div className="flex items-center justify-between ">
            <div
              onClick={() =>
                handleNavigate(data.id, data.directory_name, data.parent_id)
              }
              className="cursor-pointer flex flex-col justify-center items-center w-20"
            >
              <Folder fill="#60a5fa" className="w-16 h-16 text-blue-400" />
              <span className="text-xs break-words text-center">
                {data.directory_name}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GetDir;
