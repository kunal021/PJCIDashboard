/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateQuestion } from "../../redux/questions/questionSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../../url";
import Tiptap from "../../utils/TextEditor";

function UpdateQns({ setUpdateQuestion, updatedQuestionData, testId }) {
  const dispatch = useDispatch();

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
    // console.log(html);
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

      // console.log(response);

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
        setUpdateQuestion((prev) => !prev);
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
        // console.log(response);
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

  // console.log(question);
  // console.log(subjectId);

  return (
    <div className="w-[80%] flex flex-col justify-center items-center">
      <h1 className="text-center my-5 text-3xl font-bold">Update Question</h1>
      <div className="flex flex-col justify-center items-center mt-5 w-full">
        <div className="bg-white shadow-md px-8 py-4 mb-4 gap-5 text-sm rounded-xl border border-gray-400 w-full">
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

          <div className="flex flex-col justify-center items-center md:flex-row md:space-x-24">
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
              className="hidden"
              onChange={handleChange}
              checked={answer === "a"}
            />
            <label htmlFor={`ans_a`} className="checkbox-label">
              A
            </label>
          </div>
          <div className="flex flex-col justify-center items-center md:flex-row md:space-x-24">
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
              className="hidden"
              onChange={handleChange}
              checked={answer === "b"}
            />
            <label htmlFor={`ans_b`} className="checkbox-label">
              B
            </label>
          </div>
          <div className="flex flex-col justify-center items-center md:flex-row md:space-x-24">
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
              className="hidden"
              onChange={handleChange}
              checked={answer === "c"}
            />
            <label htmlFor={`ans_c`} className="checkbox-label">
              C
            </label>
          </div>
          <div className="flex flex-col justify-center items-center md:flex-row md:space-x-24">
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
              className="hidden"
              onChange={handleChange}
              checked={answer === "d"}
            />
            <label htmlFor={`ans_d`} className="checkbox-label">
              D
            </label>
          </div>
          <div className="flex flex-col justify-center items-center md:flex-row md:space-x-24">
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
              className="hidden"
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
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md w-2/4"
            >
              {/* <option value="" disabled>
                    Select Subject
                  </option> */}
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              disabled={loading}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold py-2 px-4 rounded-md"
              onClick={handleSubmit}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center mb-5 space-x-16 ">
          <button
            disabled={loading}
            onClick={() => setUpdateQuestion((perv) => !perv)}
            className="bg-red-50 hover:bg-red-100 border border-red-200 text-black font-semibold py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateQns;
