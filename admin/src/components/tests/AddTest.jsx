/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { addTest } from "@/redux/tests/testSlice";

function AddTest() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
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
    canReattempt: "",
  });
  const [testDescription, setTestDescription] = useState("");
  const [durationUnit, setDurationUnit] = useState("Minute");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.price ||
      !formData.duration ||
      !formData.numberOfQuestion ||
      !formData.markPerQuestion ||
      !formData.negativeMark ||
      !formData.totalMark ||
      !formData.type ||
      !formData.canReattempt ||
      !testDescription
    ) {
      toast.error("Please fill all fields");
      return;
    }
    if (
      formData.type == "1" &&
      (!formData.testDate || !formData.startTime || !formData.endTime)
    ) {
      toast.error("Please fill all fields");
      return;
    }
    if (formData.type === "") {
      toast.error("Please select test type");
      return;
    }
    try {
      setLoading(true);
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
        is_reattempt: formData.canReattempt,
      };

      Object.entries(formDataObject).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      const response = await axios.post(
        `${API_URL}/admin/test/createtest.php`,
        formDataToSend,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status == 201) {
        toast.success("Test Added Successfully");
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
          canReattempt: "",
        });
        setTestDescription("");

        dispatch(
          addTest({
            test_id: response.data.id,
            test_name: formData.name,
            price: formData.price,
            duration: formData.duration + " " + durationUnit,
            number_of_questions: formData.numberOfQuestion,
            mark_per_qns: formData.markPerQuestion,
            negative_mark: formData.negativeMark,
            total_mark: formData.totalMark,
            test_date: formData.type == "2" ? "0000-00-00" : formData.testDate,
            start_time: formData.type == "2" ? "00:00:00" : formData.startTime,
            end_time: formData.type == "2" ? "00:00:00" : formData.endTime,
            type: formData.type,
            can_reattempt: formData.canReattempt,
            description: testDescription,
            is_reattempt: formData.canReattempt,
            flag: 0,
          })
        );

        setOpen(false);
      }
    } catch (error) {
      console.error("Error adding test:", error);
      toast.error(
        error.response?.data?.message || "Error adding test. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        asChild
        className="cursor-pointer border rounded-md bg-blue-50 p-2 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200 md:w-auto"
      >
        <div onClick={() => setOpen(true)}>
          {useIsMobile() ? <Plus className="h-5 w-5" /> : "Add Test"}
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-auto w-full md:w-[50%] px-4">
        <SheetHeader>
          <div className="flex justify-center items-center my-5 space-x-10">
            <h1 className="text-xl md:text-3xl font-bold text-center">
              Add Test
            </h1>
            <select
              onChange={(e) =>
                setFormData((prevTest) => ({
                  ...prevTest,
                  type: e.target.value,
                }))
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
        </SheetHeader>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Name Field */}
            <div className="w-full">
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

            {/* Description Field */}
            <div className="w-full">
              <p className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </p>
              <Tiptap
                placeholder="Description"
                getHtmlData={getDescriptionData}
              />
            </div>

            {/* Price and Reattempt Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                htmlFor="price"
                id="price"
                type="number"
                placeholder="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              >
                Price
              </FormField>

              <select
                value={formData.canReattempt}
                onChange={(e) =>
                  setFormData({ ...formData, canReattempt: e.target.value })
                }
                className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
              >
                <option value="">Reattempt</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>

              <FormField
                htmlFor="duration"
                id="duration"
                type="number"
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
                className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
              >
                <option value="Minute">Minute</option>
                <option value="Hour">Hour</option>
              </select>
            </div>

            {/* Questions and Marks Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                htmlFor="numberOfQuestion"
                id="numberOfQuestion"
                type="number"
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
                type="number"
                placeholder="Mark Per Question"
                name="markPerQuestion"
                value={formData.markPerQuestion}
                onChange={handleChange}
              >
                Mark Per Question
              </FormField>
            </div>

            {/* Negative and Total Marks Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                htmlFor="negativeMark"
                id="negativeMark"
                type="number"
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
                type="number"
                placeholder="Total Mark"
                name="totalMark"
                value={formData.totalMark}
                onChange={handleChange}
              >
                Total Mark
              </FormField>
            </div>

            {/* Conditional Test Date and Time Fields */}
            {formData.type == "1" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        </div>
        <SheetFooter className="flex flex-col gap-4 mt-5">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-md bg-blue-50 py-2 px-4 text-sm font-semibold hover:bg-blue-100 border border-blue-200 text-black w-full"
          >
            Add Test
          </button>
          <button
            disabled={loading}
            onClick={() => !loading && setOpen(false)}
            className="border rounded-md bg-red-50 py-2 px-4 text-sm font-semibold hover:bg-red-100 border-red-200 text-black w-full disabled:opacity-50"
          >
            Close
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default AddTest;
