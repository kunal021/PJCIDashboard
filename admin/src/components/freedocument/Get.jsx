import LayoutAdjuster from "@/utils/LayoutAdjuster";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumbs from "./BreadCrumbs";
import GetDir from "./GetDir";

const insertBreadcrumb = (data, id, name, parentId) => {
  const updateData = data.map((item) => {
    if (item.id === parentId) {
      console.log(data, id, name, parentId);
      return {
        ...item,
        children: [{ id, name, parentId }],
      };
    } else if (item.children) {
      console.log(data, id, name, parentId);
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
  const [dirData, setDirData] = useState();
  const [searchParams] = useSearchParams();
  const docId = searchParams.get("id") ? searchParams.get("id") : 49;
  const [breadcrumbData, setBreadcrumbData] = useState(() => {
    return [{ name: "Home", id: 86, parentId: docId }];
  });

  // console.log(breadcrumbData);

  // useEffect(() => {
  //   if (breadcrumbData.length > 0) {
  //     localStorage.setItem("docBreadcrumbData", JSON.stringify(breadcrumbData));
  //   }
  // }, [breadcrumbData]);

  const handleNavigate = (id, name, parentId) => {
    navigate(`/get-free-materials?id=${id}`, { state: { dirId: id } });

    setBreadcrumbData((prevData) => {
      let updatedData;
      if (parentId) {
        updatedData = insertBreadcrumb(prevData, id, name, parentId);
      } else {
        updatedData = [...prevData, { id, name, parentId }];
      }
      return removeBreadCrumbChildren(updatedData, id);
    });
  };

  return (
    <LayoutAdjuster>
      <div className="flex flex-col justify-start items-center w-full gap-5 m-5 mt-16">
        <div className="w-full pt-2 pl-5">
          {/* <Breadcrumbs data={breadcrumbData} handleNavigate={handleNavigate} /> */}
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
