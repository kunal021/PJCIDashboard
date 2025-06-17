import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { API_URL } from "@/url";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import AddTopic from "./AddTopic";

export default function LinkTeacherTopic() {
  const [teachers, setTeachers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [isForLink, setIsForLink] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post(
          `${API_URL}/doubt/getteachersandtopicslist.php`
        );

        if (res.data.status === 200) {
          setTeachers(res.data.teachers);
          setTopics(res.data.topics);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (!selectedTeacher || !selectedTopic) {
      toast.error("Please select teacher and topic");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("teacher_id", selectedTeacher);
      formData.append("topic_id", selectedTopic);
      formData.append("is_for_link", isForLink);

      const response = await axios.post(
        `${API_URL}/doubt/linkteachertotopic.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.data);
        // Reset form
        setSelectedTeacher("");
        setSelectedTopic("");
        setIsForLink(false);
      } else {
        toast.error(response.data.data);
      }
    } catch (error) {
      console.error("Error submitting payload:", error);
      toast.error(
        error?.response?.data?.message || "Error Linking Teacher and Topic"
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Link Teacher to Topic
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Link Teacher to Topic</DialogTitle>
        </DialogHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Teacher</Label>
            <Select onValueChange={setSelectedTeacher}>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers?.map((teacher, index) => (
                  <SelectItem key={index} value={teacher?.mo_number}>
                    {teacher?.teacher_name} ({teacher?.mo_number})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2 items-center">
              <Label>Topic</Label>
              <AddTopic setTopics={setTopics} />
            </div>
            <Select onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics?.map((topic) => (
                  <SelectItem key={topic?.topic_id} value={topic?.topic_id}>
                    {topic?.topic_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isForLink"
              checked={isForLink}
              onCheckedChange={setIsForLink}
            />
            <Label htmlFor="isForLink">
              Set true if admin wants to link teacher to topic
            </Label>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Submit
          </Button>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
