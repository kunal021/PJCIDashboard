import { useState } from "react";
import { useDispatch } from "react-redux";
import { addQuestion } from "../../redux/questions/questionSlice";
import "../../utils/addQns.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import Tiptap from "../../utils/TextEditor";

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

  const handleAddQuestion = () => {
    const lastQuestion = questions[questions.length - 1];
    const isEmpty = Object.values(lastQuestion).some((value) => !value);
    if (!isEmpty) {
      setQuestions([...questions, { ...initialFormData }]);
    } else {
      toast.error("Please fill all fields before adding a new question.");
    }
  };

  const handleChange = (content, index, field) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = content;
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEmpty = questions.some((question) =>
      Object.values(question).some((value) => !value)
    );

    if (isEmpty) {
      toast.error("Please fill all fields before submitting.");
      return;
    }

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

      const response = await axios.post(
        `${API_URL}/admin/test/addqnsintest.php`,
        dataToSend
      );
      dispatch(addQuestion(response.data));
      if (response.status === 201) {
        toast.success("Question Added Successfully");
      }
      console.log(response);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("An error occurred while adding the question.");
    }
  };

  return (
    <LayoutAdjuster>
      <div className="w-[80%] flex flex-col justify-center items-center">
        <h1 className="text-center my-5 text-3xl font-bold">Add Question</h1>
        <div className="flex flex-col justify-center items-center mt-5 w-full">
          {questions.map((formData, index) => (
            <div
              key={index}
              className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border-2 border-gray-900 w-full"
            >
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Question {index + 1}
                </label>
                <Tiptap
                  initialContent={formData.question}
                  getHtmlData={(content) =>
                    handleChange(content, index, "question")
                  }
                  placeholder="Write the question here..."
                />
              </div>

              {["a", "b", "c", "d", "e"].map((option) => (
                <div
                  key={option}
                  className="flex flex-col justify-center items-center md:flex-row md:space-x-24"
                >
                  <Tiptap
                    initialContent={formData[option]}
                    getHtmlData={(content) =>
                      handleChange(content, index, option)
                    }
                    placeholder={`Option ${option.toUpperCase()}`}
                  />
                  <input
                    type="radio"
                    id={`ans_${option}${index}`}
                    name={`answer${index}`}
                    value={option}
                    className="hidden"
                    onChange={(e) =>
                      handleChange(e.target.value, index, "answer")
                    }
                  />
                  <label
                    htmlFor={`ans_${option}${index}`}
                    className="checkbox-label"
                  >
                    {option.toUpperCase()}
                  </label>
                </div>
              ))}

              {index === questions.length - 1 && (
                <div className="flex items-center justify-between mt-5">
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Add Another Question
                  </button>
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(index)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Delete Question
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          <div className="flex justify-center items-center mb-5 space-x-16 ">
            <button
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
    </LayoutAdjuster>
  );
}

export default NewAddQns;
