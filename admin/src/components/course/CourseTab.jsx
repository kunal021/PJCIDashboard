import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LayoutAdjuster from "@/utils/LayoutAdjuster";

function CourseTab() {
  return (
    <LayoutAdjuster>
      <Tabs defaultValue="Video" className="w-[80%]">
        <TabsList className="w-full justify-evenly">
          <TabsTrigger value="Video" className="w-full">
            Video
          </TabsTrigger>
          <TabsTrigger value="Test" className="w-full">
            Test
          </TabsTrigger>
          <TabsTrigger value="Notes" className="w-full">
            Notes
          </TabsTrigger>
          <TabsTrigger value="Materials" className="w-full">
            Materials
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Video">
          Make changes to your video here.
        </TabsContent>
        <TabsContent value="Test">Change your Test here.</TabsContent>
        <TabsContent value="Notes">Change your Notes here.</TabsContent>
        <TabsContent value="Materials">Change your Materials here.</TabsContent>
      </Tabs>
    </LayoutAdjuster>
  );
}

export default CourseTab;
