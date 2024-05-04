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

        // console.log(response.data.data);
        dispatch(setTest(response.data.data));

        // console.log(response);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, [dispatch]);
  return (
    <div className="container w-[85%] flex flex-col justify-center items-center mx-5">
      <h1 className="text-3xl font-bold text-center my-5">Test List</h1>
      <Link
        to={"/add-test"}
        className="px-3 py-2 text-lg font-bold text-white rounded-lg border-2 border-transparent bg-blue-500 hover:bg-blue-700 transition-all duration-300"
      >
        Add Test
      </Link>
      <table className="table-auto w-full m-5 border-2">
        <thead>
          <tr>
            <th className="p-2 text-sm">Test Id</th>
            <th className="p-2 text-sm">Test Name</th>
            <th className="p-2 text-sm">Description</th>
            <th className="p-2 text-sm">Price</th>
            <th className="p-2 text-sm">Duration</th>
            <th className="p-2 text-sm">Test Date</th>
            <th className="p-2 text-sm">Start Date</th>
            <th className="p-2 text-sm">End Date</th>
            <th className="p-2 text-sm">Number Of Questions</th>
            <th className="p-2 text-sm">Mark Per Question</th>
            <th className="p-2 text-sm">Total Mark</th>
            <th className="p-2 text-sm">Negative Mark</th>
            <th className="p-2 text-sm">See Questions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {test.map((test) => (
            <tr key={test.test_id}>
              <td className="border p-2 text-sm">{test.test_id}</td>
              <td className="border p-2 text-sm">{test.test_name}</td>
              <td className="border p-2 text-sm">{test.description}</td>
              <td className="border p-2 text-sm">{test.price}</td>
              <td className="border p-2 text-sm">{test.duration}</td>
              <td className="border p-2 text-sm">{test.test_date}</td>
              <td className="border p-2 text-sm">{test.start_time}</td>
              <td className="border p-2 text-sm">{test.end_time}</td>
              <td className="border p-2 text-sm">{test.number_of_questions}</td>
              <td className="border p-2 text-sm">{test.mark_per_qns}</td>
              <td className="border p-2 text-sm">{test.total_mark}</td>
              <td className="border p-2 text-sm">{test.negative_mark}</td>
              <td className="border p-2 text-sm">
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
