import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTest } from "../../redux/tests/testSlice";
import { deleteTest } from "../../redux/tests/testSlice";
import axios from "axios";
import LinkButton from "../../utils/LinkButton";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import UpdateBtn from "../../utils/UpdateBtn";
import ConfirmDelete from "../../utils/ConfirmDelete";
import toast from "react-hot-toast";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import { Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import UpdateTestSeries from "./Update";

const fetchTest = async (dispatch, setLoading) => {
  try {
    setLoading(true);
    const response = await axios.post(
      `${API_URL}/admin/testseries/getalltestseries.php`
    );

    dispatch(setTest(response.data.data));
    // console.log(response);
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetTestSeries() {
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
      const formData = new FormData();
      formData.append("id", testId);
      const response = await axios.post(
        `${API_URL}/admin/testseries/deletetestseries.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );
      //   console.log(response);

      if (response.status == 201) {
        dispatch(deleteTest(testId));
        toast.success("Test Deleted Successfully");
      }
    } catch (error) {
      toast.error(error.response.data.massage || "Error deleting test");
      // console.error("Error fetching category:", error);
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

          // Update local state instead of fetching users again
          const updatedTest = test.map((test) =>
            test.id === testId ? { ...test, is_active: flag } : test
          );
          dispatch(setTest(updatedTest));
        } catch (error) {
          console.log("Error updating user status:", error);
          // Handle error (e.g., show an error message)
        }
      }
    },
    [dispatch, test]
  );

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
            <h1 className="text-3xl font-bold text-center">Test Series</h1>
            <LinkButton to={"/add-testseries"}>Add</LinkButton>
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
                            navigate(`/get-testseries-tests?id=${test.id}`, {
                              state: { testData: test },
                            })
                          }
                          className="w-full"
                        >
                          {test.name}
                        </div>
                        <div className="w-[20%]">
                          <button
                            onClick={() => {
                              handleChangeStatus(test.id, test.is_active);
                            }}
                            className="toggle-switch scale-75 align-middle"
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
                    <ConfirmDelete handleClick={() => handleDelete(test.id)} />
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
        <UpdateTestSeries
          setUpdateTest={setUpdateTest}
          updateTestData={updateTestData}
        />
      )}
    </LayoutAdjuster>
  );
}

export default GetTestSeries;
