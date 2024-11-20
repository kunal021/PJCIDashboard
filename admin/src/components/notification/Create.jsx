import axios from "axios";
import { API_URL } from "../../url";
import toast from "react-hot-toast";
import LayoutAdjuster from "@/utils/LayoutAdjuster";
import { useState } from "react";
import FormField from "@/utils/FormField";
import { Loader, UploadCloud } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import GetData from "./GetData";
import Preview from "./Preview";

function CreateNotification() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    title: "",
    body: "",
    image_url: "",
    type: "0",
    type_id: "0",
  });

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
    // console.log(data);
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image_url", data.image_url);
      formData.append("type", data.type);
      formData.append("type_id", data.type_id);
      formData.append("body", data.body);
      formData.append("title", data.title);
      const response = await axios.post(
        `${API_URL}/admin/notification/sendnotification.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      console.log(response);
      if (response.status === 200) {
        toast.success("Notification Sent Successfully");
        setData({
          title: "",
          body: "",
          image_url: "",
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

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        `${API_URL}/admin/courses/uplodecourseimage.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      console.log(response);
      if (response.status === 200) {
        setData((prev) => ({ ...prev, image_url: response.data.url }));
        toast.success("Image Uploaded Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image");
    } finally {
      setLoading(false);
    }
  };

  // console.log(data);
  return (
    <LayoutAdjuster>
      <div className="w-[80%] flex flex-row-reverse justify-center items-center gap-4 my-10">
        <div className="w-full flex flex-col justify-center items-center gap-4 relative">
          <Preview
            body={data.body}
            imgUrl={data.image_url}
            title={data.title}
          />
        </div>
        <Card className="w-full my-6">
          <CardHeader className="text-2xl font-bold text-center">
            Send Notification
          </CardHeader>
          <CardContent className="w-full flex flex-col justify-center items-center">
            <div className="w-full flex flex-col justify-center items-center gap-4">
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
                type={"Text"}
                placeholder={"Body"}
                name={"body"}
                value={data.body}
                onChange={handleChange}
              >
                Body
              </FormField>
            </div>

            <div className="w-full flex flex-col justify-center items-center gap-4">
              <select
                name="type"
                value={data.type}
                onChange={handleChange}
                className="w-full h-fit mt-2.5 py-1.5 px-1 flex justify-center items-center border rounded-md border-gray-300"
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
            <div className="my-4 flex justify-between items-center w-full">
              <input
                disabled={loading}
                id="fileinput"
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                className="hidden"
              />
              <label
                htmlFor="fileinput"
                className="flex flex-col justify-center items-center w-60 h-36 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
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
              </label>
              {/* {data.image_url ? (
                <img
                  src={data.image_url}
                  alt="image"
                  className="w-60 h-36 rounded-lg m-auto"
                />
              ) : (
                <div className="rounded-lg border-2 border-gray-300 border-dashed h-36 w-60 text-center items-center m-auto">
                  Preview
                </div>
              )} */}
            </div>
            <FormField
              htmlFor={"image_url"}
              id={"image_url"}
              type={"text"}
              placeholder={"Image Url"}
              name={"image_url"}
              value={data.image_url}
              onChange={handleChange}
            >
              Image Url
            </FormField>
          </CardContent>
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
    </LayoutAdjuster>
  );
}

export default CreateNotification;
