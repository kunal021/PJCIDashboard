import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTest } from "../../redux/tests/testSlice";
import { deleteTest } from "../../redux/tests/testSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";
import UpdateTest from "./UpdateTest";
import { API_URL } from "../../url";


const fetchTest = async (dispatch) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/test/getalltest.php`
    );

    dispatch(setTest(response.data.data));
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

function GetTest() {
  const [updateTest, setUpdateTest] = useState(false)
  const [updateTestData, setUpdateTestData] = useState({})

  const dispatch = useDispatch();
  const test = useSelector((state) => state.test.test);

  useEffect(() => {
    fetchTest(dispatch);
  }, [dispatch]);

  const handleDelete = async (testId) => {
    const deleteAlert = window.confirm("Do you want to delete this test?");
    if (deleteAlert) {
      try {
        const response = await axios.delete(
          `${API_URL}/admin/test/deletetest.php?testid=${testId}`
        );
        if (testId && response.data.success) {
          dispatch(deleteTest(response.data));
        }
        fetchTest(dispatch);
      } catch (error) {
        alert(error.response.data.massage)
        // console.error("Error fetching category:", error);
      }
    }
  }

  return (
    <div className="w-fit flex flex-col justify-center items-center mx-auto">
      <div
        className={`${updateTest ? "hidden"
          : "w-fit flex flex-col justify-center items-center mx-auto"
          } `}
      >
        <div className="flex justify-center items-center space-x-10">
          <h1 className="text-3xl font-bold text-center my-5">Test List</h1>
          <LinkButton to={"/add-test"}>Add Test</LinkButton>
        </div>
        <table className="table-auto w-full m-5 border-collapse border-2">
          <thead>
            <tr className="bg-gray-200">
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
              <th className="p-2 text-sm">Update</th>
              <th className="p-2 text-sm">Delete</th>
              <th className="p-2 text-sm">See Questions</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {test.map((test) => (
              <tr key={test.test_id} className="bg-gray-100">
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
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 text-xs rounded"
                    onClick={() => {
                      setUpdateTest((prev) => !prev);
                      setUpdateTestData(test);
                    }}
                  >
                    Update
                  </button>
                </td>
                <td className="border p-2 text-sm">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold p-1 text-xs rounded"
                    onClick={() => handleDelete(test.test_id)}
                  >
                    Delete
                  </button>
                </td>
                <td className="border p-2 text-sm">
                  <Link to={`/get-test-question?id=${test.test_id}`}>
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold p-1 text-xs rounded">
                      See Questions
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {updateTest && <UpdateTest
        fetchTest={() => fetchTest(dispatch)}
        setUpdateTest={setUpdateTest}
        updateTestData={updateTestData}
      />}
    </div>
  );
}

export default GetTest;
