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

function UpdateTestSeries({ updateTestData, setUpdateTest }) {
  const [formData, setFormData] = useState({
    name: updateTestData.name,
    price: updateTestData.price,
    originalprice: updateTestData.original_price,
    duration: trim(updateTestData.duration)[0],
    totalQuestion: updateTestData.total_question,
    totalTest: updateTestData.total_test,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.price ||
      !formData.originalprice ||
      !formData.duration ||
      !formData.totalQuestion ||
      !formData.totalTest ||
      !testDescription
    ) {
      toast.error("Please fill all fields");
      return;
    }
    if (Number(formData.originalprice) < Number(formData.price)) {
      toast.error("Price must be smaller than original price");
      return;
    }
    try {
      const formDataToSend = new FormData();
      const formDataObject = {
        id: updateTestData.id,
        name: formData.name,
        is_active: updateTestData.is_active,
        description: testDescription,
        price: formData.price,
        original_price: formData.originalprice,
        duration: formData.duration + " " + durationUnit,
        total_question: formData.totalQuestion,
        total_test: formData.totalTest,
      };

      console.log(formDataObject);

      Object.entries(formDataObject).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post(
        `${API_URL}/admin/testseries/updatetestseries.php`,
        formDataToSend,
        { headers: { "content-type": "multipart/form-data" } }
      );

      console.log(response);

      if (response.status === 201) {
        dispatch(
          updateTest({
            id: updateTestData.id,
            is_active: updateTestData.is_active,
            name: formData.name,
            description: testDescription,
            price: formData.price,
            original_price: formData.originalprice,
            duration: formData.duration,
            total_question: formData.totalQuestion,
            total_test: formData.totalTest,
          })
        );
        toast.success("Test Updated Successfully");
      }
      setUpdateTest((prev) => !prev);
    } catch (error) {
      console.error("Error updating test:", error);
      toast.error(error.response.data.massage || "Failed to update test");
    }
  };

  // console.log(formData);

  return (
    <div className="w-[80%] h-full flex flex-col justify-center items-center my-5">
      <h1 className="text-center text-3xl font-bold">Update Test Series</h1>
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
              htmlFor="originalprice"
              id="originalprice"
              type={"number"}
              placeholder="Original Price"
              name="originalprice"
              value={formData.originalprice}
              onChange={handleChange}
            >
              Original Price
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
              <option value="Day">Day</option>
              <option value="Month">Month</option>
              <option value="Year">Year</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor="totalQuestion"
              id="totalQuestion"
              type="number"
              placeholder="Total Questions"
              name="totalQuestion"
              value={formData.totalQuestion}
              onChange={handleChange}
            >
              Total Questions
            </FormField>
            <FormField
              htmlFor="totalTest"
              id="totalTest"
              type="number"
              placeholder="Total Tests"
              name="totalTest"
              value={formData.totalTest}
              onChange={handleChange}
            >
              Total Tests
            </FormField>
          </div>
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
      <button
        onClick={() => setUpdateTest((prev) => !prev)}
        className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md"
      >
        Close
      </button>
    </div>
  );
}

export default UpdateTestSeries;
