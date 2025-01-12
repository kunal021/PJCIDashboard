import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteQuestion,
  setQuestion,
} from "../../redux/questions/questionSlice";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { API_URL } from "../../url";
import toast from "react-hot-toast";
import Loader from "../../utils/Loader";
import UpdateQns from "./UpdateQns";
import ConfirmDelete from "../../utils/ConfirmDelete";
import Pagination from "../../utils/Pagination";
import GetTestById from "./GetTestById";
import { LatexParser } from "@/utils/LatexParser";
import NewAddQns from "./NewAddQns";

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

    if (response.status === 200) {
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
  const [paginationData, setPaginationData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const question = useSelector((state) => state.question.question);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    fetchQuestions(dispatch, setLoading, id, setPaginationData, currentPage);
  }, [dispatch, id, currentPage]);

  const handleOpenAndFetchData = () => {
    setShow(true);
  };

  const handleDelete = async (qnsid) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/test/deleteqns.php?qns_id=${qnsid}`
      );

      if (response.status == 200) {
        toast.success("Question Deleted Successfully");
        dispatch(deleteQuestion(qnsid));
      }
    } catch (error) {
      toast.error(error?.response?.data?.massage || "Error deleting question");
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
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
            <div className="w-full mx-auto">
              <div className="flex flex-wrap justify-between items-center gap-2 my-5">
                <h1 className="text-2xl sm:text-3xl font-bold text-center">
                  Questions List
                </h1>
                <NewAddQns
                  id={id}
                  fetchData={() =>
                    fetchQuestions(
                      dispatch,
                      setLoading,
                      id,
                      setPaginationData,
                      currentPage
                    )
                  }
                />
              </div>

              {question.length > 0 ? (
                <div className="flex flex-col items-center w-full">
                  {question.map(
                    (question, idx) =>
                      question && (
                        <div
                          key={idx}
                          className="flex flex-col w-full border rounded-md border-zinc-300 my-3 p-3"
                        >
                          <div className="flex flex-col space-y-4 w-full">
                            {/* Header Section */}
                            <div className="flex flex-wrap justify-between items-center gap-2">
                              <div>
                                Question Number:{" "}
                                {(currentPage - 1) * 10 + (idx + 1)}
                              </div>
                              <div>Question ID: {question.qnsid}</div>
                            </div>

                            <hr className="w-full border-slate-300" />

                            {/* Question Text */}
                            <div className="w-full">
                              <div className="font-medium mb-2">Question</div>
                              <div className="tiptap">
                                {typeof question.question_text === "string"
                                  ? LatexParser(question.question_text)
                                  : null}
                              </div>
                            </div>

                            <hr className="w-full border-slate-300" />

                            {/* Options Section */}
                            <div className="flex flex-col gap-3 w-full">
                              <div className="flex flex-wrap gap-2 justify-between items-center">
                                <div className="flex gap-2 py-1 px-2 border rounded-md border-gray-200 bg-green-500">
                                  <span>Answer:</span>
                                  <span>{question.answer}</span>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                  <UpdateQns
                                    updatedQuestionData={question}
                                    testId={id}
                                  />
                                  <ConfirmDelete
                                    handleClick={() =>
                                      handleDelete(question.qnsid)
                                    }
                                  />
                                </div>
                              </div>

                              {["a", "b", "c", "d", "e"].map((option) => (
                                <div
                                  key={option}
                                  className={`${
                                    question.answer === option
                                      ? "bg-green-500"
                                      : "hover:bg-gray-200"
                                  } flex flex-col sm:flex-row items-start sm:items-center p-2 gap-2 border rounded-md border-gray-200`}
                                >
                                  <div className="min-w-[80px]">
                                    Option {option}:
                                  </div>
                                  <div className="w-full break-words">
                                    {typeof question[option] === "string"
                                      ? LatexParser(question[option])
                                      : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                  )}

                  <div className="my-6">
                    <Pagination
                      totalPage={paginationData.total_pages}
                      currPage={currentPage}
                      setCurrPage={setCurrentPage}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-xl sm:text-2xl font-bold text-center mt-10 sm:mt-20">
                  No Data Available
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default GetQuestions;
