import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTest } from "../../redux/tests/testSlice";
import { deleteTest } from "../../redux/tests/testSlice";
import axios from "axios";
import { Link } from "react-router-dom";
import LinkButton from "../../utils/LinkButton";
import UpdateTest from "./UpdateTest";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import UpdateBtn from "../../utils/UpdateBtn";
import ConfirmDelete from "../../utils/ConfirmDelete";
import toast from "react-hot-toast";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import parser from "html-react-parser";
import { Avatar } from "antd";

const fetchTest = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(`${API_URL}/admin/test/getalltest.php`);
    dispatch(setTest(response.data.data));
    // console.log(response);
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetTest() {
  const [loading, setLoading] = useState(false);
  const [updateTest, setUpdateTest] = useState(false);
  const [updateTestData, setUpdateTestData] = useState({});

  const dispatch = useDispatch();
  const test = useSelector((state) => state.test.test);

  useEffect(() => {
    setLoading(true);
    fetchTest(dispatch, setLoading);
  }, [dispatch]);

  const handleDelete = async (testId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/test/deletetest.php?testid=${testId}`
      );
      console.log(response);
      if (testId && response.data.success) {
        dispatch(deleteTest(response.data));
      }
      if (response.status == 201) {
        toast.success("Test Deleted Successfully");
      }
      fetchTest(dispatch, setLoading);
    } catch (error) {
      toast.error(error.response.data.massage);
      // console.error("Error fetching category:", error);
    }
  };

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${
            updateTest
              ? "hidden"
              : "w-full flex flex-col justify-center items-center mx-auto"
          } `}
        >
          <div className="flex justify-center items-center my-5 space-x-10">
            <h1 className="text-3xl font-bold text-center">Test List</h1>
            <LinkButton to={"/add-test"}>Add Test</LinkButton>
          </div>
          {/* <table className="table-auto w-full m-5 border-collapse border">
            <thead>
              <tr className="bg-gray-100">
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
                <tr key={test.test_id} className="bg-gray-50">
                  <td className="border p-2 text-sm">{test.test_id}</td>
                  <td className="border p-2 text-sm">
                    {parser(test.test_name)}
                  </td>
                  <td className="border p-2 text-sm">
                    {parser(test.description)}
                  </td>
                  <td className="border p-2 text-sm">{test.price}</td>
                  <td className="border p-2 text-sm">{test.duration}</td>
                  <td className="border p-2 text-sm">{test.test_date}</td>
                  <td className="border p-2 text-sm">{test.start_time}</td>
                  <td className="border p-2 text-sm">{test.end_time}</td>
                  <td className="border p-2 text-sm">
                    {test.number_of_questions}
                  </td>
                  <td className="border p-2 text-sm">{test.mark_per_qns}</td>
                  <td className="border p-2 text-sm">{test.total_mark}</td>
                  <td className="border p-2 text-sm">{test.negative_mark}</td>
                  <td className="border p-2 text-sm">
                    <UpdateBtn
                      handleClick={() => {
                        setUpdateTest((prev) => !prev);
                        setUpdateTestData(test);
                      }}
                    />
                  </td>
                  <td className="border p-2 text-sm">
                    <ConfirmDelete
                      handleClick={() => handleDelete(test.test_id)}
                    />
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
          </table> */}

          {test ? (
            <div className="flex flex-col justify-center items-center w-full">
              {test.map((test, idx) => (
                <div
                  key={idx}
                  className="flex justify-center items-center w-[80%] border rounded-md border-gray-300 m-2 p-3"
                >
                  <Link
                    to={`/get-test-question?id=${test.test_id}`}
                    className="flex justify-start items-center gap-4 w-full"
                  >
                    <div className="flex justify-center items-center w-[10%] text-">
                      <Avatar className="bg-gray-500 text-white">
                        {test.test_id}
                      </Avatar>
                    </div>
                    <div className="flex flex-col justify-start items-center gap-2 w-full">
                      <div className="flex justify-start items-center font-bold w-full">
                        <div>
                          {typeof test.test_name === "string"
                            ? parser(test.test_name)
                            : test.test_name}
                        </div>
                        {/* {console.log(typeof test.test_name)} */}
                      </div>
                      <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                      <div className="flex justify-start items-center gap-1 w-full text-xs font-medium">
                        <div className="flex justify-start items-start gap-1 w-full">
                          <p>Start Date:</p>
                          <p>{test.test_date}</p>
                        </div>
                        <div className="flex justify-start items-start gap-1 w-full">
                          <p>Start Time:</p>
                          <p>{test.start_time}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="flex flex-col justify-center items-end gap-4 w-[10%]">
                    <UpdateBtn
                      handleClick={() => {
                        setUpdateTest((prev) => !prev);
                        setUpdateTestData(test);
                      }}
                    />
                    <ConfirmDelete
                      handleClick={() => handleDelete(test.test_id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
      {updateTest && (
        <UpdateTest
          fetchTest={() => fetchTest(dispatch, setLoading)}
          setUpdateTest={setUpdateTest}
          updateTestData={updateTestData}
        />
      )}
    </LayoutAdjuster>
  );
}

export default GetTest;
