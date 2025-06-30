/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateQuestion } from "../../redux/questions/questionSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import UpdateBtn from "@/utils/UpdateBtn";

function UpdateQns({ updatedQuestionData, testId }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const [question, setQuestion] = useState(updatedQuestionData.question_text);
  const [optionA, setOptionA] = useState(updatedQuestionData.a);
  const [optionB, setOptionB] = useState(updatedQuestionData.b);
  const [optionC, setOptionC] = useState(updatedQuestionData.c);
  const [optionD, setOptionD] = useState(updatedQuestionData.d);
  const [optionE, setOptionE] = useState(updatedQuestionData.e);
  const [answer, setAnswer] = useState(updatedQuestionData.answer);
  const [subjectId, setSubjectId] = useState(updatedQuestionData.subid);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const getQuestionData = (html) => {
    setQuestion(html);
  };
  const getOptionAData = (html) => {
    setOptionA(html);
  };
  const getOptionBData = (html) => {
    setOptionB(html);
  };
  const getOptionCData = (html) => {
    setOptionC(html);
  };
  const getOptionDData = (html) => {
    setOptionD(html);
  };
  const getOptionEData = (html) => {
    setOptionE(html);
  };

  const handleChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async () => {
    if (
      !question ||
      !optionA ||
      !optionB ||
      !optionC ||
      !optionD ||
      !optionE ||
      !answer ||
      !subjectId
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      const formDataObject = {
        qnsid: updatedQuestionData.qnsid,
        question_text: question,
        a: optionA,
        b: optionB,
        c: optionC,
        d: optionD,
        e: optionE,
        ans: answer,
        subid: subjectId,
      };
      Object.entries(formDataObject).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await axios.post(
        `${API_URL}/admin/test/updateqns.php`,
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        dispatch(
          updateQuestion({
            qnsid: updatedQuestionData.qnsid,
            question_text: question,
            a: optionA,
            b: optionB,
            c: optionC,
            d: optionD,
            e: optionE,
            answer: answer,
            subid: subjectId,
          })
        );
        toast.success("Question Updated Successfully");
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching Question:", error);
      toast.error(error?.response?.data?.message || "error updating question.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getSubject = async () => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("testid", testId);
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
      } finally {
        setLoading(false);
      }
    };

    getSubject();
  }, [testId]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div onClick={() => setOpen(true)}>
          <UpdateBtn />
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-auto w-full sm:w-[70%] px-4">
        <SheetHeader>
          <h1 className="text-center text-xl sm:text-3xl font-bold">
            Update Question
          </h1>
        </SheetHeader>
        <div className="w-full flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center w-full">
            <div className="w-full">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold my-2">
                  Question
                </label>
                <Tiptap
                  initialContent={question}
                  getHtmlData={getQuestionData}
                  placeholder="Write the question here..."
                />
              </div>

              <div className="flex justify-between items-end gap-4 mb-4">
                <div className="flex flex-col justify-start items-start w-full">
                  <label className="block text-gray-700 text-sm font-bold my-2">
                    Option A
                  </label>
                  <Tiptap
                    initialContent={optionA}
                    getHtmlData={getOptionAData}
                    placeholder={`Option A`}
                  />
                </div>
                <input
                  type="radio"
                  id={`ans_a`}
                  name={`answera`}
                  value={"a"}
                  className="visually-hidden"
                  onChange={handleChange}
                  checked={answer === "a"}
                />
                <label htmlFor={`ans_a`} className="checkbox-label">
                  A
                </label>
              </div>

              <div className="flex justify-between items-end gap-4 mb-4">
                <div className="flex flex-col justify-start items-start w-full">
                  <label className="block text-gray-700 text-sm font-bold my-2">
                    Option B
                  </label>
                  <Tiptap
                    initialContent={optionB}
                    getHtmlData={getOptionBData}
                    placeholder={`Option B`}
                  />
                </div>
                <input
                  type="radio"
                  id={`ans_b`}
                  name={`answerb`}
                  value={"b"}
                  className="visually-hidden"
                  onChange={handleChange}
                  checked={answer === "b"}
                />
                <label htmlFor={`ans_b`} className="checkbox-label">
                  B
                </label>
              </div>

              <div className="flex justify-between items-end gap-4 mb-4">
                <div className="flex flex-col justify-start items-start w-full">
                  <label className="block text-gray-700 text-sm font-bold my-2">
                    Option C
                  </label>
                  <Tiptap
                    initialContent={optionC}
                    getHtmlData={getOptionCData}
                    placeholder={`Option C`}
                  />
                </div>
                <input
                  type="radio"
                  id={`ans_c`}
                  name={`answera`}
                  value={"c"}
                  className="visually-hidden"
                  onChange={handleChange}
                  checked={answer === "c"}
                />
                <label htmlFor={`ans_c`} className="checkbox-label">
                  C
                </label>
              </div>

              <div className="flex justify-between items-end gap-4 mb-4">
                <div className="flex flex-col justify-start items-start w-full">
                  <label className="block text-gray-700 text-sm font-bold my-2">
                    Option D
                  </label>
                  <Tiptap
                    initialContent={optionD}
                    getHtmlData={getOptionDData}
                    placeholder={`Option D`}
                  />
                </div>
                <input
                  type="radio"
                  id={`ans_d`}
                  name={`answerd`}
                  value={"d"}
                  className="visually-hidden"
                  onChange={handleChange}
                  checked={answer === "d"}
                />
                <label htmlFor={`ans_d`} className="checkbox-label">
                  D
                </label>
              </div>

              <div className="flex justify-between items-end gap-4 mb-4">
                <div className="flex flex-col justify-start items-start w-full">
                  <label className="block text-gray-700 text-sm font-bold my-2">
                    Option E
                  </label>
                  <Tiptap
                    initialContent={optionE}
                    getHtmlData={getOptionEData}
                    placeholder={`Option E`}
                  />
                </div>
                <input
                  type="radio"
                  id={`ans_e`}
                  name={`answere`}
                  value={"e"}
                  className="visually-hidden"
                  onChange={handleChange}
                  checked={answer === "e"}
                />
                <label htmlFor={`ans_e`} className="checkbox-label">
                  E
                </label>
              </div>

              <div className="w-full mt-4">
                <select
                  onChange={(e) => setSubjectId(e.target.value)}
                  value={subjectId}
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-full md:w-2/4 lg:w-1/4"
                >
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.subject_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
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
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-md bg-blue-50 py-2 px-4 text-sm font-semibold hover:bg-blue-100 border border-blue-200 text-black w-full"
          >
            Update Question
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default UpdateQns;
