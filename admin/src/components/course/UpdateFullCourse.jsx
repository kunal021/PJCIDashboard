/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFullCourse } from "../../redux/courses/fullCourseSlice";
import axios from "axios";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";

function UpdateFullCourse({
  fetchFullCourse,
  setUpdateCourse,
  updateCourseData,
}) {
  const [course, setCourse] = useState({
    name: updateCourseData.full_course_name,
    price: updateCourseData.full_course_price,
    duration: updateCourseData.full_course_duration,
    imgurl: updateCourseData.img_url,
  });
  const [courseName, setCourseName] = useState(
    updateCourseData.full_course_name
  );
  const [courseDescription, setCourseDescription] = useState(
    updateCourseData.full_course_description
  );
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
      formData.append("fullcourseid", updateCourseData.id);
      formData.append("name", courseName);
      formData.append("price", course.price);
      formData.append("duration", course.duration);
      formData.append("description", courseDescription);
      formData.append("imgurl", course.imgurl);
      const response = await axios.post(
        `${API_URL}/admin/courses/updatefullcourse.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      dispatch(updateFullCourse(response.data));
      if (response.status == 201) {
        toast.success("Full Course Updated Sucessfully");
      }
      fetchFullCourse();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setUpdateCourse(false);
  };

  return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center my-5">
      <h1 className="text-center text-3xl font-bold">Update Full Course</h1>
      <div className="flex flex-col justify-center items-center mt-5 w-full">
        <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border-2 border-gray-900 w-full">
          <p className="block text-gray-700 text-sm font-bold">Name</p>
          <div className="h-[100px] w-full my-6">
            <Tiptap
              placeholder="Category"
              getHtmlData={getNameData}
              initialContent={courseName}
            />
          </div>
          <p className="block text-gray-700 text-sm font-bold">Description</p>
          <div className="h-[100px] w-full my-6">
            <Tiptap
              placeholder={"Category"}
              getHtmlData={getDescriptionData}
              initialContent={courseDescription}
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
              Update Course
            </button>
          </div>
        </div>
        <button
          onClick={() => setUpdateCourse((perv) => !perv)}
          className="border-2 rounded-lg border-transparent bg-red-500 py-2 px-4 text-sm font-semibold hover:bg-red-700 text-white transition-all duration-500 w-full md:w-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UpdateFullCourse;
