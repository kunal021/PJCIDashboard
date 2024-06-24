import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuestion } from "../../redux/questions/questionSlice";
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
          <table className="table-auto w-full m-5 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-sm">Question Id</th>
                <th className="p-2 text-sm">Test Id</th>
                <th className="p-2 text-sm">Subject Id</th>
                <th className="p-2 text-sm">Question</th>
                <th className="p-2 text-sm">Option a</th>
                <th className="p-2 text-sm">Option b</th>
                <th className="p-2 text-sm">Option c</th>
                <th className="p-2 text-sm">Option d</th>
                <th className="p-2 text-sm">Option e</th>
                <th className="p-2 text-sm">Answer</th>
                <th className="p-2 text-sm">Update</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {question.map((question) => (
                <tr key={question.qnsid} className="bg-gray-50">
                  <td className="border p-2 text-sm">{question.qnsid}</td>
                  <td className="border p-2 text-sm">{question.testid}</td>
                  <td className="border p-2 text-sm">{question.subid}</td>
                  <td className="border p-2 text-sm">
                    {parser(question.question_text)}
                  </td>
                  <td className="border p-2 text-sm">{parser(question.a)}</td>
                  <td className="border p-2 text-sm">{parser(question.b)}</td>
                  <td className="border p-2 text-sm">{parser(question.c)}</td>
                  <td className="border p-2 text-sm">{parser(question.d)}</td>
                  <td className="border p-2 text-sm">{parser(question.e)}</td>
                  <td className="border p-2 text-sm">
                    {parser(question.answer)}
                  </td>
                  <td className="border p-2 text-sm">
                    <UpdateBtn
                      handleClick={() => {
                        setUpdateQuestion((prev) => !prev);
                        setUpdateQuestionData(question);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {updatedQuestion && (
        <UpdateQns
          fetchQuestions={() => fetchQuestions(dispatch, setLoading)}
          setUpdateQuestion={setUpdateQuestion}
          updatedQuestionData={updatedQuestionData}
        />
      )}
    </LayoutAdjuster>
  );
};

export default GetQuestions;
