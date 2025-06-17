/* eslint-disable react/prop-types */
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { API_URL } from "@/url";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { Checkbox } from "../ui/checkbox";

export default function AddTopic({ setTopics }) {
  const [topicName, setTopicName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!topicName.trim()) {
      toast.error("Please enter a topic name");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("topic_name", topicName);
      formData.append("is_active", isActive ? "1" : "0");

      const response = await axios.post(
        `${API_URL}/doubt/addchattopic.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        toast.success("Topic added successfully");
        console.log(response);
        // setOpen(false);
        setTopics((prevTopics) => [...prevTopics, response.data.data]);
        setTopicName("");
        setIsActive(true);
      } else {
        toast.error(response.data.data || "Failed to add topic");
      }
    } catch (error) {
      console.error("Error adding topic:", error);
      toast.error(error?.response?.data?.message || "Error adding topic");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-6 w-4">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
        </DialogHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label>Topic Name</Label>
            <Input
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Enter topic name"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(!!checked)}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Add Topic
          </Button>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
