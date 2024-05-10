import { useState } from "react";
import { useDispatch } from "react-redux";
import { addQuestion } from "../../redux/questions/questionSlice";
import FormField from "../../utils/FormField";
import "../../utils/addQns.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";

function NewAddQns() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const dispatch = useDispatch();

    const initialFormData = {
        question: "",
        a: "",
        b: "",
        c: "",
        d: "",
        e: "",
        answer: "",
    };

    const [questions, setQuestions] = useState([initialFormData]);

    console.log(questions)

    const handleAddQuestion = () => {
        const lastQuestion = questions[questions.length - 1];
        const isEmpty = Object.values(lastQuestion).some((value) => !value);
        if (!isEmpty) {
            setQuestions([...questions, { ...initialFormData }]);
        } else {
            alert("Please fill all fields before adding a new question.");
        }
    };

    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const newQuestions = [...questions];
        newQuestions[index][name] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        const isEmpty = questions.some((question) =>
            Object.values(question).some((value) => !value)
        );

        if (isEmpty) {
            alert("Please fill all fields before submitting.");
            return;
        }
        e.preventDefault();
        try {
            const dataToSend = {
                test_id: id,
                questions: questions.map((question) => ({
                    subject_id: 1,
                    question_text: question.question,
                    a: question.a,
                    b: question.b,
                    c: question.c,
                    d: question.d,
                    e: question.e,
                    correct_answer: question.answer,
                })),
            };

            const res = await axios.post(
                "http://localhost/PJCIDB/admin/test/addqnsintest.php",
                dataToSend
            );
            dispatch(addQuestion(res.data));
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    return (
        <div className="w-fit flex flex-col justify-center items-center mx-5">
            <h1 className="text-center my-5 text-3xl font-bold">Add Question</h1>
            <div className="flex flex-col justify-center items-center max-w-md md:w-[28rem] mx-auto mt-5">
                {questions.map((formData, index) => (
                    <form
                        key={index}
                        onSubmit={(e) => handleSubmit(e, index)}
                        className="bg-white shadow-md px-8 py-4 mb-4 w-full text-sm rounded-xl border-2 border-gray-900"
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
                            Question {index + 1}
                        </FormField>
                        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-24">
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
                                type="radio"
                                id={`ans_a${index}`}
                                name={`answer`}
                                value="a"
                                className="hidden"
                                onChange={(e) => handleChange(e, index)}
                            />
                            <label htmlFor={`ans_a${index}`} className="checkbox-label">
                                A
                            </label>
                        </div>
                        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-24">
                            <FormField
                                htmlFor={`option_b${index}`}
                                id={`option_b${index}`}
                                type="text"
                                placeholder="Option B"
                                name="b"
                                value={formData.b}
                                onChange={(e) => handleChange(e, index)}
                            >
                                Option B
                            </FormField>
                            <input
                                type="radio"
                                id={`ans_b${index}`}
                                name={`answer`}
                                value="b"
                                className="hidden"
                                onChange={(e) => handleChange(e, index)}
                            />
                            <label htmlFor={`ans_b${index}`} className="checkbox-label">
                                B
                            </label>
                        </div>
                        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-24">
                            <FormField
                                htmlFor={`option_c${index}`}
                                id={`option_c${index}`}
                                type="text"
                                placeholder="Option C"
                                name="c"
                                value={formData.c}
                                onChange={(e) => handleChange(e, index)}
                            >
                                Option C
                            </FormField>
                            <input
                                type="radio"
                                id={`ans_c${index}`}
                                name={`answer`}
                                value="c"
                                className="hidden"
                                onChange={(e) => handleChange(e, index)}
                            />
                            <label htmlFor={`ans_c${index}`} className="checkbox-label">
                                C
                            </label>
                        </div>
                        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-24">
                            <FormField
                                htmlFor={`option_d${index}`}
                                id={`option_d${index}`}
                                type="text"
                                placeholder="Option D"
                                name="d"
                                value={formData.d}
                                onChange={(e) => handleChange(e, index)}
                            >
                                Option D
                            </FormField>
                            <input
                                type="radio"
                                id={`ans_d${index}`}
                                name={`answer`}
                                value="d"
                                className="hidden"
                                onChange={(e) => handleChange(e, index)}
                            />
                            <label htmlFor={`ans_d${index}`} className="checkbox-label">
                                D
                            </label>
                        </div>
                        <div className="flex flex-col justify-center items-center md:flex-row md:space-x-24">
                            <FormField
                                htmlFor={`option_e${index}`}
                                id={`option_e${index}`}
                                type="text"
                                placeholder="Option E"
                                name="e"
                                value={formData.e}
                                onChange={(e) => handleChange(e, index)}
                            >
                                Option E
                            </FormField>
                            <input
                                type="radio"
                                id={`ans_e${index}`}
                                name={`answer`}
                                value="e"
                                className="hidden"
                                onChange={(e) => handleChange(e, index)}
                            />
                            <label htmlFor={`ans_e${index}`} className="checkbox-label">
                                E
                            </label>
                        </div>

                        {index === questions.length - 1 && (
                            <div className="flex items-center justify-between mt-5">
                                <button
                                    type="button"
                                    onClick={handleAddQuestion}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Add Another Question
                                </button>
                            </div>
                        )}
                    </form>
                ))}

                <div className="flex justify-center items-center mb-5 space-x-16 ">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                    <LinkButton to={`/get-test-question?id=${id}`} use={"close"}>
                        Close
                    </LinkButton>
                </div>
            </div>
        </div>
    );
}

export default NewAddQns;
