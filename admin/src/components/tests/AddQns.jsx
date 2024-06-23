import { useState } from "react";
import { useDispatch } from "react-redux";
import { addQuestion } from "../../redux/questions/questionSlice";
import FormField from "../../utils/FormField";
import "../../utils/addQns.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";

function AddQns() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    question: "",
    a: "",
    b: "",
    c: "",
    d: "",
    e: "",
    answer: [],
  });
  // const [checked, setChecked] = useState({
  //   a: false,
  //   b: false,
  //   c: false,
  //   d: false,
  //   e: false
  // })
  const [allQuestion, setAllQuestion] = useState([]);

  const handleAddQuestion = () => {
    setAllQuestion((prevData) => [...prevData, formData]);
  };

  console.log(allQuestion);

  // const handleCheckbox = (e) => {
  //   const { name, checked } = e.target;
  //   setChecked((prevChecked) => ({
  //     ...prevChecked,
  //     [name]: checked,
  //   }));
  // };

  const dispatch = useDispatch();

  // const handleChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   if (type === "checkbox") {
  //     if (checked) {
  //       setFormData((prevdata) => ({
  //         ...prevdata,
  //         answer: [...prevdata.answer, name],
  //       }));
  //     } else {
  //       setFormData((prevdata) => ({
  //         ...prevdata,
  //         answer: prevdata.answer.filter(item => item !== name),
  //       }));
  //     }
  //   } else {
  //     setFormData((prevdata) => ({
  //       ...prevdata,
  //       [name]: value,
  //     }));
  //   }
  // }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevdata) => ({
        ...prevdata,
        answer: checked ? name : "",
      }));
    } else {
      setFormData((prevdata) => ({
        ...prevdata,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        test_id: id,
        questions: allQuestion.map((question) => ({
          subject_id: 1,
          question_text: question.question,
          a: question.a,
          b: question.b,
          c: question.c,
          d: question.d,
          e: question.e,
          correct_answer: question.answer.join(" "),
        })),
      };

      const response = axios.post(
        `${API_URL}/admin/test/addqnsintest.php`,
        dataToSend
      );
      dispatch(addQuestion(response.data));
      if (response.status == 201) {
        toast.success("Question Added Sucessfully");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
    setFormData({
      question: "",
      a: "",
      b: "",
      c: "",
      d: "",
      e: "",
      answer: [],
    });
    // setChecked({
    //   a: false,
    //   b: false,
    //   c: false,
    //   d: false,
    //   e: false
    // });
  };

  return (
    <div className="w-fit flex flex-col justify-center items-center mx-auto">
      <h1 className="text-center my-5 text-3xl font-bold">Add Question</h1>
      <div className="flex flex-col justify-center items-center max-w-md lg:w-full mx-auto mt-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md px-8 py-4 mb-4 text-sm rounded-xl border-2 border-gray-900"
        >
          <FormField
            htmlFor="question"
            id="question"
            type="textarea"
            placeholder="Question"
            name="question"
            value={formData.question}
            onChange={handleChange}
          >
            Question
          </FormField>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor="option_a"
              id="option_a"
              type="text"
              placeholder="Option A"
              name="a"
              value={formData.a}
              onChange={handleChange}
            >
              Option A
            </FormField>
            <input
              type="checkbox"
              id="ans_a"
              name="a"
              value="a"
              className="hidden"
              //  checked={checked.a}
              onChange={(e) => {
                // handleCheckbox(e);
                handleChange(e);
              }}
            />
            <label htmlFor="ans_a" className="checkbox-label">
              A
            </label>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor="option_b"
              id="option_b"
              type="text"
              placeholder="Option B"
              name="b"
              value={formData.b}
              onChange={handleChange}
            >
              Option B
            </FormField>
            <input
              type="checkbox"
              id="ans_b"
              name="b"
              value="b"
              className="hidden"
              // checked={checked.b}
              onChange={(e) => {
                // handleCheckbox(e);
                handleChange(e);
              }}
            />
            <label htmlFor="ans_b" className="checkbox-label">
              B
            </label>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor="option_c"
              id="option_c"
              type="text"
              placeholder="Option C"
              name="c"
              value={formData.c}
              onChange={handleChange}
            >
              Option C
            </FormField>
            <input
              type="checkbox"
              id="ans_c"
              name="c"
              value="c"
              className="hidden"
              // checked={checked.c}
              onChange={(e) => {
                // handleCheckbox(e);
                handleChange(e);
              }}
            />
            <label htmlFor="ans_c" className="checkbox-label">
              C
            </label>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor="option_d"
              id="option_d"
              type="text"
              placeholder="Option D"
              name="d"
              value={formData.d}
              onChange={handleChange}
            >
              Option D
            </FormField>
            <input
              type="checkbox"
              id="ans_d"
              name="d"
              value="d"
              className="hidden"
              //  checked={checked.d}
              onChange={(e) => {
                // handleCheckbox(e);
                handleChange(e);
              }}
            />
            <label htmlFor="ans_d" className="checkbox-label">
              D
            </label>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <FormField
              htmlFor="option_e"
              id="option_e"
              type="text"
              placeholder="Option E"
              name="e"
              value={formData.e}
              onChange={handleChange}
            >
              Option E
            </FormField>
            <input
              type="checkbox"
              id="ans_e"
              name="e"
              value="e"
              className="hidden"
              //  checked={checked.e}
              onChange={(e) => {
                // handleCheckbox(e);
                handleChange(e);
              }}
            />
            <label htmlFor="ans_e" className="checkbox-label">
              E
            </label>
          </div>
          <div className="flex items-center justify-between mt-5">
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleAddQuestion}
            >
              Add Question
            </button>
          </div>
        </form>
        <div className="flex justify-center items-center mb-5 space-x-16 ">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <LinkButton to={`/get-test-question?id=${id}`} use={"close"}>
            Close
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

export default AddQns;
