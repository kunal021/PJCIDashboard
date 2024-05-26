import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuestion } from "../../redux/questions/questionSlice";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import toast from "react-hot-toast";
import Loader from "../../utils/Loader";

const GetQuestions = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const question = useSelector((state) => state.question.question);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  console.log(id);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true)
      try {
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
        setLoading(false)
      }
    };

    fetchCourse();
  }, [dispatch, id]);
  return (
    <div className="w-fit flex flex-col justify-center items-center mx-auto">
      {loading ? (<Loader />) : (
        <>
          <div className="flex justify-center items-center space-x-10">
            <h1 className="text-3xl font-bold text-center my-5">Questions List</h1>
            <LinkButton to={`/add-test-question?id=${id}`}>Add Question</LinkButton>
          </div>
          <table className="table-auto w-full m-5 border-2">
            <thead>
              <tr className="bg-gray-200">
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
              </tr>
            </thead>
            <tbody className="text-center">
              {question.map((question) => (
                <tr key={question.qnsid} className="bg-gray-100">
                  <td className="border p-2 text-sm">{question.qnsid}</td>
                  <td className="border p-2 text-sm">{question.testid}</td>
                  <td className="border p-2 text-sm">{question.subid}</td>
                  <td className="border p-2 text-sm">{question.question_text}</td>
                  <td className="border p-2 text-sm">{question.a}</td>
                  <td className="border p-2 text-sm">{question.b}</td>
                  <td className="border p-2 text-sm">{question.c}</td>
                  <td className="border p-2 text-sm">{question.d}</td>
                  <td className="border p-2 text-sm">{question.e}</td>
                  <td className="border p-2 text-sm">{question.answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default GetQuestions;
