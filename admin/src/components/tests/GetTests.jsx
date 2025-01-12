import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTest } from "../../redux/tests/testSlice";
import { deleteTest } from "../../redux/tests/testSlice";
import axios from "axios";
import UpdateTest from "./UpdateTest";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import ConfirmDelete from "../../utils/ConfirmDelete";
import toast from "react-hot-toast";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import AddTest from "./AddTest";
import { useHeading } from "@/hooks/use-heading";

const fetchTest = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(`${API_URL}/admin/test/getalltest.php`);
    dispatch(setTest(response.data.data));
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetTest() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const test = useSelector((state) => state.test.test);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">Test</h1>
        <AddTest />
      </div>
    );
    fetchTest(dispatch, setLoading);
  }, [dispatch, setHeading]);

  const handleDelete = async (testId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/admin/test/deletetest.php?testid=${testId}`
      );

      if (response.status == 201) {
        dispatch(deleteTest(testId));
        toast.success("Test Deleted Successfully");
      }
    } catch (error) {
      toast.error(error.response.data.massage || "Error deleting test");
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
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[90%] flex flex-col justify-center items-center mx-auto">
          {test.length > 0 ? (
            <div className="w-full px-4 md:px-6 py-4 flex flex-col items-center">
              {test.map((test, idx) => (
                <div
                  key={idx}
                  className="w-full sm:w-[90%] lg:w-[80%] border rounded-lg border-gray-300 mb-4"
                >
                  <div className="p-4 flex flex-col sm:flex-row gap-4">
                    {/* Avatar Section */}
                    <div className="flex justify-between sm:flex-col items-center sm:items-start gap-2">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-500 text-white">
                        {idx + 1}
                      </Avatar>
                      {isMobile && (
                        <div className="flex items-center gap-2">
                          <UpdateTest updateTestData={test} />
                          <ConfirmDelete
                            handleClick={() => handleDelete(test.test_id)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Main Content Section */}
                    <div className="flex-1">
                      <div className="flex flex-col gap-3 w-full">
                        {/* Test Name */}
                        <div
                          onClick={() =>
                            navigate(`/test/question?id=${test.test_id}`)
                          }
                          className="text-base sm:text-lg font-bold cursor-pointer hover:text-blue-600"
                        >
                          {test.test_name}
                        </div>

                        <hr className="border-gray-200" />

                        {/* Test Details */}
                        <div className="flex flex-wrap justify-between items-centergap-2 text-xs sm:text-sm font-medium text-gray-600">
                          <div className="flex items-center gap-1">
                            <span>Duration:</span>
                            <span>{test.duration}</span>
                          </div>

                          {test.type === "1" && (
                            <div className="flex items-center gap-1">
                              <span>Start Date:</span>
                              <span>{test.test_date}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-1">
                            <span>Type:</span>
                            <span>
                              {test.type === "1" ? "Scheduled" : "Stored"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {!isMobile && (
                      <div className="flex sm:flex-col justify-end items-center gap-2 pt-3 sm:pt-0">
                        <UpdateTest updateTestData={test} />
                        <ConfirmDelete
                          handleClick={() => handleDelete(test.test_id)}
                        />
                      </div>
                    )}
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
    </>
  );
}

export default GetTest;
