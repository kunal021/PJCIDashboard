import { useState } from "react";
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
import Pagination from "../../utils/Pagination";
import GetTestById from "./GetTestById";

const fetchQuestions = async (
  dispatch,
  setLoading,
  id,
  setPaginationData,
  page
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("test_id", id);
    formData.append("page", page);
    formData.append("limit", 10);
    const response = await axios.post(
      `${API_URL}/admin/test/gettestqns.php`,
      formData,
      { headers: "content-type/form-data" }
    );

    if (response.data) {
      dispatch(setQuestion(response.data.data));
      setPaginationData(response.data.pagination);
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
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const question = useSelector((state) => state.question.question);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const handleOpenAndFetchData = () => {
    fetchQuestions(dispatch, setLoading, id, setPaginationData, currentPage);
    setShow(true);
  };

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
      fetchQuestions(dispatch, setLoading, id, setPaginationData, currentPage);
    } catch (error) {
      toast.error(error.response.data.massage);
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
              : "w-[80%] flex flex-col justify-center items-center mx-auto"
          } `}
        >
          <div className="w-full my-5 flex flex-col justify-center items-center gap-10">
            <GetTestById testId={id} />
            {show ? (
              <div
                onClick={() => setShow(false)}
                className="cursor-pointer font-semibold border rounded-md border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2"
              >
                Close
              </div>
            ) : (
              <div
                onClick={handleOpenAndFetchData}
                className="cursor-pointer font-semibold border rounded-md border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2"
              >
                See Questions
              </div>
            )}
          </div>
          {show && (
            <div>
              <div className="flex justify-center items-center my-5 space-x-10">
                <h1 className="text-3xl font-bold text-center">
                  Questions List
                </h1>
                <LinkButton to={`/add-test-question?id=${id}`}>
                  Add Question
                </LinkButton>
              </div>
              {question.length > 0 ? (
                <div className="flex flex-col justify-center items-center w-full">
                  {question.map(
                    (question, idx) =>
                      question && (
                        <div
                          key={idx}
                          className="flex  justify-center items-center font-medium w-full border rounded-md border-zinc-300 ml-2 my-5 p-3 gap-3"
                        >
                          <div className="flex flex-col justify-center items-start gap-4 w-full">
                            <div className="flex justify-between items-center w-full gap-4">
                              {/* <div>Test ID: {question.testid}</div>
                          <div>Subject ID: {question.subid}</div> */}
                              <div>Question Number: {idx + 1}</div>
                              <div>Question ID: {question.qnsid}</div>
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
                            <div className="flex flex-row-reverse flex-wrap text-wrap justify-end items-start gap-4 w-full">
                              <div className="flex gap-2 p-2 border rounded-md border-gray-200 bg-green-500">
                                <span>Answer:</span>
                                <span>{question.answer}</span>
                              </div>
                              {["a", "b", "c", "d", "e"].map((option) => (
                                <div
                                  className={`${
                                    question.answer === option
                                      ? "bg-green-500"
                                      : "hover:bg-gray-200"
                                  } flex justify-center items-center w-[80%] p-2 gap-2 border rounded-md border-gray-200`}
                                  key={option}
                                >
                                  <span className="w-32">Option {option}:</span>
                                  <span className="w-full">
                                    {typeof question[option] === "string"
                                      ? parser(question[option])
                                      : question[option]}
                                  </span>
                                </div>
                              ))}
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
                  <div className="mb-4">
                    <Pagination
                      totalPage={paginationData.total_pages}
                      currPage={currentPage}
                      setCurrPage={setCurrentPage}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-center mt-20">
                  No Data Available
                </div>
              )}
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
