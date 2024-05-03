import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuestion } from "../../redux/questions/questionSlice";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const GetQuestions = () => {
  const dispatch = useDispatch();
  const question = useSelector((state) => state.question.question);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  console.log(id);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        dispatch(setQuestion([]));
        const formData = new FormData();
        formData.append("test_id", id);
        const response = await axios.post(
          "http://localhost/PJCIDB/admin/test/gettestqns.php",
          formData,
          { headers: "content-type/form-data" }
        );

        console.log(response.data.data);
        if (response.data) {
          dispatch(setQuestion(response.data.data));
        } else {
          console.log("Not Data Available");
        }

        // console.log(response);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, [dispatch, id]);
  return (
    <div className="container w-[80%]">
      <h1 className="text-3xl font-bold text-center my-10">Questions List</h1>
      <table className="table-auto w-[70vw] m-10 border-2">
        <thead>
          <tr>
            <th className="px-4 py-2">Question Id</th>
            <th className="px-4 py-2">Test Id</th>
            <th className="px-4 py-2">Subject Id</th>
            <th className="px-4 py-2">Question</th>
            <th className="px-4 py-2">Option a</th>
            <th className="px-4 py-2">Option b</th>
            <th className="px-4 py-2">Option c</th>
            <th className="px-4 py-2">Option d</th>
            <th className="px-4 py-2">Option e</th>
            <th className="px-4 py-2">Answer</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {question.map((question) => (
            <tr key={question.qnsid}>
              <td className="border px-4 py-2">{question.qnsid}</td>
              <td className="border px-4 py-2">{question.testid}</td>
              <td className="border px-4 py-2">{question.subid}</td>
              <td className="border px-4 py-2">{question.question_text}</td>
              <td className="border px-4 py-2">{question.a}</td>
              <td className="border px-4 py-2">{question.b}</td>
              <td className="border px-4 py-2">{question.c}</td>
              <td className="border px-4 py-2">{question.d}</td>
              <td className="border px-4 py-2">{question.e}</td>
              <td className="border px-4 py-2">{question.answer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetQuestions;
