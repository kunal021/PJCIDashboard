import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTest } from "../../redux/tests/testSlice";
import { deleteTest } from "../../redux/tests/testSlice";
import axios from "axios";
import LinkButton from "../../utils/LinkButton";
import UpdateTest from "./UpdateTest";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import UpdateBtn from "../../utils/UpdateBtn";
import ConfirmDelete from "../../utils/ConfirmDelete";
import toast from "react-hot-toast";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [updateTest, setUpdateTest] = useState(false);
  const [updateTestData, setUpdateTestData] = useState({});

  const dispatch = useDispatch();
  const test = useSelector((state) => state.test.test);

  useEffect(() => {
    fetchTest(dispatch, setLoading);
  }, [dispatch]);

  const handleDelete = async (testId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/test/deletetest.php?testid=${testId}`
      );
      // console.log(response);

      if (response.status == 201) {
        dispatch(deleteTest(testId));
        toast.success("Test Deleted Successfully");
      }
    } catch (error) {
      toast.error(error.response.data.massage || "Error deleting test");
      // console.error("Error fetching category:", error);
    }
  };

  // const handleChangeStatus = useCallback(
  //   async (testId, flag) => {
  //     const confirmAlert = window.confirm(
  //       `${
  //         flag === "1"
  //           ? "Test will become Inactive. Do you want to proceed"
  //           : "Test will become Active. Do you want to proceed"
  //       }`
  //     );
  //     if (confirmAlert) {
  //       try {
  //         flag = flag === "1" ? "0" : "1";
  //         const formData = new FormData();
  //         formData.append("test_id", testId);
  //         formData.append("statuscode", flag);
  //         await axios.post(
  //           `${API_URL}/admin/test/updateteststatus.php`,
  //           formData,
  //           { headers: { "content-type": "multipart/form-data" } }
  //         );
  //         // console.log(res);

  //         // Update local state instead of fetching users again
  //         const updatedTest = test.map((test) =>
  //           test.test_id === testId ? { ...test, flag } : test
  //         );
  //         dispatch(setTest(updatedTest));
  //       } catch (error) {
  //         console.log("Error updating user status:", error);
  //         // Handle error (e.g., show an error message)
  //       }
  //     }
  //   },
  //   [dispatch, test]
  // );

  // console.log(test);

  return (
    <LayoutAdjuster>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${
            updateTest
              ? "hidden"
              : "w-[80%] flex flex-col justify-center items-center mx-auto"
          } `}
        >
          <div className="flex justify-center items-center my-5 space-x-10">
            <h1 className="text-3xl font-bold text-center">Test List</h1>
            <LinkButton to={"/add-test"}>Add Test</LinkButton>
          </div>
          {test.length > 0 ? (
            <div className="flex flex-col justify-center items-center w-full">
              {test.map((test, idx) => (
                <div
                  key={idx}
                  className="flex justify-center items-center w-[80%] border rounded-md border-gray-300 m-2 p-3"
                >
                  <div className="flex justify-start items-center gap-4 w-full">
                    <div className="flex justify-center items-center w-[10%] text-">
                      <Avatar className="bg-gray-500 text-white">
                        {idx + 1}
                      </Avatar>
                    </div>
                    <div className="flex flex-col justify-start items-center gap-2 w-full">
                      <div className="flex justify-start items-center font-bold w-full cursor-pointer">
                        <div
                          onClick={() =>
                            navigate(`/get-test-question?id=${test.test_id}`)
                          }
                          className="w-full"
                        >
                          {test.test_name}
                        </div>
                        {/* <div className="w-[20%] flex flex-col justify-center items-center">
                          <p className="text-xs font-bold">
                            {test.flag === "1" ? "Public" : "Private"}
                          </p>
                          <button
                            onClick={() => {
                              handleChangeStatus(test.test_id, test.flag);
                            }}
                            className="toggle-switch scale-75 align-middle"
                          >
                            <input
                              type="checkbox"
                              checked={test.flag === "1"}
                              readOnly
                            />
                            <div className="toggle-switch-background">
                              <div className="toggle-switch-handle"></div>
                            </div>
                          </button>
                        </div> */}
                      </div>
                      <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                      <div className="flex justify-between items-center gap-1 w-full text-xs font-medium">
                        <div className="flex justify-start items-center gap-1 w-full">
                          <p>Duration:</p>
                          <p>{test.duration}</p>
                        </div>
                        {test.type === "1" && (
                          <div className="flex justify-center items-center gap-1 w-full">
                            <p>Start Date:</p>
                            <p>{test.test_date}</p>
                          </div>
                        )}
                        <div className="flex justify-end items-center gap-1 w-full">
                          <p>Type:</p>
                          <p>{test.type === "1" ? "Scheduled" : "Stored"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
          setUpdateTest={setUpdateTest}
          updateTestData={updateTestData}
        />
      )}
    </LayoutAdjuster>
  );
}

export default GetTest;
