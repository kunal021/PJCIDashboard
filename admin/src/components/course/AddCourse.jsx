/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import FormField from "../../utils/FormField";
import { API_URL } from "../../url";
import toast from "react-hot-toast";
import Tiptap from "../../utils/TextEditor";
import { Loader, Plus, UploadCloud } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDispatch, useSelector } from "react-redux";
import GetImageToUpload from "../images/GetImageToUpload";
import { setImageURL } from "@/redux/image/imageURLSlice";
import { addCourse } from "@/redux/courses/courseSlice";

function AddCourse() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState({
    name: "",
    price: "",
    originalprice: "",
    duration: "",
  });
  const imageURL = useSelector((state) => state.imageURL.imageURL);
  const [loading, setLoading] = useState(false);
  const [courseDescription, setCourseDescription] = useState("");
  const [durationUnit, setDurationunit] = useState("Day");
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);

  const getDescriptionData = (html) => {
    setCourseDescription(html);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!course.name || !course.price || !course.duration || !imageURL) {
      toast.error("All fields are required");
      return;
    }
    if (Number(course.originalprice) < Number(course.price)) {
      toast.error("Price must be smaller than original price");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", course.name);
      formData.append("price", course.price);
      formData.append("original_price", course.originalprice);
      formData.append("duration", `${course.duration} ${durationUnit}`);
      formData.append("description", courseDescription);
      formData.append("imgurl", imageURL);
      const response = await axios.post(
        `${API_URL}/admin/courses/addcourse.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status == 201) {
        toast.success("Course Added Sucessfully");
        dispatch(
          addCourse({
            id: response.data.id,
            course_name: course.name,
            price: course.price,
            original_price: course.originalprice,
            course_duration: course.duration,
            img_url: imageURL,
            directory_id: response.data.directory_id,
          })
        );
        setCourse({
          name: "",
          price: "",
          originalprice: "",
          duration: "",
        });
        setCourseDescription("");
        setDurationunit("");
        dispatch(setImageURL(""));
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(error.response?.data?.message || "Error adding course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        asChild
        className="cursor-pointer border rounded-md bg-blue-50 p-2 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200 md:w-auto"
      >
        <div onClick={() => setOpen(true)}>
          {useIsMobile() ? <Plus className="h-5 w-5" /> : "Add Course"}
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-auto w-full md:w-[50%] px-4">
        <SheetHeader className="text-2xl font-bold text-center sm:text-left">
          Add Course
        </SheetHeader>
        <div className="flex flex-col justify-center items-center space-y-4">
          <div className="w-full flex flex-col space-y-4">
            <div className="w-full my-2">
              <FormField
                htmlFor={"name"}
                id={"name"}
                type={"text"}
                placeholder={"Name"}
                name={"name"}
                value={course.name}
                onChange={handleChange}
              >
                Name
              </FormField>
            </div>
            <p className="block text-gray-700 text-sm font-bold">Description</p>
            <div className="w-full my-2">
              <Tiptap
                placeholder={"Description"}
                getHtmlData={getDescriptionData}
              />
            </div>
            <div className="flex flex-col justify-center items-center md:flex-row md:space-x-6">
              <FormField
                htmlFor={"price"}
                id={"price"}
                type={"number"}
                placeholder={"Price"}
                name={"price"}
                value={course.price}
                onChange={handleChange}
                className="w-full"
              >
                Price
              </FormField>
              <FormField
                htmlFor={"originalprice"}
                id={"originalprice"}
                type={"number"}
                placeholder={"Original Price"}
                name={"originalprice"}
                value={course.originalprice}
                onChange={handleChange}
                className="w-full"
              >
                Original Price
              </FormField>
              <FormField
                htmlFor={"duration"}
                id={"duration"}
                type={"number"}
                placeholder={"Duration"}
                name={"duration"}
                value={`${course.duration}`}
                onChange={handleChange}
                className="w-full"
              >
                Duration
              </FormField>
              <select
                value={durationUnit}
                onChange={(e) => setDurationunit(e.target.value)}
                className="w-full mt-2.5 py-1.5 px-2 border rounded-md border-gray-300"
              >
                <option value={"Day"}>Day</option>
                <option value={"Month"}>Month</option>
                <option value={"Year"}>Year</option>
              </select>
            </div>
            <div className="my-4 flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
              <label
                onClick={() => setIsUploadImageOpen(true)}
                className="flex flex-col justify-center items-center w-full max-w-xs h-36 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
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
              {imageURL ? (
                <img
                  src={imageURL}
                  alt="image"
                  className="w-full max-w-xs h-36 rounded-lg"
                />
              ) : (
                <div className="rounded-lg border-2 border-gray-300 border-dashed h-36 w-full max-w-xs flex justify-center items-center">
                  Preview
                </div>
              )}
            </div>

            <GetImageToUpload
              isOpen={isUploadImageOpen}
              onClose={() => setIsUploadImageOpen(false)}
            />
          </div>
        </div>
        <SheetFooter className="flex flex-col gap-4 mt-5">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-md bg-blue-50 py-2 px-4 text-sm font-semibold hover:bg-blue-100 border border-blue-200 text-black w-full"
          >
            Add Course
          </button>
          <button
            disabled={loading}
            onClick={() => !loading && setOpen(false)}
            className="border rounded-md bg-red-50 py-2 px-4 text-sm font-semibold hover:bg-red-100 border-red-200 text-black w-full disabled:opacity-50"
          >
            Close
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default AddCourse;
