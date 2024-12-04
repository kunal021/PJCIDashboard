import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTest } from "../../redux/tests/testSlice";
import axios from "axios";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import { useNavigate } from "react-router-dom";

function AddTestSeries() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalprice: "",
    duration: "",
    totalQuestion: "",
    totalTest: "",
  });
  // const [testName, setTestName] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [durationUnit, setDurationUnit] = useState("Day");

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

  // console.log(formData);

  const handleSubmit = async () => {
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
        name: formData.name,
        description: testDescription,
        price: formData.price,
        original_price: formData.originalprice,
        duration: formData.duration + " " + durationUnit,
        total_question: formData.totalQuestion,
        total_test: formData.totalTest,
      };

      Object.entries(formDataObject).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      const response = await axios.post(
        `${API_URL}/admin/testseries/createtestseries.php`,
        formDataToSend,
        { headers: { "content-type": "multipart/form-data" } }
      );
      // console.log(response);
      if (response.status == 201) {
        dispatch(addTest(response.data));
        toast.success("Test Added Successfully");
        navigate("/get-testseries");
      }
    } catch (error) {
      console.error("Error adding test:", error);
    }
    setFormData({
      name: "",
      price: "",
      originalprice: "",
      duration: "",
      totalQuestion: "",
      totalTest: "",
    });
    // setTestName("");
    setTestDescription("");
  };

  return (
    <LayoutAdjuster>
      <div className="w-[80%] flex flex-col justify-center items-center">
        <div className="flex justify-center items-center my-5 space-x-10">
          <h1 className="text-3xl font-bold text-center">Add Test Series</h1>
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
                <option value={"Day"}>Day</option>
                <option value={"Month"}>Month</option>
                <option value={"Year"}>Year</option>
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
                Create Test
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <LinkButton to={"/get-testseries"} use={"close"}>
              Close
            </LinkButton>
          </div>
        </div>
      </div>
    </LayoutAdjuster>
  );
}

export default AddTestSeries;
