import { useState } from "react";
import { useDispatch } from "react-redux";
import { addFullCourse } from "../../redux/courses/fullCourseSlice";
import axios from "axios";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import { Loader, UploadCloud } from "lucide-react";

function AddFullCourse() {
  const [course, setCourse] = useState({
    price: "",
    duration: "",
    imgurl: "",
  });
  const [loading, setLoading] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const dispatch = useDispatch();

  const getNameData = (html) => {
    setCourseName(html);
  };
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", courseName);
      formData.append("price", course.price);
      formData.append("duration", course.duration);
      formData.append("description", courseDescription);
      formData.append("imgurl", course.imgurl);
      const response = await axios.post(
        `${API_URL}/admin/courses/addfullcourse.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      console.log(response);
      dispatch(addFullCourse(response.data));
      if (response.status == 201) {
        toast.success("Full Course Added Sucessfully");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setCourse({
      price: "",
      duration: "",
      imgurl: "",
    });
    setCourseName("");
    setCourseDescription("");
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

      // console.log(response.data);
      if (response.status === 200) {
        setCourse((prev) => ({ ...prev, imgurl: response.data.url }));
        toast.success("Image Uploaded Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Uploading Image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAdjuster>
      <div className="w-[80%] flex flex-col justify-center items-center mx-auto">
        <h1 className="text-center my-5 text-3xl font-bold">Add Full Course</h1>
        <div className="flex flex-col justify-center items-center mt-5 w-full">
          <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border border-gray-400 w-full">
            <p className="block text-gray-700 text-sm font-bold">Name</p>
            <div className="w-full my-2">
              <Tiptap placeholder="Category" getHtmlData={getNameData} />
            </div>
            <p className="block text-gray-700 text-sm font-bold">Description</p>
            <div className="w-full my-2">
              <Tiptap
                placeholder={"Category"}
                getHtmlData={getDescriptionData}
              />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6">
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
                htmlFor={"duration"}
                id={"duration"}
                type={"text"}
                placeholder={"Duration"}
                name={"duration"}
                value={course.duration}
                onChange={handleChange}
              >
                Duration
              </FormField>
            </div>
            <div className="my-4 flex justify-between items-center">
              <input
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
              {course.imgurl ? (
                <img
                  src={course.imgurl}
                  alt="image"
                  className="w-60 h-36 rounded-lg m-auto"
                />
              ) : (
                <div className="rounded-lg border-2 border-gray-300 border-dashed h-36 w-60 text-center items-center m-auto">
                  Preview
                </div>
              )}
            </div>
            <FormField
              htmlFor={"imgurl"}
              id={"imgurl"}
              type={"text"}
              placeholder={"Image Url"}
              name={"imgurl"}
              value={course.imgurl}
              onChange={handleChange}
            >
              Image Url
            </FormField>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleSubmit}
              >
                Create Full Course
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <LinkButton to={"/get-full-course"} use={"close"}>
              Close
            </LinkButton>
          </div>
        </div>
      </div>
    </LayoutAdjuster>
  );
}

export default AddFullCourse;
