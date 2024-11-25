import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GetAllTestForSeries from "./GetAllTestForSeries";
import AddTestInSeries from "./AddTestInSeries";
import AddMaterialInSeries from "./AddMateralInSeries";
import GetAllMaterialForSeries from "./GetAllMaterialForSeries";

function GetTestTab() {
  return (
    <div className="w-full mb-6">
      <Tabs defaultValue="Test" className="h-fit flex flex-col">
        {/* Tabs Header */}
        <TabsList className="w-full justify-evenly sticky top-0 z-10">
          <TabsTrigger value="Test" className="w-full flex justify-between">
            <p>Test</p>
            <AddTestInSeries />
          </TabsTrigger>
          <TabsTrigger
            value="Materials"
            className="w-full flex justify-between"
          >
            <p>Materials</p>
            <AddMaterialInSeries />
          </TabsTrigger>
        </TabsList>
        {/* Tabs Content */}
        <div className="flex-grow overflow-y-auto">
          <TabsContent value="Test">
            <GetAllTestForSeries />
          </TabsContent>
          <TabsContent value="Materials">
            <GetAllMaterialForSeries />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default GetTestTab;
