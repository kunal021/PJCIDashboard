import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LayoutAdjuster from "@/utils/LayoutAdjuster";
import GetDir from "../directory/GetDir";
import { useState } from "react";
import Breadcrumbs from "../directory/BreadCrumbs";
import { useNavigate, useSearchParams } from "react-router-dom";

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
  const courseId = searchParams.get("id");
  const [dirData, setDirData] = useState();
  const [breadcrumbData, setBreadcrumbData] = useState(() => {
    return [{ name: "Home", id: courseId, parentId: courseId }];
  });

  // console.log(breadcrumbData);
  // const [breadcrumbData, setBreadcrumbData] = useState(() => {
  //   const savedBreadcrumbs = localStorage.getItem("breadcrumbData");
  //   return savedBreadcrumbs
  //     ? JSON.parse(savedBreadcrumbs)
  //     : [{ name: "Home", id: courseId, parentId: courseId }];
  // });

  // console.log(dirData);

  // useEffect(() => {
  //   if (breadcrumbData.length > 0) {
  //     localStorage.setItem("breadcrumbData", JSON.stringify(breadcrumbData));
  //   }
  // }, [breadcrumbData]);

  const handleNavigate = (id, name, parentId) => {
    navigate(`/get-course-videos?id=${id}`, { state: { dirId: id } });

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
      <div className="w-[80%] mx-auto mt-20">
        <Tabs
          defaultValue="Video"
          className="h-[calc(100vh-80px)] flex flex-col"
        >
          {/* Tabs Header */}
          <TabsList className="w-full justify-evenly">
            <TabsTrigger value="Video" className="w-full flex justify-between">
              <p>Video</p>
              {/* <CreateDir
                type={"directory"}
                directoryType={"1"}
                parentId={"null"}
                contentType={"4"}
                directoryTypeId={"1"}

                // dirData={dirData}
                // setDirData={setDirData}
              /> */}
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
            <TabsContent value="Test">Change your Test here.</TabsContent>
            <TabsContent value="Notes">Change your Notes here.</TabsContent>
            <TabsContent value="Materials">
              Change your Materials here.
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </LayoutAdjuster>
  );
}

export default CourseTab;
