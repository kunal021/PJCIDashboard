/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import parser from "html-react-parser";
import { Avatar } from "antd";

const fetchTest = async (setTest, setLoading, testId) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("test_id", testId);
    const response = await axios.post(
      `${API_URL}/admin/test/gettestbyid.php`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    setTest(response.data.data);
    // console.log(response.data.data);
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetTestById({ testId }) {
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState([]);
  // console.log(test);

  useEffect(() => {
    fetchTest(setTest, setLoading, testId);
  }, [testId]);

  return (
    <div className="w-full">
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`w-full flex flex-col justify-center items-center mx-auto`}
        >
          {test ? (
            <div className="flex flex-col justify-center items-center w-full">
              <h1 className="text-3xl font-bold text-center my-2">
                Test Details
              </h1>
              <div className="flex justify-center items-center w-full border rounded-md border-gray-300 m-2 p-3">
                <div className="flex justify-start items-center gap-4 w-full">
                  <div className="flex flex-col justify-start items-center gap-2 w-full">
                    <div className="flex justify-between items-center w-full">
                      <Avatar className="bg-gray-500 text-white">
                        {test.test_id}
                      </Avatar>
                      <div className="flex justify-start items-start gap-1 w-fit">
                        <p>Start Date:</p>
                        <p>{test.test_date}</p>
                      </div>
                      <div className="flex justify-start items-start gap-1 w-fit">
                        <p>Start Time:</p>
                        <p>{test.start_time}</p>
                      </div>
                      <div className="flex justify-start items-start gap-1 w-fit">
                        <p>End Time:</p>
                        <p>{test.end_time}</p>
                      </div>
                      <div className="flex justify-start items-start gap-1 w-fit">
                        <p>Duration:</p>
                        <p>{test.duration}</p>
                      </div>
                    </div>
                    <div className="flex justify-start items-center font-bold w-full">
                      <div>
                        {typeof test.test_name === "string"
                          ? parser(test.test_name)
                          : test.test_name}
                      </div>
                    </div>
                    <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                    <div className="flex justify-start items-center font-bold w-full">
                      <div>
                        {typeof test.description === "string"
                          ? parser(test.description)
                          : test.description}
                      </div>
                    </div>
                    <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                    <div className="flex justify-between items-center gap-1 w-full">
                      <div className="flex justify-start items-start gap-1 w-fit">
                        <p>Price:</p>
                        <p>{test.price}</p>
                      </div>
                      <div className="flex justify-start items-start gap-1 w-fit">
                        <p>No. Of Qns:</p>
                        <p>{test.number_of_questions}</p>
                      </div>
                      <div className="flex justify-start items-start gap-1 w-fit">
                        <p>Mark per Qns:</p>
                        <p>{test.mark_per_qns}</p>
                      </div>
                      <div className="flex justify-start items-start gap-1 w-fit">
                        <p>Total Marks:</p>
                        <p>{test.total_mark}</p>
                      </div>
                      <div className="flex justify-start items-start gap-1 w-fit">
                        <p>Negative Mark:</p>
                        <p>{test.negative_mark}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-center mt-20">
              No Data Available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GetTestById;
