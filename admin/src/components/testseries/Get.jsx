import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTest } from "../../redux/tests/testSlice";
import { deleteTest } from "../../redux/tests/testSlice";
import axios from "axios";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import ConfirmDelete from "../../utils/ConfirmDelete";
import toast from "react-hot-toast";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import UpdateTestSeries from "./Update";
import { useHeading } from "@/hooks/use-heading";
import AddTestSeries from "./Add";

const fetchTest = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${API_URL}/admin/testseries/getalltestseries.php`
    );
    dispatch(setTest(response.data.data));
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetTestSeries() {
  const { setHeading } = useHeading();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const test = useSelector((state) => state.test.test);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center">
          Test Series
        </h1>
        <AddTestSeries fetchData={() => fetchTest(dispatch, setLoading)} />
      </div>
    );
    fetchTest(dispatch, setLoading);
  }, [dispatch, setHeading]);

  const handleDelete = async (testId) => {
    try {
      const formData = new FormData();
      formData.append("id", testId);
      const response = await axios.post(
        `${API_URL}/admin/testseries/deletetestseries.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status == 201) {
        dispatch(deleteTest(testId));
        toast.success("Test Deleted Successfully");
      }
    } catch (error) {
      toast.error(error.response.data.massage || "Error deleting test");
    }
  };

  const handleChangeStatus = useCallback(
    async (testId, flag) => {
      const confirmAlert = window.confirm(
        `${
          flag === "1"
            ? "Test Series will become Inactive. Do you want to proceed"
            : "Test Series will become Active. Do you want to proceed"
        }`
      );
      if (confirmAlert) {
        try {
          flag = flag === "1" ? "0" : "1";
          const formData = new FormData();
          formData.append("id", testId);
          formData.append("status", flag);
          await axios.post(
            `${API_URL}/admin/testseries/updatetestseriesstatus.php`,
            formData,
            { headers: { "content-type": "multipart/form-data" } }
          );
          const updatedTest = test.map((test) =>
            test.id === testId ? { ...test, is_active: flag } : test
          );
          dispatch(setTest(updatedTest));
        } catch (error) {
          console.log("Error updating status:", error);
        }
      }
    },
    [dispatch, test]
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[95%] sm:w-[80%] flex flex-col justify-center items-center mx-auto">
          {test.length > 0 ? (
            <div className="max-w-5xl mx-auto w-full px-4 py-6 space-y-4">
              {test.map((test, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <Avatar className="h-8 w-8 shrink-0 bg-gray-500 text-white text-sm">
                        {idx + 1}
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <div
                          onClick={() =>
                            navigate(`/testseries/tests?id=${test.id}`, {
                              state: { testData: test },
                            })
                          }
                          className="text-base font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                        >
                          {test.name}
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">Tests:</span>
                            <span>{test.total_test}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium">Questions:</span>
                            <span>{test.total_question}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between md:justify-end items-center gap-4 pt-3 md:pt-0">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-xs font-medium text-gray-600 whitespace-nowrap max-sm:hidden">
                            {test.is_active === "1" ? "Public" : "Private"}
                          </p>
                          <button
                            onClick={() =>
                              handleChangeStatus(test.id, test.is_active)
                            }
                            className="toggle-switch scale-[60%] sm:scale-75"
                          >
                            <input
                              type="checkbox"
                              checked={test.is_active === "1"}
                              readOnly
                            />
                            <div className="toggle-switch-background">
                              <div className="toggle-switch-handle"></div>
                            </div>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <UpdateTestSeries updateTestData={test} />
                          <ConfirmDelete
                            handleClick={() => handleDelete(test.id)}
                          />
                        </div>
                      </div>
                    </div>
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

export default GetTestSeries;
