import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteQuestion,
  setQuestion,
} from "../../redux/questions/questionSlice";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import toast from "react-hot-toast";
import Loader from "../../utils/Loader";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import UpdateBtn from "../../utils/UpdateBtn";
import UpdateQns from "./UpdateQns";
import parser from "html-react-parser";
import ConfirmDelete from "../../utils/ConfirmDelete";

const fetchQuestions = async (dispatch, setLoading, id) => {
  try {
    setLoading(true);
    // dispatch(setQuestion([]));
    const formData = new FormData();
    formData.append("test_id", id);
    const response = await axios.post(
      `${API_URL}/admin/test/gettestqns.php`,
      formData,
      { headers: "content-type/form-data" }
    );

    // console.log(response);

    if (response.data) {
      dispatch(setQuestion(response.data.data));
    } else {
      toast.error("Not Data Available");
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

const GetQuestions = () => {
  const [loading, setLoading] = useState(false);
  const [updatedQuestion, setUpdateQuestion] = useState(false);
  const [updatedQuestionData, setUpdateQuestionData] = useState({});
  const dispatch = useDispatch();
  const question = useSelector((state) => state.question.question);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    setLoading(true);
    fetchQuestions(dispatch, setLoading, id);
  }, [dispatch, id]);

  const handleDelete = async (qnsid) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/test/deleteqns.php?qns_id=${qnsid}`
      );
      if (qnsid && response.data.success) {
        dispatch(deleteQuestion(response.data));
      }
      if (response.status == 200) {
        toast.success("Question Deleted Successfully");
      }
      fetchQuestions(dispatch, setLoading, id);
    } catch (error) {
      toast.error(error.response.data.massage);
      // console.log(error);
    }
  };
  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${
            updatedQuestion
              ? "hidden"
              : "w-fit flex flex-col justify-center items-center mx-auto"
          } `}
        >
          <div className="flex justify-center items-center my-5 space-x-10">
            <h1 className="text-3xl font-bold text-center">Questions List</h1>
            <LinkButton to={`/add-test-question?id=${id}`}>
              Add Question
            </LinkButton>
          </div>
          {question ? (
            // <table className="w-full m-5 border table-fixed">
            //   <thead>
            //     <tr className="bg-gray-100">
            //       <th className="p-2 text-sm">Question Id</th>
            //       <th className="p-2 text-sm">Test Id</th>
            //       <th className="p-2 text-sm">Subject Id</th>
            //       <th className="p-2 text-sm">Question</th>
            //       <th className="p-2 text-sm">Option a</th>
            //       <th className="p-2 text-sm">Option b</th>
            //       <th className="p-2 text-sm">Option c</th>
            //       <th className="p-2 text-sm">Option d</th>
            //       <th className="p-2 text-sm">Option e</th>
            //       <th className="p-2 text-sm">Answer</th>
            //       <th className="p-2 text-sm">Update</th>
            //     </tr>
            //   </thead>
            //   <tbody className="text-center">
            //     {question.map(
            //       (question, idx) =>
            //         question && (
            //           <tr key={idx} className="bg-gray-50">
            //             <td className="border p-2 text-sm">{question.qnsid}</td>
            //             <td className="border p-2 text-sm">
            //               {question.testid}
            //             </td>
            //             <td className="border p-2 text-sm">{question.subid}</td>
            //             <td className="border p-2 text-sm">
            //               {typeof question.question_text === "string"
            //                 ? parser(question.question_text)
            //                 : question.question_text}
            //             </td>
            //             <td className="border p-2 text-sm w-3">
            //               {typeof question.a === "string"
            //                 ? parser(question.a)
            //                 : question.a}
            //             </td>
            //             <td className="border p-2 text-sm w-3">
            //               {typeof question.b === "string"
            //                 ? parser(question.b)
            //                 : question.b}
            //             </td>
            //             <td className="border p-2 text-sm">
            //               {typeof question.c === "string"
            //                 ? parser(question.c)
            //                 : question.c}
            //             </td>
            //             <td className="border p-2 text-sm">
            //               {typeof question.d === "string"
            //                 ? parser(question.d)
            //                 : question.d}
            //             </td>
            //             <td className="border p-2 text-sm">
            //               {typeof question.e === "string"
            //                 ? parser(question.e)
            //                 : question.e}
            //             </td>
            //             <td className="border p-2 text-sm">
            //               {typeof question.answer === "string"
            //                 ? parser(question.answer)
            //                 : question.answer}
            //             </td>
            //             <td className="border p-2 text-sm">
            //               <UpdateBtn
            //                 handleClick={() => {
            //                   setUpdateQuestion((prev) => !prev);
            //                   setUpdateQuestionData(question);
            //                 }}
            //               />
            //             </td>
            //           </tr>
            //         )
            //     )}
            //   </tbody>
            // </table>
            <div className="flex flex-col justify-center items-center w-full">
              {question.map(
                (question, idx) =>
                  question && (
                    <div
                      key={idx}
                      className="flex  justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                    >
                      <div className="flex flex-col justify-center items-start gap-4 w-full">
                        <div className="flex justify-between items-center gap-4">
                          <div>Question ID: {question.qnsid}</div>
                          <div>Test ID: {question.testid}</div>
                          <div>Subject ID: {question.subid}</div>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div>
                          <div className="flex flex-wrap text-wrap">
                            Question:{" "}
                            {typeof question.question_text === "string"
                              ? parser(question.question_text)
                              : question.question_text}
                          </div>
                        </div>
                        <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                        <div className="flex justify-between items-center gap-4">
                          <div className="flex gap-1">
                            <span>Option a:</span>
                            <span>
                              {typeof question.a === "string"
                                ? parser(question.a)
                                : question.a}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <span>Option b:</span>
                            <span>
                              {typeof question.b === "string"
                                ? parser(question.b)
                                : question.b}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <span>Option c:</span>
                            <span>
                              {typeof question.c === "string"
                                ? parser(question.c)
                                : question.c}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <span>Option d:</span>
                            <span>
                              {typeof question.d === "string"
                                ? parser(question.d)
                                : question.d}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <span>Option e:</span>
                            <span>
                              {typeof question.e === "string"
                                ? parser(question.e)
                                : question.e}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <span>Answer:</span>
                            <span>{question.answer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end gap-10 w-fit">
                        <UpdateBtn
                          handleClick={() => {
                            setUpdateQuestion((prev) => !prev);
                            setUpdateQuestionData(question);
                          }}
                        />
                        <ConfirmDelete
                          handleClick={() => handleDelete(question.qnsid)}
                        />
                      </div>
                    </div>
                  )
              )}
            </div>
          ) : (
            <div className="text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
      {updatedQuestion && (
        <UpdateQns
          fetchQuestions={() => fetchQuestions(dispatch, setLoading, id)}
          setUpdateQuestion={setUpdateQuestion}
          updatedQuestionData={updatedQuestionData}
        />
      )}
    </LayoutAdjuster>
  );
};

export default GetQuestions;
