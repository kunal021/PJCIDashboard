import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumbs from "./BreadCrumbs";
import GetDir from "./GetDir";
import { useHeading } from "@/hooks/use-heading";

const insertBreadcrumb = (data, id, name, parentId, subDir) => {
  const updateData = data.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        children: [{ id, name, parentId, subDir }],
      };
    } else if (item.children) {
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
  const { setHeading } = useHeading();
  const navigate = useNavigate();
  const location = useLocation();
  const [dirData, setDirData] = useState();
  const [searchParams] = useSearchParams();
  const docId = searchParams.get("id") ? searchParams.get("id") : "49";
  const [breadcrumbData, setBreadcrumbData] = useState([
    { name: "Home", id: docId, parentId: docId, subDir: "1" },
  ]);

  useEffect(() => {
    const id = searchParams.get("id") || "49";
    const name = "Current Directory";
    const parentId = "ParentID";
    const subDir = "1";

    setBreadcrumbData((prevData) => {
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
    navigate(`/doc/free-materials?id=${id}`, {
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

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          Free Materilas List
        </h1>
      </div>
    );
  }, [setHeading]);

  return (
    <>
      <div className="flex flex-col justify-start items-center w-full gap-5 px-3 mt-10">
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
    </>
  );
}

export default GetFreeMaterial;
