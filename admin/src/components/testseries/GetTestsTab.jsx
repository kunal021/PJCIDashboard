import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GetAllTestForSeries from "./GetAllTestForSeries";
import AddTestInSeries from "./AddTestInSeries";

function GetTestTab() {
  return (
    <div className="w-full">
      <div className="w-full">
        <Tabs defaultValue="Test" className="h-fit flex flex-col">
          {/* Tabs Header */}
          <TabsList className="w-full justify-evenly">
            <TabsTrigger value="Test" className="w-full flex justify-between">
              <p>Test</p>
              <AddTestInSeries />
            </TabsTrigger>
            <TabsTrigger
              value="Materials"
              className="w-full flex justify-between"
            >
              <p>Materials</p>
            </TabsTrigger>
          </TabsList>
          {/* Tabs Content */}
          <div className="flex-grow overflow-y-auto">
            <TabsContent value="Test">
              <GetAllTestForSeries />
            </TabsContent>
            <TabsContent value="Materials">
              Change your Materials here.
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default GetTestTab;
