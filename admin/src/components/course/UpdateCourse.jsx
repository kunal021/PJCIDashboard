/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { updateCourse } from "../../redux/courses/courseSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";
import { Loader, UploadCloud } from "lucide-react";

function UpdateCourse({ updateCourseData: id, setUpdateCourse }) {
  const [course, setCourse] = useState([]);
  // const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [durationUnit, setDurationunit] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const formData = new FormData();
        formData.append("course_type", 1);
        formData.append("course_id", id);
        const response = await axios.post(
          `${API_URL}/admin/courses/getcoursebyid.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );
        // console.log(response);
        setCourse(response.data.data);
        // setCourseName(response.data.data.course_name);
        setCourseDescription(response.data.data.course_description);
        setDataLoaded(true);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, [id]);

  // console.log(course);
  // console.log(courseName);
  // console.log(courseDescription);

  // const getNameData = (html) => {
  //   setCourseName(html);
  // };
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

  // console.log(updateCourseData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("courseid", course.id);
      formData.append("name", course.course_name);
      formData.append("price", course.price);
      formData.append("duration", `${course.course_duration} ${durationUnit}`);
      formData.append("description", courseDescription);
      formData.append("imgurl", course.img_url);
      const response = await axios.post(
        `${API_URL}/admin/courses/updatecourse.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      // console.log(response);
      if (response.status == 201) {
        dispatch(
          updateCourse({
            id: course.id,
            course_name: course.course_name,
            price: course.price,
            course_duration: `${course.course_duration} ${durationUnit}`,
            course_description: courseDescription,
            img_url: course.img_url,
            total_number_of_videos: course.total_number_of_videos,
            isactive: course.isactive,
          })
        );
        toast.success("Course Updated Sucessfully");
      }
      setUpdateCourse((perv) => !perv);
    } catch (error) {
      console.error("Error fetching courses:", error);
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

      // console.log(response.data);
      if (response.status === 200) {
        setCourse((prev) => ({ ...prev, img_url: response.data.url }));
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
    <div className="w-[80%] h-full flex flex-col justify-center items-center my-5">
      <h1 className="text-center text-3xl font-bold">Update Course</h1>
      <div className="flex flex-col justify-center items-center mt-5 w-full">
        <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border border-gray-400 w-full">
          {/* <p className="block text-gray-700 text-sm font-bold">Name</p> */}
          <div className="w-full my-2">
            {dataLoaded && (
              // <Tiptap
              //   placeholder="Category"
              //   getHtmlData={getNameData}
              //   initialContent={courseName}
              // />
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
                placeholder={"Category"}
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
              htmlFor={"duration"}
              id={"duration"}
              type={"text"}
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
              className="w-fit h-fit mt-2.5 py-1.5 px-1 flex justify-center items-center border rounded-md border-gray-300"
            >
              <option value={"Day"}>Day</option>
              <option value={"Month"}>Month</option>
              <option value={"Year"}>Year</option>
            </select>
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
            {course.img_url ? (
              <img
                src={course.img_url}
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
            name={"img_url"}
            value={course.img_url}
            onChange={handleChange}
          >
            Image Url
          </FormField>
          <div className="flex items-center justify-between">
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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

export default UpdateCourse;
