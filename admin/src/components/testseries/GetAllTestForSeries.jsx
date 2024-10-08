import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTest, setTest } from "../../redux/tests/testSlice";
// import { deleteTest } from "../../redux/tests/testSlice";
import axios from "axios";
// import LinkButton from "../../utils/LinkButton";
// import UpdateTest from "./UpdateTest";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
// import UpdateBtn from "../../utils/UpdateBtn";
// import ConfirmDelete from "../../utils/ConfirmDelete";
// import toast from "react-hot-toast";
// import LayoutAdjuster from "../../utils/LayoutAdjuster";
// import parser from "html-react-parser";
import { Avatar } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import toast from "react-hot-toast";
import ConfirmDelete from "@/utils/ConfirmDelete";

const fetchTest = async (dispatch, setLoading, directory_id) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("directory_id", directory_id);
    formData.append("content_type", 3);
    const response = await axios.post(
      `${API_URL}/admin/directory/getdirectorycontent.php`,
      formData,
      { headers: "multipart/form-data" }
    );
    // console.log(response);
    dispatch(setTest(response.data.data));
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetAllTestForSeries() {
  const location = useLocation();
  const { testData } = location.state || {};
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //   const [updateTest, setUpdateTest] = useState(false);
  //   const [updateTestData, setUpdateTestData] = useState({});

  const dispatch = useDispatch();
  const test = useSelector((state) => state.test.test);

  useEffect(() => {
    fetchTest(dispatch, setLoading, testData.directory_id);
  }, [dispatch, testData.directory_id]);

  const handleDelete = async (testId) => {
    try {
      const formData = new FormData();
      formData.append("directory_id", testData.directory_id);
      formData.append("content_type", 3);
      formData.append("content_id", testId);
      const response = await axios.post(
        `${API_URL}/admin/directory/deletecontentfromdir.php`,
        formData,
        { headers: "multipart/form-data" }
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

  //   const handleChangeStatus = useCallback(
  //     async (testId, flag) => {
  //       const confirmAlert = window.confirm(
  //         `${
  //           flag === "1"
  //             ? "Test will become Inactive. Do you want to proceed"
  //             : "Test will become Active. Do you want to proceed"
  //         }`
  //       );
  //       if (confirmAlert) {
  //         try {
  //           flag = flag === "1" ? "0" : "1";
  //           const formData = new FormData();
  //           formData.append("test_id", testId);
  //           formData.append("statuscode", flag);
  //           await axios.post(
  //             `${API_URL}/admin/test/updateteststatus.php`,
  //             formData,
  //             { headers: { "content-type": "multipart/form-data" } }
  //           );
  //           // console.log(res);

  //           // Update local state instead of fetching users again
  //           const updatedTest = test.map((test) =>
  //             test.test_id === testId ? { ...test, flag } : test
  //           );
  //           dispatch(setTest(updatedTest));
  //         } catch (error) {
  //           console.log("Error updating user status:", error);
  //           // Handle error (e.g., show an error message)
  //         }
  //       }
  //     },
  //     [dispatch, test]
  //   );

  // console.log(test);

  return (
    <Card className="w-full border-gray-300">
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${"w-full flex flex-col justify-center items-center my-5"} `}
        >
          <div className="flex justify-center items-center gap-10">
            {/* <h1 className="text-3xl font-bold text-center">Test List</h1>
            <LinkButton to={"/add-test"}>Add Test</LinkButton> */}
          </div>
          {test.length > 0 ? (
            <div className="flex flex-col justify-center items-center w-full">
              {test.map((test, idx) => (
                <div
                  key={idx}
                  className="flex justify-center items-center w-[90%] border rounded-md border-gray-300 m-2 p-3"
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
                        {/* <div className="w-[20%]">
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
                  </div>
                  <div className="flex flex-col justify-center items-end gap-4 w-[10%]">
                    {/* <UpdateBtn
                      handleClick={() => {
                        setUpdateTest((prev) => !prev);
                        // setUpdateTestData(test);
                      }}
                    /> */}
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
    </Card>
  );
}

export default GetAllTestForSeries;
