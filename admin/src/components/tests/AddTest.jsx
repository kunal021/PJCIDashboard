import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTest } from "../../redux/tests/testSlice";
import axios from "axios";
import { Link } from "react-router-dom";

function AddTest() {
  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    price: "",
    duration: "",
    numberOfQuestion: "",
    markPerQuestion: "",
    negativeMark: "",
    totalMark: "",
    testDate: "",
    startTime: "",
    endTime: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startTime" || name === "endTime") {
      const [hours, minutes] = value.split(":");
      let hour = parseInt(hours, 10);
      //   const period = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      if (hour < 10) {
        hour = `0${hour}`;
      }
      setFormData((prevTest) => ({
        ...prevTest,
        [name]: `${hour}:${minutes}`,
      }));
    } else {
      setFormData((prevTest) => ({
        ...prevTest,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("test_name", formData.testName);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("duration", formData.duration);
      formDataToSend.append("number_of_questions", formData.numberOfQuestion);
      formDataToSend.append("mark_per_qns", formData.markPerQuestion);
      formDataToSend.append("negative_mark", formData.negativeMark);
      formDataToSend.append("total_mark", formData.totalMark);
      formDataToSend.append("test_date", formData.testDate);
      formDataToSend.append("start_time", formData.startTime);
      formDataToSend.append("end_time", formData.endTime);
      const response = await axios.post(
        "http://localhost/PJCIDB/admin/test/createtest.php",
        formDataToSend,
        { headers: { "content-type": "multipart/form-data" } }
      );
      console.log("Response:", response.data);
      dispatch(addTest(response.data));
      //   fetchCategory();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setFormData({
      testName: "",
      description: "",
      price: "",
      duration: "",
      numberOfQuestion: "",
      markPerQuestion: "",
      negativeMark: "",
      totalMark: "",
      testDate: "",
      startTime: "",
      endTime: "",
    });
  };
  return (
    <div className="container w-[85%] flex flex-col justify-center items-center mx-5">
      <h1 className="text-center my-5 text-3xl font-bold">Add Test</h1>
      <div className="flex flex-col justify-center items-center max-w-md lg:w-full mx-auto mt-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 text-sm rounded-xl border-2 border-gray-900"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="testName"
            >
              Test Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="testName"
              type="text"
              placeholder="Test Name"
              name="testName"
              value={formData.testName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Price
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="text"
                placeholder="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="duration"
              >
                Duration
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="duration"
                type="text"
                placeholder="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="numberOfQuestion"
              >
                Number Of Question
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="numberOfQuestion"
                type="text"
                placeholder="Number Of Question"
                name="numberOfQuestion"
                value={formData.numberOfQuestion}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="markPerQuestion"
              >
                Mark Per Question
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="markPerQuestion"
                type="text"
                placeholder="Mark Per Question"
                name="markPerQuestion"
                value={formData.markPerQuestion}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="negativeMark"
              >
                Negative Mark
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="negativeMark"
                type="text"
                placeholder="Negative Mark"
                name="negativeMark"
                value={formData.negativeMark}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="totalMark"
              >
                Total Mark
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="totalMark"
                type="text"
                placeholder="Total Mark"
                name="totalMark"
                value={formData.totalMark}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="testDate"
              >
                Test Date
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="testDate"
                type="date"
                placeholder="Test Date"
                name="testDate"
                value={formData.testDate}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="startTime"
              >
                Start Time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="startTime"
                type="time"
                placeholder="Start Time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="endTime"
              >
                End Time
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="endTime"
                type="time"
                placeholder="End Time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Test
            </button>
          </div>
        </form>
        <div className="flex items-center justify-between mb-4">
          <Link
            to={"/get-test"}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AddTest;
