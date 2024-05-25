/* eslint-disable react/prop-types */
import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateTest } from "../../redux/tests/testSlice";
import axios from "axios";
import toast from "react-hot-toast";
import FormField from "../../utils/FormField";
import { API_URL } from "../../url";

function UpdateTest({ fetchTest, updateTestData, setUpdateTest }) {
    const [formData, setFormData] = useState({
        testName: updateTestData.test_name,
        description: updateTestData.description,
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
    const dispatch = useDispatch();

    // console.log(updateTestData)
    // console.log(updateTestData)


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "startTime" || name === "endTime") {
            const [hours, minutes] = value.split(":");
            let hour = parseInt(hours, 10);
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
            const formDataObject = {
                testid: updateTestData.test_id,
                test_name: formData.testName,
                description: formData.description,
                price: formData.price,
                duration: formData.duration,
                number_of_questions: formData.numberOfQuestion,
                markperqns: formData.markPerQuestion,
                negative_mark: formData.negativeMark,
                total_mark: formData.totalMark,
                test_date: formData.testDate,
                start_time: formData.startTime,
                end_time: formData.endTime,
            };

            Object.entries(formDataObject).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });
            const response = await axios.post(
                `${API_URL}/admin/test/updatetest.php`,
                formDataToSend,
                { headers: { "content-type": "multipart/form-data" } }
            );
            dispatch(updateTest(response.data));
            if (response.status == 201) {
                toast.success("Test Updated Sucessfully")
            }
            fetchTest()
        } catch (error) {
            console.error("Error fetching courses:", error);
        }

        setUpdateTest((perv) => !perv)

    };

    return (
        <div className="w-fit flex flex-col justify-center items-center mx-auto">
            <h1 className="text-center text-3xl font-bold">Update Test</h1>
            <div className="flex flex-col justify-center items-center max-w-md lg:w-full mx-auto mt-5">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md px-8 py-4 mb-4 text-sm rounded-xl border-2 border-gray-900"
                >
                    <FormField
                        htmlFor="testName"
                        id="testName"
                        type="text"
                        placeholder="Test Name"
                        name="testName"
                        value={formData.testName}
                        onChange={handleChange}
                    >
                        Test Name
                    </FormField>
                    <FormField
                        htmlFor="description"
                        id="description"
                        type="textarea"
                        placeholder="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    >
                        Description
                    </FormField>

                    <div className="flex flex-col md:flex-row md:space-x-6">
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
                            type="submit"
                        >
                            Update Test
                        </button>
                    </div>
                </form>
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
