/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { updateCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";
import { Loader, UploadCloud } from "lucide-react";
import { trim } from "../../utils/trim";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import UpdateBtn from "@/utils/UpdateBtn";
import GetImageToUpload from "../images/GetImageToUpload";
import { setImageURL } from "@/redux/image/imageURLSlice";

function UpdateCourse({ id }) {
  const [open, setOpen] = useState(false);
  const [course, setCourse] = useState([]);
  const [courseDescription, setCourseDescription] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [durationUnit, setDurationunit] = useState("");
  const [isUploadImageOpen, setIsUploadImageOpen] = useState(false);
  const imageURL = useSelector((state) => state.imageURL.imageURL);

  const dispatch = useDispatch();

  const fetchCourse = async () => {
    if (isFetching) return;
    setIsFetching(true);
    try {
      const formData = new FormData();
      formData.append("course_type", 1);
      formData.append("course_id", id);
      const response = await axios.post(
        `${API_URL}/admin/courses/getcoursebyid.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status == 200) {
        const duration = trim(response.data.data.course_duration);
        setDurationunit(duration[1]);
        setCourse((prev) => ({
          ...prev,
          ...response.data.data,
          course_duration: duration[0],
        }));
        dispatch(setImageURL(response.data.data.img_url));
        setCourseDescription(response.data.data.course_description);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(error.response?.data?.message || "Error fetching courses");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (open && !dataLoaded) {
      fetchCourse();
    }
  }, [open, dataLoaded]);

  useEffect(() => {
    if (!open) {
      setCourse([]);
      setCourseDescription("");
      setDataLoaded(false);
      dispatch(setImageURL(""));
      setDurationunit("");
    }
  }, [open, dispatch]);

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
    if (
      !course.course_name ||
      !course.price ||
      !course.course_duration ||
      !imageURL ||
      !course.original_price
    ) {
      toast.error("All fields are required");
      return;
    }
    if (Number(course.original_price) < Number(course.price)) {
      toast.error("Price must be smaller than original price");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("courseid", course.id);
      formData.append("name", course.course_name);
      formData.append("price", course.price);
      formData.append("original_price", course.original_price);
      formData.append("duration", `${course.course_duration} ${durationUnit}`);
      formData.append("description", courseDescription);
      formData.append("imgurl", imageURL);
      const response = await axios.post(
        `${API_URL}/admin/courses/updatecourse.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status == 201) {
        dispatch(
          updateCourse({
            id: course.id,
            course_name: course.course_name,
            price: course.price,
            original_price: course.original_price,
            course_duration: `${course.course_duration} ${durationUnit}`,
            course_description: courseDescription,
            img_url: imageURL,
            total_number_of_videos: course.total_number_of_videos,
            isactive: course.isactive,
          })
        );
        toast.success("Course Updated Sucessfully");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(error.response?.data?.message || "Error updating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div onClick={() => setOpen(true)}>
          <UpdateBtn />
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-auto w-full sm:w-[50%] px-4">
        <SheetHeader className="text-2xl font-bold text-center sm:text-left">
          Update Course
        </SheetHeader>
        <div className="flex flex-col justify-center items-center space-y-4">
          <div className="w-full flex flex-col space-y-4">
            <div className="w-full my-2">
              {dataLoaded && (
                <FormField
                  htmlFor={"course_name"}
                  id={"course_name"}
                  type={"text"}
                  placeholder={"Name"}
                  name={"course_name"}
                  value={course.course_name}
                  onChange={handleChange}
                >
                  Name
                </FormField>
              )}
            </div>
            <p className="block text-gray-700 text-sm font-bold">Description</p>
            <div className="w-full my-2">
              {dataLoaded && (
                <Tiptap
                  placeholder={"Description"}
                  getHtmlData={getDescriptionData}
                  initialContent={courseDescription}
                />
              )}
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
              >
                Price
              </FormField>
              <FormField
                htmlFor={"original_price"}
                id={"original_price"}
                type={"number"}
                placeholder={"Original Price"}
                name={"original_price"}
                value={course.original_price}
                onChange={handleChange}
              >
                Original Price
              </FormField>
              <FormField
                htmlFor={"duration"}
                id={"duration"}
                type={"number"}
                placeholder={"Duration"}
                name={"course_duration"}
                value={course.course_duration}
                onChange={handleChange}
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
            <div className="my-4 flex justify-between items-center">
              <div
                onClick={() => setIsUploadImageOpen(true)}
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
              </div>
              {imageURL ? (
                <img
                  src={imageURL}
                  alt="image"
                  className="w-60 h-36 rounded-lg m-auto"
                />
              ) : (
                <div className="rounded-lg border-2 border-gray-300 border-dashed h-36 w-60 text-center items-center m-auto">
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
            Update Course
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

export default UpdateCourse;
