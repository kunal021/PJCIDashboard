/* eslint-disable react/prop-types */
import { useState } from "react";
import * as XLSX from "xlsx";

import { Loader, Plus } from "lucide-react";
import axios from "axios";
import { API_URL } from "../../url";

const MakeUserPurchase = ({
  id,
  type,
  amount,
  expiryDate,
  productInfo,
  setMakePurchaseStatus,
  setMakePurchaseData,
}) => {
  // const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const json = XLSX.utils.sheet_to_json(worksheet);

          if (json.length === 0 || !Object.keys(json[0]).includes("number")) {
            throw new Error(
              'The Excel sheet must have a column named "number".'
            );
          }

          const isValid = json.every(
            (row) => !isNaN(row.number) && typeof row.number === "number"
          );

          if (!isValid) {
            throw new Error('The "number" column must contain only numbers.');
          }

          const jsonWithNumberKey = json.map((row) => ({
            number: row.number,
          }));

          // setJsonData(jsonWithNumberKey);
          setError("");
          await handleUploadUser(jsonWithNumberKey);
        } catch (err) {
          setError(err.message);
          // setJsonData(null);
        } finally {
          event.target.value = "";
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleUploadUser = async (jsonData) => {
    try {
      setLoading(true);
      const data = {
        purchase_id: +id,
        purchase_type: +type,
        amount: +amount,
        expiry_date: expiryDate,
        product_info: productInfo,
        numbers: jsonData,
      };
      // console.log(data);
      const response = await axios.post(
        `${API_URL}/admin/payment/makeuserpurchase.php`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response);
      if (response.status === 200) {
        setMakePurchaseData(response.data);
        setMakePurchaseStatus(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="">
        <input
          id="fileinput"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label
          htmlFor="fileinput"
          className="flex flex-col justify-center items-center w-12 h-10 cursor-pointer bg-lime-50 text-black px-4 py-2 rounded-lg border-2 border-lime-200 hover:bg-lime-100"
        >
          {!loading ? (
            <Plus />
          ) : (
            <>
              <Loader className="animate-spin h-8 w-8" />
            </>
          )}
        </label>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {/* <pre className="text-xs text-center w-96">
          {JSON.stringify(jsonData, null, 2)}
        </pre> */}
      </div>
    </div>
  );
};

export default MakeUserPurchase;
