// import parser from "html-react-parser";
import { LatexParser } from "@/utils/LatexParser";
import { Avatar } from "antd";
import { useLocation } from "react-router-dom";
import MakeUserPurchase from "../setting/MakeUserPurchase";
import { useEffect, useState } from "react";
import expiryDate from "@/utils/ExpiryDate";
import MakeUserPurchaseResponse from "@/utils/MakeUserPurchaseResponse";
import { IndianRupee } from "lucide-react";
import getPercentage from "@/utils/getPercentage";
import { useHeading } from "@/hooks/use-heading";

function GetTestSeriesTests() {
  const { setHeading } = useHeading();
  const location = useLocation();
  const { testData } = location.state || {};

  const [makePurchaseData, setMakePurchaseData] = useState(null);
  const [makePurchaseStatus, setMakePurchaseStatus] = useState(false);

  useEffect(() => {
    setHeading(
      <div className="w-full flex justify-center items-center gap-6">
        <h1 className="text-xl sm:text-3xl font-bold text-center ">
          Test Series Details
        </h1>
      </div>
    );
  }, [setHeading]);

  const renderData = (data) => {
    if (typeof data === "string") {
      return LatexParser(data);
    }
    return data;
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col justify-center items-center">
        {testData ? (
          <div className="flex flex-col justify-center items-center w-full">
            {makePurchaseStatus && (
              <MakeUserPurchaseResponse
                data={makePurchaseData}
                onClose={() => setMakePurchaseStatus(false)}
              />
            )}
            <div className="flex flex-col justify-center items-center w-full border rounded-md border-gray-300 my-2 p-3">
              <div className="flex flex-wrap justify-start items-center gap-4 w-full">
                <div className="flex flex-col justify-start items-center gap-2 w-full">
                  <div className="flex md:flex-row justify-between items-center w-full gap-2">
                    <Avatar className="bg-gray-500 text-white">
                      {testData.id}
                    </Avatar>
                    <p>{testData.duration}</p>
                  </div>
                  <div className="flex flex-row justify-between items-center font-bold w-full gap-2">
                    <div className="max-sm:text-sm">{testData.name}</div>
                    <div className="w-fit">
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
                  </div>
                  <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                  <div className="flex justify-start items-center font-bold w-full text-sm md:text-base whitespace-pre-wrap">
                    {renderData(testData.description)}
                  </div>
                  <hr className="w-full text-center m-auto text-bg-slate-400 bg-slate-300 border-slate-300" />
                  <div className="flex flex-wrap justify-between items-center gap-3 w-full">
                    <div className="flex justify-center items-center gap-1 w-fit">
                      <IndianRupee className="w-4 h-4" />
                      <p>{testData.price}</p>
                      <p className="line-through text-gray-500 ml-1 text-sm">
                        {testData.original_price}
                      </p>
                      {testData.original_price && testData.price && (
                        <p className="text-green-500 ml-1 text-sm">
                          {getPercentage(
                            testData.original_price,
                            testData.price
                          )}
                          %
                        </p>
                      )}
                    </div>
                    <div className="flex justify-start items-start gap-1 w-fit text-sm">
                      <p>Total Qns:</p>
                      <p>{testData.total_question}</p>
                    </div>
                    <div className="flex justify-start items-start gap-1 w-fit text-sm">
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
