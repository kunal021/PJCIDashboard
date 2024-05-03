import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTest } from "../../redux/tests/testSlice";
import axios from "axios";
import { Link } from "react-router-dom";

const GetTest = () => {
  const dispatch = useDispatch();
  const test = useSelector((state) => state.test.test);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.post(
          "http://localhost/PJCIDB/admin/test/getalltest.php"
        );

        console.log(response.data.data);
        dispatch(setTest(response.data.data));

        // console.log(response);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, [dispatch]);
  return (
    <div className="container w-[80%] flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center my-10">Test List</h1>
      <Link
        to={"/add-test"}
        className="px-3 py-2 text-lg font-bold text-white rounded-lg border-2 border-transparent bg-gray-900 hover:bg-gray-800 transition-all duration-300"
      >
        Add Test
      </Link>
      <table className="table-auto w-[70vw] m-10 border-2">
        <thead>
          <tr>
            <th className="px-4 py-2">Test Id</th>
            <th className="px-4 py-2">Test Name</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Duration</th>
            <th className="px-4 py-2">Test Date</th>
            <th className="px-4 py-2">Start Date</th>
            <th className="px-4 py-2">End Date</th>
            <th className="px-4 py-2">Number Of Questions</th>
            <th className="px-4 py-2">Mark Per Question</th>
            <th className="px-4 py-2">Total Mark</th>
            <th className="px-4 py-2">Negative Mark</th>
            <th className="px-4 py-2">See Questions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {test.map((test) => (
            <tr key={test.test_id}>
              <td className="border px-4 py-2">{test.test_id}</td>
              <td className="border px-4 py-2">{test.test_name}</td>
              <td className="border px-4 py-2">{test.description}</td>
              <td className="border px-4 py-2">{test.price}</td>
              <td className="border px-4 py-2">{test.duration}</td>
              <td className="border px-4 py-2">{test.test_date}</td>
              <td className="border px-4 py-2">{test.start_time}</td>
              <td className="border px-4 py-2">{test.end_time}</td>
              <td className="border px-4 py-2">{test.number_of_questions}</td>
              <td className="border px-4 py-2">{test.mark_per_qns}</td>
              <td className="border px-4 py-2">{test.total_mark}</td>
              <td className="border px-4 py-2">{test.negative_mark}</td>
              <td className="border px-4 py-2">
                <Link to={`/get-test-question?id=${test.test_id}`}>
                  See Questions
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetTest;
