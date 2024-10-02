/* eslint-disable react/prop-types */
// import { useState } from "react";
// import axios from "axios";
// import { API_URL } from "../../url";
// import Loader from "../../utils/Loader";
import parser from "html-react-parser";
import { Avatar } from "antd";
// import MakeUserPurchase from "../setting/MakeUserPurchase";
// import expiryDate from "../../utils/ExpiryDate";
// import MakeUserPurchaseResponse from "../../utils/MakeUserPurchaseResponse";
import { useLocation } from "react-router-dom";
import LayoutAdjuster from "@/utils/LayoutAdjuster";

// const fetchTest = async (setTest, setLoading, testId) => {
//   try {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("test_id", testId);
//     const response = await axios.post(
//       `${API_URL}/admin/test/gettestbyid.php`,
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     if (response.status === 200) {
//       setTest(response.data.data);
//     }
//   } catch (error) {
//     console.error("Error fetching courses:", error);
//   } finally {
//     setLoading(false);
//   }
// };

function GetTestSeriesTests() {
  const location = useLocation();
  const { testData } = location.state || {};
  //   const [loading, setLoading] = useState(false);
  //   const [test, setTest] = useState([]);
  //   const [makePurchaseStatus, setMakePurchaseStatus] = useState(false);
  //   const [makePurchaseData, setMakePurchaseData] = useState(null);

  //   useEffect(() => {
  //     fetchTest(setTest, setLoading, testData?.id);
  //   }, [testData?.id]);

  return (
    <LayoutAdjuster>
      <div
        className={`w-[80%] flex flex-col justify-center items-center mx-auto`}
      >
        {testData ? (
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex justify-center items-center gap-5">
              <h1 className="text-3xl font-bold text-center my-2">
                Test Series Details
              </h1>
              {/* {testData.test_date != "0000-00-00" && testData.test_date && (
                  <MakeUserPurchase
                    id={testData.id}
                    amount={testData.price}
                    expiryDate={expiryDate(testData?.test_date, 7)}
                    productInfo={testData.test_name}
                    type={"3"}
                    setMakePurchaseStatus={setMakePurchaseStatus}
                    setMakePurchaseData={setMakePurchaseData}
                  />
                )} */}
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
                      {testData.id}
                    </Avatar>
                    {/* <div className="flex justify-start items-start gap-1 w-fit">
                      <p>Start Date:</p>
                      <p>{testData.test_date}</p>
                    </div>
                    <div className="flex justify-start items-start gap-1 w-fit">
                      <p>Start Time:</p>
                      <p>{testData.start_time}</p>
                    </div>
                    <div className="flex justify-start items-start gap-1 w-fit">
                      <p>End Time:</p>
                      <p>{testData.end_time}</p>
                    </div> */}
                    <div className="flex justify-start items-start gap-1 w-fit">
                      <p>Duration:</p>
                      <p>{testData.duration}</p>
                    </div>
                  </div>
                  <div className="flex justify-start items-center font-bold w-full">
                    <div>{testData.name}</div>
                  </div>
                  <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                  <div className="flex justify-start items-center font-bold w-full">
                    <div>
                      {typeof testData.description === "string"
                        ? parser(testData.description)
                        : testData.description}
                    </div>
                  </div>
                  <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                  <div className="flex justify-between items-center gap-1 w-full">
                    <div className="flex justify-start items-start gap-1 w-fit">
                      <p>Price:</p>
                      <p>{testData.price}</p>
                    </div>
                    <div className="flex justify-start items-start gap-1 w-fit">
                      <p>No. Of Qns:</p>
                      <p>{testData.total_question}</p>
                    </div>
                    {/* <div className="flex justify-start items-start gap-1 w-fit">
                      <p>Mark per Qns:</p>
                      <p>{testData.mark_per_qns}</p>
                    </div> */}
                    <div className="flex justify-start items-start gap-1 w-fit">
                      <p>Total Tests:</p>
                      <p>{testData.total_test}</p>
                    </div>
                    {/* <div className="flex justify-start items-start gap-1 w-fit">
                      <p>Negative Mark:</p>
                      <p>{testData.negative_mark}</p>
                    </div> */}
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
    </LayoutAdjuster>
  );
}

export default GetTestSeriesTests;
