import { useState } from "react";
import { useDispatch } from "react-redux";
import { addCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import FormField from "../../utils/FormField";
import LinkButton from "../../utils/LinkButton";

function AddCourse() {
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
        "http://localhost/PJCIDB/admin/courses/addcourse.php",
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      dispatch(addCourse(response.data));
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
    <div className="w-fit flex flex-col justify-center items-center mx-auto">
      <h1 className="text-center my-5 text-3xl font-bold">Add Course</h1>
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
              Create Course
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between mb-4">
          <LinkButton to={"/get-course"} use={"close"}>Close</LinkButton>
        </div>
      </div>
    </div>
  );
}

export default AddCourse;
