// import parser from "html-react-parser";
import { LatexParser } from "@/utils/LatexParser";
import { Avatar } from "antd";
import { useLocation } from "react-router-dom";
import MakeUserPurchase from "../setting/MakeUserPurchase";
import { useState } from "react";
import expiryDate from "@/utils/ExpiryDate";
import MakeUserPurchaseResponse from "@/utils/MakeUserPurchaseResponse";
import { IndianRupee } from "lucide-react";
import getPercentage from "@/utils/getPercentage";

function GetTestSeriesTests() {
  const location = useLocation();
  const { testData } = location.state || {};
  // console.log(testData);

  const [makePurchaseData, setMakePurchaseData] = useState(null);
  const [makePurchaseStatus, setMakePurchaseStatus] = useState(false);

  // console.log(testData);

  const renderData = (data) => {
    if (typeof data === "string") {
      return LatexParser(data);
    }
    return data;
  };

  return (
    <div className="w-full">
      <div
        className={`w-full flex flex-col justify-center items-center mx-auto`}
      >
        {testData ? (
          <div className="flex flex-col justify-center items-center w-full">
            <div className="flex justify-center items-center gap-5">
              <h1 className="text-3xl font-bold text-center my-2">
                Test Series Details
              </h1>
              {testData && (
                <MakeUserPurchase
                  id={testData.id}
                  amount={testData.price}
                  expiryDate={expiryDate(testData?.duration, 7)}
                  productInfo={testData.name}
                  type={"3"}
                  setMakePurchaseStatus={setMakePurchaseStatus}
                  setMakePurchaseData={setMakePurchaseData}
                />
              )}
            </div>

            {makePurchaseStatus && (
              <MakeUserPurchaseResponse
                data={makePurchaseData}
                onClose={() => setMakePurchaseStatus(false)}
              />
            )}
            <div className="flex justify-center items-center w-full border rounded-md border-gray-300 m-2 p-3">
              <div className="flex justify-start items-center gap-4 w-full">
                <div className="flex flex-col justify-start items-center gap-2 w-full">
                  <div className="flex justify-between items-center w-full">
                    <Avatar className="bg-gray-500 text-white">
                      {testData.id}
                    </Avatar>
                    <div className="flex justify-start items-start gap-1 w-fit">
                      <p>Duration:</p>
                      <p>{testData.duration}</p>
                    </div>
                  </div>
                  <div className="flex justify-start items-center font-bold w-full">
                    <div>{testData.name}</div>
                  </div>
                  <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                  <div className="flex justify-start items-center font-bold w-full whitespace-pre-wrap">
                    {renderData(testData.description)}
                  </div>
                  <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                  <div className="flex justify-between items-center gap-1 w-full">
                    <div className="flex justify-center items-center gap-1 w-fit">
                      <IndianRupee className="w-4 h-4" />
                      <p>{testData.price}</p>
                      <p className="line-through text-gray-500 ml-1">
                        {testData.original_price}
                      </p>
                      {testData.original_price && testData.price && (
                        <p className="text-green-500 ml-1">
                          {getPercentage(
                            testData.original_price,
                            testData.price
                          )}
                          %
                        </p>
                      )}
                    </div>
                    <div className="flex justify-start items-start gap-1 w-fit">
                      <p>Total Qns:</p>
                      <p>{testData.total_question}</p>
                    </div>
                    <div className="flex justify-start items-start gap-1 w-fit">
                      <p>Total Tests:</p>
                      <p>{testData.total_test}</p>
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
    </div>
  );
}

export default GetTestSeriesTests;
