import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LayoutAdjuster from "@/utils/LayoutAdjuster";
import GetDir from "../directory/GetDir";
import { useEffect, useState } from "react";
import Breadcrumbs from "../directory/BreadCrumbs";
import { useNavigate, useSearchParams } from "react-router-dom";

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

function CourseTab() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const courseId = searchParams.get("id");
  const [dirData, setDirData] = useState();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "Video"
  );

  const initialId = localStorage.getItem("initialId");
  const initialBreadcrumbs = {
    Video: [
      {
        name: "Home",
        id: initialId,
        parentId: initialId,
        subDir: "1",
      },
    ],
    Test: [
      {
        name: "Home",
        id: initialId,
        parentId: initialId,
        subDir: "1",
      },
    ],
    Notes: [
      {
        name: "Home",
        id: initialId,
        parentId: initialId,
        subDir: "1",
      },
    ],
    Materials: [
      {
        name: "Home",
        id: initialId,
        parentId: initialId,
        subDir: "1",
      },
    ],
  };
  const [breadcrumbData, setBreadcrumbData] = useState(
    initialBreadcrumbs.Video
  );

  useEffect(() => {
    const id = searchParams.get("id");
    const name = "Current Directory"; // Replace with dynamic name if possible
    const parentId = "ParentID"; // Set a dynamic parentId if possible
    const subDir = "1"; // Set subDir as needed

    setBreadcrumbData((prevData) => {
      let updatedData;
      if (parentId) {
        updatedData = insertBreadcrumb(prevData, id, name, parentId, subDir);
      } else {
        updatedData = [...prevData, { id, name, parentId, subDir }];
      }
      return removeBreadCrumbChildren(updatedData, id);
    });
  }, [searchParams]);

  const handleNavigate = (id, name, parentId, subDir) => {
    navigate(`/get-course-videos?id=${id}`, {
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

  const handleTabChange = (value) => {
    setActiveTab(value);
    localStorage.setItem("activeTab", value);

    // Reset directory to initial state when changing tabs
    const initialId = localStorage.getItem("initialId");
    navigate(`/get-course-content?id=${initialId}`, {
      state: { dirId: initialId, subDir: "1" },
    });
    setBreadcrumbData(initialBreadcrumbs[value]);

    // Reset dirData state
    setDirData(null);
  };

  return (
    <LayoutAdjuster>
      <div className="w-[80%] mx-auto mt-20">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="h-[calc(100vh-80px)] flex flex-col"
        >
          {/* Tabs Header */}
          <TabsList className="w-full justify-evenly">
            <TabsTrigger value="Video" className="w-full flex justify-between">
              <p>Video</p>
            </TabsTrigger>
            <TabsTrigger value="Test" className="w-full flex justify-between">
              <p>Test</p>
            </TabsTrigger>
            <TabsTrigger value="Notes" className="w-full flex justify-between">
              <p>Notes</p>
            </TabsTrigger>
            <TabsTrigger
              value="Materials"
              className="w-full flex justify-between"
            >
              <p>Materials</p>
            </TabsTrigger>
          </TabsList>
          <div className="w-full pt-2">
            <Breadcrumbs
              data={breadcrumbData}
              handleNavigate={handleNavigate}
            />
          </div>
          {/* Tabs Content */}
          <div className="flex-grow overflow-y-auto">
            <TabsContent value="Video">
              <GetDir
                contentType={"4"}
                directoryType={"1"}
                directoryTypeId={"1"}
                dirData={dirData}
                setDirData={setDirData}
                handleNavigate={handleNavigate}
              />
            </TabsContent>
            <TabsContent value="Test">
              <GetDir
                contentType={"3"}
                directoryType={"3"}
                directoryTypeId={"-1"}
                dirData={dirData}
                setDirData={setDirData}
                handleNavigate={handleNavigate}
              />
            </TabsContent>
            <TabsContent value="Notes">
              <GetDir
                contentType={"6"}
                directoryType={"6"}
                directoryTypeId={"-1"}
                dirData={dirData}
                setDirData={setDirData}
                handleNavigate={handleNavigate}
              />
            </TabsContent>
            <TabsContent value="Materials">
              <GetDir
                contentType={"5"}
                directoryType={"5"}
                directoryTypeId={"-1"}
                dirData={dirData}
                setDirData={setDirData}
                handleNavigate={handleNavigate}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </LayoutAdjuster>
  );
}

export default CourseTab;
