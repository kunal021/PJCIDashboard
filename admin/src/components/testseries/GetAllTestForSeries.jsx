import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import { Avatar } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import toast from "react-hot-toast";
import ConfirmDelete from "@/utils/ConfirmDelete";

const fetchTest = async (setTest, setLoading, directory_id) => {
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
    setTest(response.data.data);
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
  const [test, setTest] = useState([]);

  useEffect(() => {
    fetchTest(setTest, setLoading, testData.directory_id);
  }, [testData.directory_id]);

  // console.log(test);

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
        setTest((prevTest) => prevTest.filter((t) => t.test_id !== testId));
        toast.success("Test Deleted Successfully");
      }
    } catch (error) {
      toast.error(error.response.data.massage || "Error deleting test");
      // console.error("Error fetching category:", error);
    }
  };

  return (
    <Card className="w-full border-gray-300">
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`${"w-full flex flex-col justify-center items-center my-5"} `}
        >
          <div className="flex justify-center items-center gap-10"></div>
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
