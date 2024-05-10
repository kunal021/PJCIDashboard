import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTest } from "../../redux/tests/testSlice";
import { deleteTest } from "../../redux/tests/testSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";
import UpdateTest from "./UpdateTest";

const fetchTest = async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost/PJCIDB/admin/test/getalltest.php"
    );

    dispatch(setTest(response.data.data));
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

function GetTest() {
  const [updateTest, setUpdateTest] = useState(false);
  const [updateTestData, setUpdateTestData] = useState(null);
  const [selectedTestId, setSelectedTestId] = useState(null);

  const dispatch = useDispatch();
  const test = useSelector((state) => state.test.test);

  useEffect(() => {
    fetchTest(dispatch);
  }, [dispatch]);

  const handleDelete = async (testId) => {
    try {
      const response = await axios.delete(
        `http://localhost/PJCIDB/admin/test/deletetest.php?testid=${testId}`
      );
      if (testId && response.data.success) {
        dispatch(deleteTest(response.data));
        fetchTest(dispatch);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const handleUpdate = (testId) => {
    const testToUpdate = test.find((test) => test.test_id === testId);
    setUpdateTestData(testToUpdate);
    setUpdateTest(true);
  };

  const handleSeeQuestions = (testId) => {
    setSelectedTestId(testId);
  };

  return (
    <div className={`w-[85vw] flex-col justify-center items-center mx-5`}>
      <div
        className={`${updateTest ? "hidden" : "w-full flex flex-col justify-center items-center"
          } `}
      >
        <h1 className="text-3xl font-bold text-center my-5">Test List</h1>
        <LinkButton to={"/add-test"}>Add Test</LinkButton>
        <div className="flex flex-wrap justify-center items-center my-5 space-x-5">
          {test.map((test) => (
            <div key={test.test_id} className="mb-5 h-96">
              <div className="border p-4 rounded-md shadow-md">
                <h2 className="text-xl font-semibold">Name: {test.test_name}</h2>
                <h2 className="text-lg font-semibold">ID: {test.test_id}</h2>
                <p className="text-gray-600">Description: {test.description}</p>
                <p className="text-gray-600">Price: {test.price}</p>
                <p className="text-gray-600">Duration: {test.duration}</p>
                <p className="text-gray-600">Test Date: {test.test_date}</p>
                <p className="text-gray-600">Start Time: {test.start_time}</p>
                <p className="text-gray-600">End Time: {test.end_time}</p>
                <p className="text-gray-600">
                  Number Of Questions: {test.number_of_questions}
                </p>
                <p className="text-gray-600">Mark Per Question: {test.mark_per_qns}</p>
                <p className="text-gray-600">Total Mark: {test.total_mark}</p>
                <p className="text-gray-600">Negative Mark: {test.negative_mark}</p>
                <div className="flex mt-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 text-xs rounded mr-2"
                    onClick={() => handleUpdate(test.test_id)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold p-2 text-xs rounded mr-2"
                    onClick={() => handleDelete(test.test_id)}
                  >
                    Delete
                  </button>
                  <Link to={`/get-test-question?id=${test.test_id}`}>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold p-2 text-xs rounded"
                      onClick={() => handleSeeQuestions(test.test_id)}
                    >
                      See Questions
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {updateTest && (
        <UpdateTest
          fetchTest={() => fetchTest(dispatch)}
          setUpdateTest={setUpdateTest}
          updateTestData={updateTestData}
        />
      )}
      {selectedTestId && <div>Selected Test ID: {selectedTestId}</div>}
    </div>
  );
}

export default GetTest;
