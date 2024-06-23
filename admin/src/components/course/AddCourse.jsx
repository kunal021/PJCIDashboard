import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import FormField from "../../utils/FormField";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import toast from "react-hot-toast";
import Tiptap from "../../utils/TextEditor";
import LayoutAdjuster from "../../utils/LayoutAdjuster";

function AddCourse() {
  const [course, setCourse] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    imgurl: "",
  });
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
        `${API_URL}/admin/courses/addcourse.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      dispatch(addCourse(response.data));
      if (response.status == 201) {
        toast.success("Course Added Sucessfully");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setCourse({
      name: "",
      price: "",
      duration: "",
      description: "",
      imgurl: "",
    });
  };

  return (
    <LayoutAdjuster>
      <div className="w-[70%] flex flex-col justify-center items-center mx-auto">
        <h1 className="text-center my-5 text-3xl font-bold">Add Course</h1>
        <div className="flex flex-col justify-center items-center mt-5 w-full">
          <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border-2 border-gray-900 w-full">
            <p className="block text-gray-700 text-sm font-bold">Name</p>
            <div className="h-[100px] w-full my-6">
              <Tiptap placeholder="Category" getHtmlData={getNameData} />
            </div>
            <p className="block text-gray-700 text-sm font-bold">Description</p>
            <div className="h-[100px] w-full my-6">
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
                Create Course
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <LinkButton to={"/get-course"} use={"close"}>
              Close
            </LinkButton>
          </div>
        </div>
      </div>
    </LayoutAdjuster>
  );
}

export default AddCourse;
