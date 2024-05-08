/* eslint-disable react/prop-types */
import { useState } from "react";
import FormField from "../../utils/FormField";

const initialFormData = {
    question: "",
    a: "",
    b: "",
    c: "",
    d: "",
    e: "",
    answer: ""
};

const QuestionForm = () => {
    const [questions, setQuestions] = useState([initialFormData]);

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const newQuestions = [...questions];
        newQuestions[index][name] = value;
        setQuestions(newQuestions);
    };

    const handleAddQuestion = () => {
        setQuestions([...questions, initialFormData]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(questions);
        // Here you can submit your form data
    };

    return (
        <div>
            {questions.map((formData, index) => (
                <form
                    key={index}
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md px-8 py-4 mb-4 text-sm rounded-xl border-2 border-gray-900"
                >
                    <FormField
                        htmlFor={`question${index}`}
                        id={`question${index}`}
                        type="textarea"
                        placeholder="Question"
                        name="question"
                        value={formData.question}
                        onChange={(e) => handleChange(e, index)}
                    >
                        Test Name
                    </FormField>
                    <div className="flex flex-col md:flex-row md:space-x-6">
                        <FormField
                            htmlFor={`option_a${index}`}
                            id={`option_a${index}`}
                            type="text"
                            placeholder="Option A"
                            name="a"
                            value={formData.a}
                            onChange={(e) => handleChange(e, index)}
                        >
                            Option A
                        </FormField>
                        <input
                            type="checkbox"
                            id={`ans_a${index}`}
                            name="a"
                            value="a"
                            className="hidden"
                            onChange={(e) => handleChange(e, index)}
                        />
                        <label htmlFor={`ans_a${index}`} className="checkbox-label">
                            A
                        </label>
                    </div>
                    {/* Other options and checkboxes follow */}
                    <div className="flex items-center justify-between mt-5">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            ))}
            <div className="flex items-center justify-between mt-5">
                <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Add Question
                </button>
            </div>
        </div>
    );
};

export default QuestionForm;
