/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateFullCourse } from "../../redux/courses/fullCourseSlice";
import axios from "axios";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";

function UpdateFullCourse({ setUpdateCourse, updateCourseData: id }) {
  const [course, setCourse] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const formData = new FormData();
        formData.append("course_type", 0);
        formData.append("course_id", id);
        const response = await axios.post(
          `${API_URL}/admin/courses/getcoursebyid.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );
        // console.log(response);
        setCourse(response.data.data);
        setCourseName(response.data.data.full_course_name);
        setCourseDescription(response.data.data.full_course_description);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, [id]);

  // console.log(course);
  // console.log(courseName);

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
      formData.append("fullcourseid", course.id);
      formData.append("name", courseName);
      formData.append("price", course.full_course_price);
      formData.append("duration", course.full_course_duration);
      formData.append("description", courseDescription);
      formData.append("imgurl", course.img_url);
      const response = await axios.post(
        `${API_URL}/admin/courses/updatefullcourse.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      if (response.status == 201) {
        dispatch(
          updateFullCourse({
            id: course.id,
            full_course_name: courseName,
            full_course_price: course.full_course_price,
            full_course_duration: course.full_course_duration,
            full_course_description: courseDescription,
            img_url: course.img_url,
            total_number_of_videos: course.total_number_of_videos,
          })
        );
        toast.success("Full Course Updated Sucessfully");
      }
      setUpdateCourse((prev) => !prev);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center my-5">
      <h1 className="text-center text-3xl font-bold">Update Full Course</h1>
      <div className="flex flex-col justify-center items-center mt-5 w-full">
        <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border border-gray-400 w-full">
          <p className="block text-gray-700 text-sm font-bold">Name</p>
          <div className="w-full my-2">
            {dataLoaded && (
              <Tiptap
                placeholder="Category"
                getHtmlData={getNameData}
                initialContent={courseName}
              />
            )}
          </div>
          <p className="block text-gray-700 text-sm font-bold">Description</p>
          <div className="w-full my-2">
            {dataLoaded && (
              <Tiptap
                placeholder={"Category"}
                getHtmlData={getDescriptionData}
                initialContent={courseDescription}
                height={100}
              />
            )}
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor={"price"}
              id={"price"}
              type={"number"}
              placeholder={"Price"}
              name={"full_course_price"}
              value={course.full_course_price}
              onChange={handleChange}
            >
              Price
            </FormField>
            <FormField
              htmlFor={"duration"}
              id={"duration"}
              type={"text"}
              placeholder={"Duration"}
              name={"full_course_duration"}
              value={course.full_course_duration}
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
            name={"img_url"}
            value={course.img_url}
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
