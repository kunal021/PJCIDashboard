/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addQuestion } from "../../redux/questions/questionSlice";
import "../../utils/addQns.css";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";
import AddSubject from "./AddSubject";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Plus } from "lucide-react";

function NewAddQns({ id, fetchData }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const initialFormData = {
    question: "",
    a: "",
    b: "",
    c: "",
    d: "",
    e: "NOTA",
    answer: "",
    subject_id: 1,
  };

  const [questions, setQuestions] = useState([initialFormData]);
  const [subjects, setSubjects] = useState([]);
  const [currentSubject, setCurrentSubject] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddQuestion = () => {
    const lastQuestion = questions[questions.length - 1];
    const isEmpty = Object.values(lastQuestion).some((value) => !value);
    if (!isEmpty) {
      setQuestions([
        ...questions,
        { ...initialFormData, subject_id: currentSubject },
      ]);
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

  const handleSubmit = async () => {
    const isEmpty = questions.some((question) =>
      Object.values(question).some((value) => !value)
    );

    if (isEmpty) {
      toast.error("Please fill all fields before submitting.");
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        test_id: id,
        questions: questions.map((question) => ({
          subject_id: question.subject_id,
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

      if (response.status === 201) {
        dispatch(addQuestion(response.data.data));
        fetchData();
        toast.success("Question Added Successfully");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(
        error.response?.data?.message ||
          "An error occurred while adding the question."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getSubject = async () => {
      try {
        const formData = new FormData();
        formData.append("testid", id);
        const response = await axios.post(
          `${API_URL}/admin/test/gettestsubject.php`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        if (response.status === 200) {
          setSubjects(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error(
          error.response?.data?.message ||
            "An error occurred while fetching the subject."
        );
      }
    };

    getSubject();
  }, [id]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        asChild
        className="cursor-pointer border rounded-md bg-blue-50 p-2 text-sm font-semibold text-black hover:bg-blue-100 border-blue-200 md:w-auto"
      >
        <div onClick={() => setOpen(true)}>
          {useIsMobile() ? <Plus className="h-5 w-5" /> : "Add Question"}
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-auto w-full sm:w-[70%] px-4">
        <SheetHeader>
          <div className="flex justify-center items-center w-full gap-6">
            <h1 className="text-center my-5 text-3xl font-bold">
              Add Question
            </h1>
            <AddSubject setSubjects={setSubjects} subjects={subjects} />
          </div>
        </SheetHeader>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center w-full gap-6">
            {questions.map((formData, index) => (
              <div key={index} className="w-full">
                {/* Question Section */}
                <div className="mb-4 flex flex-col md:flex-row justify-center items-start md:gap-4">
                  <div className="w-full">
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
                </div>

                {/* Options Section */}
                {["a", "b", "c", "d", "e"].map((option) => (
                  <div
                    key={option}
                    className="flex justify-between items-end gap-4 mb-4"
                  >
                    <div className="flex flex-col justify-start items-start w-full">
                      <label className="block text-gray-700 text-sm font-bold my-2">
                        Option {option.toUpperCase()}
                      </label>
                      <Tiptap
                        initialContent={formData[option]}
                        getHtmlData={(content) =>
                          handleChange(content, index, option)
                        }
                        placeholder={`Option ${option.toUpperCase()}`}
                      />
                    </div>
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

                {/* Subject Dropdown */}
                <div className="w-full mt-4">
                  <select
                    onChange={(e) => {
                      handleChange(e.target.value, index, "subject_id");
                      if (index === questions.length - 1) {
                        setCurrentSubject(e.target.value);
                      }
                    }}
                    value={formData.subject_id}
                    className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-full md:w-2/4"
                  >
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.subject_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Add/Delete Question Buttons */}
                {index === questions.length - 1 && (
                  <div className="flex flex-col md:flex-row justify-between items-center mt-5 gap-4">
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="bg-blue-50 hover:bg-blue-100 text-black border font-semibold py-2 px-4 rounded-md border-blue-200 w-full md:w-auto"
                    >
                      Add Another Question
                    </button>
                    {index !== 0 && (
                      <button
                        onClick={() => handleDeleteQuestion(index)}
                        className="bg-red-50 hover:bg-red-100 text-black border font-semibold py-2 px-4 rounded-md border-red-200 w-full md:w-auto"
                      >
                        Delete Question
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <SheetFooter className="flex flex-col gap-4 mt-5">
          <button
            disabled={loading}
            onClick={() => !loading && setOpen(false)}
            className="border rounded-md bg-red-50 py-2 px-4 text-sm font-semibold hover:bg-red-100 border-red-200 text-black w-full disabled:opacity-50"
          >
            Close
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-md bg-blue-50 py-2 px-4 text-sm font-semibold hover:bg-blue-100 border border-blue-200 text-black w-full"
          >
            Add Questions
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default NewAddQns;
