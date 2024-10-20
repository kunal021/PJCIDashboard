/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../url";
import Loader from "../../utils/Loader";
import { Avatar } from "antd";
// import MakeUserPurchase from "../setting/MakeUserPurchase";
// import expiryDate from "../../utils/ExpiryDate";
// import MakeUserPurchaseResponse from "../../utils/MakeUserPurchaseResponse";
import * as XLSX from "xlsx";
import { LatexParser } from "@/utils/LatexParser";
// import parser from "html-react-parser";

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
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState([]);
  // const [makePurchaseStatus, setMakePurchaseStatus] = useState(false);
  // const [makePurchaseData, setMakePurchaseData] = useState(null);

  useEffect(() => {
    fetchTest(setTest, setLoading, testId);
  }, [testId]);

  const handleDownload = async () => {
    try {
      const formData = new FormData();
      formData.append("testid", test.id);
      const response = await axios.post(
        `${API_URL}/admin/test/gettestreport.php`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // console.log(response.data.data);
      if (response.status === 200) {
        const data = response.data.data;

        if (data && data.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(data);
          const workbook = XLSX.utils.book_new();
          const columnWidths = [
            { wpx: 120 },
            { wpx: 120 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
            { wpx: 100 },
          ];

          worksheet["!cols"] = columnWidths;
          XLSX.utils.book_append_sheet(workbook, worksheet, "Test Results");
          XLSX.writeFile(workbook, `${test.test_name}.xlsx`);
        } else {
          console.log("No data available for export.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(test);
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
              <div className="flex justify-center items-center gap-5">
                <h1 className="text-3xl font-bold text-center my-2">
                  Test Details
                </h1>
                {/* {test.test_date != "0000-00-00" && test.test_date && (
                  <MakeUserPurchase
                    id={test.id}
                    amount={test.price}
                    expiryDate={expiryDate(test?.test_date, 7)}
                    productInfo={test.test_name}
                    type={"3"}
                    setMakePurchaseStatus={setMakePurchaseStatus}
                    setMakePurchaseData={setMakePurchaseData}
                  />
                )} */}
                {test.id && (
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
                  >
                    Report
                  </button>
                )}
              </div>
              {/* {makePurchaseStatus && (
                <MakeUserPurchaseResponse
                  data={makePurchaseData}
                  onClose={() => setMakePurchaseStatus(false)}
                />
              )} */}
              <div className="flex justify-center items-center w-full border rounded-md border-gray-300 m-2 p-3">
                <div className="flex justify-start items-center gap-4 w-full">
                  <div className="flex flex-col justify-start items-center gap-2 w-full">
                    <div className="flex justify-between items-center w-full">
                      <Avatar className="bg-gray-500 text-white">
                        {test.id}
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
                      <div>{test.test_name}</div>
                    </div>
                    <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                    <div className="flex justify-start items-center font-bold w-full whitespace-pre-wrap">
                      {/* {console.log(test.description)} */}
                      {typeof test.description === "string"
                        ? LatexParser(test.description)
                        : null}
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
