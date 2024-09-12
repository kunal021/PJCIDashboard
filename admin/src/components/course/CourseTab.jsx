import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LayoutAdjuster from "@/utils/LayoutAdjuster";
import GetDir from "../directory/GetDir";
import CreateDir from "../directory/CreateDir";

function CourseTab() {
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
              <CreateDir type={"directory"} />
            </TabsTrigger>
            <TabsTrigger value="Test" className="w-full flex justify-between">
              <p>Test</p>
              <CreateDir type={"directory"} />
            </TabsTrigger>
            <TabsTrigger value="Notes" className="w-full flex justify-between">
              <p>Notes</p>
              <CreateDir type={"directory"} />
            </TabsTrigger>
            <TabsTrigger
              value="Materials"
              className="w-full flex justify-between"
            >
              <p>Materials</p>
              <CreateDir
                type={"directory"}
                directoryType={"1"}
                parentId={"null"}
                contentType={"4"}
                directoryTypeId={"1"}

                // dirData={dirData}
                // setDirData={setDirData}
              />
            </TabsTrigger>
          </TabsList>

          {/* Tabs Content */}
          <div className="flex-grow overflow-y-auto">
            <TabsContent value="Video">
              <GetDir
                contentType={"4"}
                directoryType={"1"}
                directoryTypeId={"1"}
                parentId={null}
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
