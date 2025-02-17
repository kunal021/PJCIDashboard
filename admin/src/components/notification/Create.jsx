import axios from "axios";
import { API_URL } from "../../url";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import FormField from "@/utils/FormField";
import { Loader, UploadCloud } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import GetData from "./GetData";
import Preview from "./Preview";
import { useHeading } from "@/hooks/use-heading";
import { useSelector } from "react-redux";
import GetImageToUpload from "../images/GetImageToUpload";

function CreateNotification() {
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    body: "",
    type: "0",
    type_id: "0",
  });
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const imageURL = useSelector((state) => state.imageURL.imageURL);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          Send Notification
        </h1>
      </div>
    );
  }, [setHeading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (data.type == "0") {
      data.type_id = "0";
    }
    if (!data.title || !data.body || !data.type || !data.type_id) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image_url", imageURL);
      formData.append("type", data.type);
      formData.append("type_id", data.type_id);
      formData.append("body", data.body);
      formData.append("title", data.title);
      const response = await axios.post(
        `${API_URL}/admin/notification/sendnotification.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      if (response.status === 200) {
        toast.success("Notification Sent Successfully");
        setData({
          title: "",
          body: "",
          type: "0",
          type_id: "",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message || "Error Sending Notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row-reverse justify-center items-start gap-6 px-4 my-10">
      <div className="w-full flex flex-col justify-center items-center gap-6 relative">
        <Preview body={data.body} imgUrl={imageURL} title={data.title} />
      </div>
      <Card className="w-full lg:w-1/2">
        <CardContent className="w-full flex flex-col justify-center items-center gap-4 mt-4">
          {/* Title and Body Input Fields */}
          <div className="w-full flex flex-col gap-4">
            <FormField
              htmlFor={"title"}
              id={"title"}
              type={"text"}
              placeholder={"Title"}
              name={"title"}
              value={data.title}
              onChange={handleChange}
            >
              Title
            </FormField>

            <FormField
              htmlFor={"body"}
              id={"body"}
              type={"textarea"}
              placeholder={"Body"}
              name={"body"}
              value={data.body}
              onChange={handleChange}
            >
              Body
            </FormField>
          </div>

          {/* Type Selection */}
          <div className="w-full flex flex-col gap-4">
            <select
              name="type"
              value={data.type}
              onChange={handleChange}
              className="w-full h-fit py-2 px-3 border rounded-md border-gray-300"
            >
              <option value={"0"}>All</option>
              <option value={"1"}>Course</option>
              <option value={"8"}>Book</option>
              <option value={"5"}>Material</option>
              <option value={"7"}>Test Series</option>
            </select>
            <GetData
              type={data.type}
              handleChange={handleChange}
              value={data.type_id}
              setValue={setData}
              useType={"add"}
            />
          </div>

          {/* Image Upload Section */}
          <div className="my-4 flex flex-col sm:flex-row justify-between items-center w-full gap-4">
            <div
              onClick={() => setIsUploadImageOpen(true)}
              className="flex flex-col justify-center items-center w-full h-36 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
            >
              {!loading ? (
                <>
                  <UploadCloud />
                  <p>Upload Image</p>
                </>
              ) : (
                <>
                  <Loader className="animate-spin h-6 w-6" />
                  <p>Uploading...</p>
                </>
              )}
            </div>
          </div>

          <GetImageToUpload
            isOpen={isUploadImageOpen}
            onClose={() => setIsUploadImageOpen(false)}
          />
        </CardContent>

        {/* Footer Button */}
        <CardFooter>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-full"
          >
            {loading ? "Sending...." : "Send Notification"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CreateNotification;
