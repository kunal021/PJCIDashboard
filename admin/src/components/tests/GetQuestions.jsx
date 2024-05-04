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
    <div className="container w-[85%] flex flex-col justify-center items-center mx-5">
      <h1 className="text-3xl font-bold text-center my-5">Questions List</h1>
      <table className="table-auto w-full m-5 border-2">
        <thead>
          <tr>
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
            <tr key={question.qnsid}>
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
    </div>
  );
};

export default GetQuestions;
