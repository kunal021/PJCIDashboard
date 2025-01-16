/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import { Avatar } from "antd";
import { LatexParser } from "@/utils/LatexParser";
import { useHeading } from "@/hooks/use-heading";
import { useNavigate } from "react-router-dom";

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

    if (response.status === 200) {
      setTest(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching courses:", error);
  } finally {
    setLoading(false);
  }
};

function GetTestById({ testId }) {
  const navigate = useNavigate();
  const { setHeading } = useHeading();
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState([]);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center my-2">
          Test Details
        </h1>
      </div>
    );
    fetchTest(setTest, setLoading, testId);
  }, [setHeading, testId]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full flex flex-col justify-center items-center mx-auto">
          {test ? (
            <div className="flex flex-col justify-center items-center w-full">
              <div className="flex flex-col justify-center items-center w-full border rounded-md border-gray-300 m-2 p-3">
                <div className="flex flex-col justify-start items-center gap-4 w-full">
                  {/* Header Section */}
                  <div className="flex flex-wrap justify-between items-center w-full gap-4">
                    <Avatar className="bg-gray-500 text-white">
                      {test.id}
                    </Avatar>
                    {test.id && (
                      <button
                        onClick={() => navigate(`/test/report/${test.id}`)}
                        // onClick={handleDownload}
                        className="px-4 py-2 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
                      >
                        Report
                      </button>
                    )}
                    <div className="flex flex-wrap justify-between items-start gap-2 w-full">
                      <div className="flex items-center gap-1 w-fit">
                        <p className="font-semibold">Start Date:</p>
                        <p>{test.test_date}</p>
                      </div>
                      <div className="flex items-center gap-1 w-fit">
                        <p className="font-semibold">Start Time:</p>
                        <p>{test.start_time}</p>
                      </div>
                      <div className="flex items-center gap-1 w-fit">
                        <p className="font-semibold">End Time:</p>
                        <p>{test.end_time}</p>
                      </div>
                      <div className="flex items-center gap-1 w-fit">
                        <p className="font-semibold">Duration:</p>
                        <p>{test.duration}</p>
                      </div>
                    </div>
                  </div>
                  <hr className="w-full text-bg-slate-400 bg-slate-300 border-slate-300" />
                  {/* Test Name & Report Button */}
                  <div className="flex flex-wrap justify-between items-center w-full">
                    <div className="font-bold">{test.test_name}</div>
                  </div>
                  <hr className="w-full text-bg-slate-400 bg-slate-300 border-slate-300" />
                  {/* Description */}
                  <div className="flex justify-start items-center w-full font-bold whitespace-pre-wrap">
                    {typeof test.description === "string"
                      ? LatexParser(test.description)
                      : null}
                  </div>
                  <hr className="w-full text-bg-slate-400 bg-slate-300 border-slate-300" />
                  {/* Additional Details */}
                  <div className="flex flex-wrap justify-between items-start gap-4 w-full">
                    <div className="flex items-center gap-1 w-fit">
                      <p className="font-semibold">Price:</p>
                      <p>{test.price}</p>
                    </div>
                    <div className="flex items-center gap-1 w-fit">
                      <p className="font-semibold">No. Of Qns:</p>
                      <p>{test.number_of_questions}</p>
                    </div>
                    <div className="flex items-center gap-1 w-fit">
                      <p className="font-semibold">Mark per Qns:</p>
                      <p>{test.mark_per_qns}</p>
                    </div>
                    <div className="flex items-center gap-1 w-fit">
                      <p className="font-semibold">Total Marks:</p>
                      <p>{test.total_mark}</p>
                    </div>
                    <div className="flex items-center gap-1 w-fit">
                      <p className="font-semibold">Negative Mark:</p>
                      <p>{test.negative_mark}</p>
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
    </>
  );
}

export default GetTestById;
