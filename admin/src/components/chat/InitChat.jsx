import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { API_URL } from "@/url";
import { useAuth } from "@/hooks/use-auth";

export default function InitiateChat() {
  const { authToken } = useAuth();
  const [chatType, setChatType] = useState("topic");
  const [chatTypeId, setChatTypeId] = useState("");
  const [chatTitle, setChatTitle] = useState("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatTypes = [
    { value: "topic", label: "Topic" },
    { value: "course", label: "Course" },
    { value: "test_series", label: "Test Series" },
    { value: "material", label: "Material" },
    { value: "book", label: "Book" },
  ];

  useEffect(() => {
    if (open && chatType !== "topic") {
      fetchItems();
    }
  }, [chatType, open]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setItems([]);
      let response;
      const formData = new FormData();

      switch (chatType) {
        case "book":
          response = await axios.post(`${API_URL}/admin/book/getallbook.php`);
          setItems(response.data.data);
          break;
        case "course":
          formData.append("course_type", 1);
          response = await axios.post(
            `${API_URL}/admin/courses/getallcourse.php`,
            formData,
            { headers: { "content-type": "multipart/form-data" } }
          );
          setItems(response.data.data);
          break;
        case "material":
          formData.append("type", 1);
          response = await axios.post(
            `${API_URL}/admin/docs/getdoc.php`,
            formData,
            { headers: { "content-type": "multipart/form-data" } }
          );
          setItems(response.data.data);
          break;
        case "test_series":
          response = await axios.post(
            `${API_URL}/admin/testseries/getalltestseries.php`
          );
          setItems(response.data.data);
          break;
        default:
          setItems([]);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      toast.error(error.response?.data?.message || "Error fetching items");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!authToken?.number || !authToken?.name || !chatTypeId || !chatTitle) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("student_id", authToken.number);
      formData.append("student_name", authToken.name);
      formData.append("chat_type", chatType);
      formData.append("chat_type_id", chatTypeId);
      formData.append("chat_title", chatTitle);

      const response = await axios.post(
        `${API_URL}/doubt/initchat.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        toast.success("Chat initiated successfully");
        setOpen(false);
        // Reset form
        setChatType("topic");
        setChatTypeId("");
        setChatTitle("");
        setItems([]);
      } else {
        toast.error(response.data.data || "Failed to initiate chat");
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
      toast.error(error?.response?.data?.message || "Error initiating chat");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
          Init Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Initiate New Chat</DialogTitle>
        </DialogHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Chat Type *</Label>
            <Select
              value={chatType}
              onValueChange={(value) => {
                setChatType(value);
                setChatTypeId("");
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select chat type" />
              </SelectTrigger>
              <SelectContent>
                {chatTypes.map((type) => (
                  <SelectItem key={type?.value} value={type?.value}>
                    {type?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {chatType !== "topic" && (
            <div className="space-y-2">
              <Label>
                {chatTypes.find((t) => t?.value === chatType)?.label} *
              </Label>
              {loading ? (
                <div className="text-sm text-muted-foreground">
                  Loading items...
                </div>
              ) : items?.length > 0 ? (
                <Select value={chatTypeId} onValueChange={setChatTypeId}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={`Select a ${chatType?.replace("_", " ")}`}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {items?.map((item) => (
                      <SelectItem key={item?.id} value={item?.id?.toString()}>
                        {item?.name || item?.title || item?.book_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No items available
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>Chat Title *</Label>
            <Input
              value={chatTitle}
              onChange={(e) => setChatTitle(e.target.value)}
              placeholder="Enter chat title"
            />
          </div>

          <Button className="w-full mt-4" onClick={handleSubmit}>
            Initiate Chat
          </Button>
        </CardContent>
      </DialogContent>
    </Dialog>
  );
}
