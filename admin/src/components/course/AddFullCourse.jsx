import { useState } from "react";
import { useDispatch } from "react-redux";
import { addFullCourse } from "../../redux/courses/fullCourseSlice";
import axios from "axios";
import FormField from "../../utils/FormField";
import { Link } from "react-router-dom";

function AddFullCourse() {
  const [course, setCourse] = useState({
    name: "",
    price: "",
    duration: "",
    description: "",
    imgurl: "",
  });
  const dispatch = useDispatch();

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
      formData.append("name", course.name);
      formData.append("price", course.price);
      formData.append("duration", course.duration);
      formData.append("description", course.description);
      formData.append("imgurl", course.imgurl);
      const response = await axios.post(
        "http://localhost/PJCIDB/admin/courses/addfullcourse.php",
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      dispatch(addFullCourse(response.data));
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
    <div className="container w-[85%] flex flex-col justify-center items-center mx-5">
      <h1 className="text-center my-5 text-3xl font-bold">Add Full Course</h1>
      <div className="flex flex-col justify-center items-center max-w-md lg:w-full mx-auto mt-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md px-8 py-4 mb-4 text-sm rounded-xl border-2 border-gray-900"
        >
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
          <FormField
            htmlFor={"description"}
            id={"description"}
            type={"textarea"}
            placeholder={"Description"}
            name={"description"}
            value={course.description}
            onChange={handleChange}
          >
            Description
          </FormField>
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
              type="submit"
            >
              Create Full Course
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between mb-4">
          <Link
            to={"/get-full-course"}
            className="border-2 rounded-md bg-red-500 py-2 px-4 text-sm font-semibold border-transparent hover:bg-red-700 text-white transition-all duration-500 w-full md:w-auto"
          >
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AddFullCourse;
