import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTest } from "../../redux/tests/testSlice";
import axios from "axios";
import { Link } from "react-router-dom";

function AddTest() {
  const [test, setTest] = useState({
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
      setTest((prevTest) => ({
        ...prevTest,
        [name]: `${hour}:${minutes}`,
      }));
    } else {
      setTest((prevTest) => ({
        ...prevTest,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("test_name", test.testName);
      formData.append("description", test.description);
      formData.append("price", test.price);
      formData.append("duration", test.duration);
      formData.append("number_of_questions", test.numberOfQuestion);
      formData.append("mark_per_qns", test.markPerQuestion);
      formData.append("negative_mark", test.negativeMark);
      formData.append("total_mark", test.totalMark);
      formData.append("test_date", test.testDate);
      formData.append("start_time", test.startTime);
      formData.append("end_time", test.endTime);
      const response = await axios.post(
        "http://localhost/PJCIDB/admin/test/createtest.php",
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      console.log("Response:", response.data);
      dispatch(addTest(response.data));
      //   fetchCategory();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setTest({
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
    <div className="relative flex flex-col justify-center items-center m-auto h-[100vh] w-[80%] bg-black/30">
      <form
        onSubmit={handleSubmit}
        className="text-lg space-y-2 rounded-md border-2 bg-white border-black p-2 hover:shadow-md transition-all duration-300"
      >
        <p>
          Test Name:{" "}
          <input
            type="text"
            name="testName"
            value={test.testName}
            placeholder="Test Name"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <p>
          Description:{" "}
          <input
            type="text"
            name="description"
            value={test.description}
            placeholder="Description"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <p>
          Price:{" "}
          <input
            type="number"
            name="price"
            value={test.price}
            placeholder="Price"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <p>
          Duration:{" "}
          <input
            type="number"
            name="duration"
            value={test.duration}
            placeholder="Duration"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <p>
          Number of Questions:{" "}
          <input
            type="number"
            name="numberOfQuestion"
            value={test.numberOfQuestion}
            placeholder="Number of Questions"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <p>
          Mark Per Question:{" "}
          <input
            type="number"
            name="markPerQuestion"
            value={test.markPerQuestion}
            placeholder="Mark Per Question"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <p>
          Negative Mark:{" "}
          <input
            type="number"
            name="negativeMark"
            value={test.markPerQuestion}
            placeholder="Negative Mark"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <p>
          Total Marks:{" "}
          <input
            type="number"
            name="totalMark"
            value={test.totalMark}
            placeholder="Total Marks"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <p>
          Test Date:{" "}
          <input
            type="date"
            name="testDate"
            value={test.testDate}
            placeholder="Test Date"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <p>
          Start Time:{" "}
          <input
            type="time"
            name="startTime"
            value={test.startTime}
            placeholder="Start Time"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <p>
          End Time:{" "}
          <input
            type="time"
            name="endTime"
            value={test.endTime}
            placeholder="End Time"
            onChange={handleChange}
            className="border-2 rounded-md px-2 border-black"
          />
        </p>
        <button type="submit">Submit</button>
      </form>
      <Link
        to={"/get-test"}
        className="px-3 py-2 m-5 text-lg font-bold text-white rounded-md border-2 border-transparent bg-gray-900 hover:bg-gray-800 transition-all duration-300"
      >
        Close
      </Link>
    </div>
  );
}

export default AddTest;
