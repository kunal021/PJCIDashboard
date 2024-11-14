import LayoutAdjuster from "@/utils/LayoutAdjuster";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumbs from "./BreadCrumbs";
import GetDir from "./GetDir";

const insertBreadcrumb = (data, id, name, parentId, subDir) => {
  const updateData = data.map((item) => {
    if (item.id === parentId) {
      // console.log(data, id, name, parentId);
      return {
        ...item,
        children: [{ id, name, parentId, subDir }],
      };
    } else if (item.children) {
      // console.log(data, id, name, parentId);
      return {
        ...item,
        children: insertBreadcrumb(item.children, id, name, parentId, subDir),
      };
    }

    return item;
  });
  return updateData;
};

const removeBreadCrumbChildren = (data, id) => {
  return data.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        children: [],
      };
    } else if (item.children) {
      return {
        ...item,
        children: removeBreadCrumbChildren(item.children, id),
      };
    }
    return item;
  });
};

function GetFreeMaterial() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dirData, setDirData] = useState();
  const [searchParams] = useSearchParams();
  const docId = searchParams.get("id") ? searchParams.get("id") : "49";
  const [breadcrumbData, setBreadcrumbData] = useState([
    { name: "Home", id: docId, parentId: docId, subDir: "1" },
  ]);

  // Update breadcrumbData when URL changes
  useEffect(() => {
    const id = searchParams.get("id") || "49";
    const name = "Current Directory"; // Replace with dynamic name if possible
    const parentId = "ParentID"; // Set a dynamic parentId if possible
    const subDir = "1"; // Set subDir as needed

    setBreadcrumbData((prevData) => {
      // Update breadcrumbs by adding or removing based on the new URL
      let updatedData;
      if (parentId) {
        updatedData = insertBreadcrumb(prevData, id, name, parentId, subDir);
      } else {
        updatedData = [...prevData, { id, name, parentId, subDir }];
      }
      return removeBreadCrumbChildren(updatedData, id);
    });
  }, [location, searchParams]);
  const handleNavigate = (id, name, parentId, subDir) => {
    navigate(`/get-free-materials?id=${id}`, {
      state: { dirId: id, subDir: subDir },
    });

    setBreadcrumbData((prevData) => {
      let updatedData;
      if (parentId) {
        updatedData = insertBreadcrumb(prevData, id, name, parentId, subDir);
      } else {
        updatedData = [...prevData, { id, name, parentId, subDir }];
      }
      return removeBreadCrumbChildren(updatedData, id);
    });
  };

  return (
    <LayoutAdjuster>
      <div className="flex flex-col justify-start items-center w-full gap-5 m-5 mt-16">
        <div className="w-full pt-2 pl-5">
          <Breadcrumbs data={breadcrumbData} handleNavigate={handleNavigate} />
        </div>
        <div className="w-full">
          <GetDir
            contentType={"5"}
            directoryType={"5"}
            directoryTypeId={"-1"}
            dirData={dirData}
            setDirData={setDirData}
            handleNavigate={handleNavigate}
          />
        </div>
      </div>
    </LayoutAdjuster>
  );
}

export default GetFreeMaterial;
