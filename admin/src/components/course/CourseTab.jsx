import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LayoutAdjuster from "@/utils/LayoutAdjuster";
import GetDir from "../directory/GetDir";
import { useEffect, useState } from "react";
import Breadcrumbs from "../directory/BreadCrumbs";
import { useNavigate, useSearchParams } from "react-router-dom";
import GetCourseById from "./GetCourseById";

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
  const courseId = localStorage.getItem("courseId");
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
    Note: [
      {
        name: "Home",
        id: initialId,
        parentId: initialId,
        subDir: "1",
      },
    ],
    Material: [
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
    navigate(`/get-course-content?id=${id}`, {
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
      <div className="w-[80%] mx-auto my-10">
        <GetCourseById id={courseId} />
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
            <TabsTrigger value="Note" className="w-full flex justify-between">
              <p>Notes</p>
            </TabsTrigger>
            <TabsTrigger
              value="Material"
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
                dirData={dirData}
                value={"Video"}
                setDirData={setDirData}
                handleNavigate={handleNavigate}
              />
            </TabsContent>
            <TabsContent value="Test">
              <GetDir
                contentType={"3"}
                directoryType={"1"}
                dirData={dirData}
                value={"Test"}
                setDirData={setDirData}
                handleNavigate={handleNavigate}
              />
            </TabsContent>
            <TabsContent value="Note">
              <GetDir
                contentType={"6"}
                directoryType={"1"}
                dirData={dirData}
                value={"Note"}
                setDirData={setDirData}
                handleNavigate={handleNavigate}
              />
            </TabsContent>
            <TabsContent value="Material">
              <GetDir
                contentType={"5"}
                directoryType={"1"}
                dirData={dirData}
                value={"Material"}
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
