/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTest } from "../../redux/tests/testSlice";
import axios from "axios";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";

function UpdateTest({ updateTestData, setUpdateTest }) {
  const [formData, setFormData] = useState({
    name: updateTestData.test_name,
    price: updateTestData.price,
    duration: updateTestData.duration,
    numberOfQuestion: updateTestData.number_of_questions,
    markPerQuestion: updateTestData.mark_per_qns,
    negativeMark: updateTestData.negative_mark,
    totalMark: updateTestData.total_mark,
    testDate: updateTestData.test_date,
    startTime: updateTestData.start_time,
    endTime: updateTestData.end_time,
  });
  // const [testName, setTestName] = useState(updateTestData.test_name);
  const [testDescription, setTestDescription] = useState(
    updateTestData.description
  );
  const [durationUnit, setDurationunit] = useState("Day");
  const dispatch = useDispatch();

  // const getNameData = (html) => {
  //   setTestName(html);
  // };
  const getDescriptionData = (html) => {
    setTestDescription(html);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevTest) => ({
      ...prevTest,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      const formDataObject = {
        testid: updateTestData.test_id,
        test_name: formData.name,
        flag: updateTestData.flag,
        description: testDescription,
        price: formData.price,
        duration: formData.duration + " " + durationUnit,
        number_of_questions: formData.numberOfQuestion,
        markperqns: formData.markPerQuestion,
        negative_mark: formData.negativeMark,
        total_mark: formData.totalMark,
        test_date: formData.testDate,
        start_time: formData.startTime,
        end_time: formData.endTime,
      };

      // console.log(formDataObject);

      Object.entries(formDataObject).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      const response = await axios.post(
        `${API_URL}/admin/test/updatetest.php`,
        formDataToSend,
        { headers: { "content-type": "multipart/form-data" } }
      );

      // console.log(response);

      if (response.status == 201) {
        dispatch(
          updateTest({
            test_id: updateTestData.test_id,
            flag: updateTestData.flag,
            test_name: formData.name,
            description: testDescription,
            price: formData.price,
            duration: formData.duration,
            number_of_questions: formData.numberOfQuestion,
            mark_per_qns: formData.markPerQuestion,
            negative_mark: formData.negativeMark,
            total_mark: formData.totalMark,
            test_date: formData.testDate,
            start_time: formData.startTime,
            end_time: formData.endTime,
          })
        );
        toast.success("Test Updated Sucessfully");
      }
      setUpdateTest((perv) => !perv);
      window.location.reload();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center my-5">
      <h1 className="text-center text-3xl font-bold">Update Test</h1>
      <div className="flex flex-col justify-center items-center mt-5 w-full">
        <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border border-gray-400 w-full">
          {/* <p className="block text-gray-700 text-sm font-bold">Name</p> */}
          <div className="w-full my-2">
            {/* <Tiptap
              placeholder="Category"
              getHtmlData={getNameData}
              initialContent={testName}
            /> */}
            <FormField
              htmlFor="name"
              id="name"
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            >
              Name
            </FormField>
          </div>
          <p className="block text-gray-700 text-sm font-bold">Description</p>
          <div className="w-full my-2">
            <Tiptap
              placeholder={"Category"}
              getHtmlData={getDescriptionData}
              initialContent={testDescription}
            />
          </div>
          <div className="flex flex-col justify-center items-center md:flex-row md:space-x-6">
            <FormField
              htmlFor="price"
              id="price"
              type="text"
              placeholder="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
            >
              Price
            </FormField>
            <FormField
              htmlFor="duration"
              id="duration"
              type="text"
              placeholder="Duration"
              name="duration"
              value={formData.duration}
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
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor="numberOfQuestion"
              id="numberOfQuestion"
              type="text"
              placeholder="Number Of Question"
              name="numberOfQuestion"
              value={formData.numberOfQuestion}
              onChange={handleChange}
            >
              Number Of Question
            </FormField>
            <FormField
              htmlFor="markPerQuestion"
              id="markPerQuestion"
              type="text"
              placeholder="Mark Per Question"
              name="markPerQuestion"
              value={formData.markPerQuestion}
              onChange={handleChange}
            >
              Mark Per Question
            </FormField>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor="negativeMark"
              id="negativeMark"
              type="text"
              placeholder="Negative Mark"
              name="negativeMark"
              value={formData.negativeMark}
              onChange={handleChange}
            >
              Negative Mark
            </FormField>
            <FormField
              htmlFor="totalMark"
              id="totalMark"
              type="text"
              placeholder="Total Mark"
              name="totalMark"
              value={formData.totalMark}
              onChange={handleChange}
            >
              Total Mark
            </FormField>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor="testDate"
              id="testDate"
              type="date"
              placeholder="Test Date"
              name="testDate"
              value={formData.testDate}
              onChange={handleChange}
            >
              Test Date
            </FormField>
            <FormField
              htmlFor="startTime"
              id="startTime"
              type="time"
              placeholder="Start Time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            >
              Start Time
            </FormField>
            <FormField
              htmlFor="endTime"
              id="endTime"
              type="time"
              placeholder="End Time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            >
              End Time
            </FormField>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
              Update Test
            </button>
          </div>
        </div>
      </div>
      <button
        onClick={() => setUpdateTest((perv) => !perv)}
        className="border-2 rounded-lg border-transparent bg-red-500 py-2 px-4 text-sm font-semibold hover:bg-red-700 text-white transition-all duration-500 w-full md:w-auto"
      >
        Close
      </button>
    </div>
  );
}

export default UpdateTest;
