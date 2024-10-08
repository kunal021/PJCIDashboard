/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTest } from "../../redux/tests/testSlice";
import axios from "axios";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";
import { trim } from "../../utils/trim";

function UpdateTest({ updateTestData, setUpdateTest }) {
  const [formData, setFormData] = useState({
    name: updateTestData.test_name,
    price: updateTestData.price,
    duration: trim(updateTestData.duration)[0],
    numberOfQuestion: updateTestData.number_of_questions,
    markPerQuestion: updateTestData.mark_per_qns,
    negativeMark: updateTestData.negative_mark,
    totalMark: updateTestData.total_mark,
    testDate: updateTestData.test_date,
    startTime: updateTestData.start_time,
    endTime: updateTestData.end_time,
    type: updateTestData.type,
  });
  const [testDescription, setTestDescription] = useState(
    updateTestData.description
  );
  const [durationUnit, setDurationUnit] = useState(
    trim(updateTestData.duration)[1]
  );
  const dispatch = useDispatch();

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

  // console.log(testDescription);

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.duration ||
      !formData.numberOfQuestion ||
      !formData.markPerQuestion ||
      !formData.negativeMark ||
      !formData.totalMark ||
      !formData.testDate ||
      !formData.type ||
      !testDescription
    ) {
      toast.error("Please fill all fields");
      return;
    }
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
        test_date: formData.type === "2" ? "0000-00-00" : formData.testDate,
        start_time: formData.type === "2" ? "00:00:00" : formData.startTime,
        end_time: formData.type === "2" ? "00:00:00" : formData.endTime,
        type: formData.type, // Add this in submission
      };

      Object.entries(formDataObject).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post(
        `${API_URL}/admin/test/updatetest.php`,
        formDataToSend,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        dispatch(
          updateTest({
            test_id: updateTestData.test_id,
            flag: updateTestData.flag,
            test_name: formData.name,
            description: testDescription,
            price: formData.price,
            duration: formData.duration + " " + durationUnit,
            number_of_questions: formData.numberOfQuestion,
            mark_per_qns: formData.markPerQuestion,
            negative_mark: formData.negativeMark,
            total_mark: formData.totalMark,
            test_date: formData.testDate,
            start_time: formData.startTime,
            end_time: formData.endTime,
            type: formData.type, // Dispatch test type
          })
        );
        toast.success("Test Updated Successfully");
      }
      setUpdateTest((prev) => !prev);
    } catch (error) {
      console.error("Error updating test:", error);
      toast.error("Failed to update test");
    }
  };

  // console.log(testDescription);

  return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center my-5">
      <h1 className="text-center text-3xl font-bold">Update Test</h1>
      <div className="flex justify-center items-center my-5 space-x-10">
        <select
          onChange={(e) =>
            setFormData((prevTest) => ({ ...prevTest, type: e.target.value }))
          }
          value={formData.type}
          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md"
        >
          <option value="1">Schedule Test</option>
          <option value="2">Stored Test</option>
        </select>
      </div>
      <div className="flex flex-col justify-center items-center mt-5 w-full">
        <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border border-gray-400 w-full">
          <div className="w-full my-2">
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
              type={"number"}
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
              type={"number"}
              placeholder="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
            >
              Duration
            </FormField>
            <select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value)}
              className="w-96 h-fit mt-2.5 py-1.5 px-1 flex justify-center items-center border rounded-md border-gray-300"
            >
              <option value="Minute">Minute</option>
              <option value="Hour">Hour</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor="numberOfQuestion"
              id="numberOfQuestion"
              type={"number"}
              placeholder="Number Of Questions"
              name="numberOfQuestion"
              value={formData.numberOfQuestion}
              onChange={handleChange}
            >
              Number Of Questions
            </FormField>
            <FormField
              htmlFor="markPerQuestion"
              id="markPerQuestion"
              type={"number"}
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
              type={"number"}
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
              type={"number"}
              placeholder="Total Mark"
              name="totalMark"
              value={formData.totalMark}
              onChange={handleChange}
            >
              Total Mark
            </FormField>
          </div>
          {formData.type === "1" && (
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
          )}

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md"
              onClick={handleSubmit}
            >
              Update Test
            </button>
          </div>
        </div>
      </div>
      <div className="my-5">
        <button
          onClick={() => setUpdateTest((prev) => !prev)}
          className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UpdateTest;
