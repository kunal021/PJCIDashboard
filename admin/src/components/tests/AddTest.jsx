import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";
import LayoutAdjuster from "../../utils/LayoutAdjuster";

function AddTest() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    numberOfQuestion: "",
    markPerQuestion: "",
    negativeMark: "",
    totalMark: "",
    testDate: "",
    startTime: "",
    endTime: "",
    type: "",
  });
  // const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [durationUnit, setDurationUnit] = useState("Minute");

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

  // console.log(formData);

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.duration ||
      !formData.numberOfQuestion ||
      !formData.markPerQuestion ||
      !formData.negativeMark ||
      !formData.totalMark
    ) {
      toast.error("Please fill all fields");
      return;
    }
    if (formData.type === "") {
      toast.error("Please select test type");
      return;
    }
    try {
      const formDataToSend = new FormData();
      const formDataObject = {
        test_name: formData.name,
        description: testDescription,
        price: formData.price,
        duration: formData.duration + " " + durationUnit,
        number_of_questions: formData.numberOfQuestion,
        markperqns: formData.markPerQuestion,
        negative_mark: formData.negativeMark,
        total_mark: formData.totalMark,
        test_date: formData.type == "2" ? "0000-00-00" : formData.testDate,
        start_time: formData.type == "2" ? "00:00:00" : formData.startTime,
        end_time: formData.type == "2" ? "00:00:00" : formData.endTime,
        type: formData.type,
      };

      Object.entries(formDataObject).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      const response = await axios.post(
        `${API_URL}/admin/test/createtest.php`,
        formDataToSend,
        { headers: { "content-type": "multipart/form-data" } }
      );
      // console.log(response);
      if (response.status == 201) {
        toast.success("Test Added Successfully");
      }
    } catch (error) {
      console.error("Error adding test:", error);
    }
    setFormData({
      name: "",
      price: "",
      duration: "",
      numberOfQuestion: "",
      markPerQuestion: "",
      negativeMark: "",
      totalMark: "",
      testDate: "",
      startTime: "",
      endTime: "",
      type: "",
    });
    // setTestName("");
    setTestDescription("");
  };

  return (
    <LayoutAdjuster>
      <div className="w-[80%] flex flex-col justify-center items-center">
        <div className="flex justify-center items-center my-5 space-x-10">
          <h1 className="text-3xl font-bold text-center">Add Test</h1>
          <select
            onChange={(e) =>
              setFormData((prevTest) => ({ ...prevTest, type: e.target.value }))
            }
            defaultValue={""}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md"
          >
            <option value="" disabled>
              Test Type
            </option>
            <option value="1">Schedule Test</option>
            <option value="2">Stored Test</option>
          </select>
        </div>
        <div className="flex flex-col justify-center items-center mt-5 w-full">
          <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border border-gray-400 w-full">
            {/* <p className="block text-gray-700 text-sm font-bold">Test Name</p> */}
            <div className="w-full my-2">
              {/* <Tiptap placeholder="Category" getHtmlData={getNameData} /> */}
              <FormField
                htmlFor={"name"}
                id={"name"}
                type={"text"}
                placeholder={"Name"}
                name={"name"}
                value={formData.name}
                onChange={handleChange}
              >
                Name
              </FormField>
            </div>
            <p className="block text-gray-700 text-sm font-bold">Description</p>
            <div className="w-full my-2">
              <Tiptap
                placeholder="Description"
                getHtmlData={getDescriptionData}
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
                <option value={"Minute"}>Minute</option>
                <option value={"Hour"}>Hour</option>
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
            {formData.type == "1" && (
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
                Create Test
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <LinkButton to={"/get-test"} use={"close"}>
              Close
            </LinkButton>
          </div>
        </div>
      </div>
    </LayoutAdjuster>
  );
}

export default AddTest;
