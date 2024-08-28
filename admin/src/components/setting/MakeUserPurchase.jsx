import { useState } from "react";
import * as XLSX from "xlsx";
import LayoutAdjuster from "../../utils/LayoutAdjuster";
import { Loader, UploadCloud } from "lucide-react";

const MakeUserPurchase = () => {
  const [jsonData, setJsonData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
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

          setJsonData(jsonWithNumberKey);
          setError("");
        } catch (err) {
          setError(err.message);
          setJsonData(null);
        }
      };

      reader.readAsArrayBuffer(file);
    }

    try {
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(jsonData);

  return (
    <LayoutAdjuster>
      <div className="border border-gray-300 rounded-md">
        <input
          id="fileinput"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label
          htmlFor="fileinput"
          className="flex flex-col justify-center items-center w-36 h-14 cursor-pointer bg-gray-50 text-black px-4 py-2 rounded-lg border-2 border-gray-300 border-dashed hover:bg-blue-50"
        >
          {!loading ? (
            <>
              <UploadCloud />
              <p className="text-xs">Upload File</p>
            </>
          ) : (
            <>
              <Loader className="animate-spin h-6 w-6" />
              <p className="text-xs">Uploading...</p>
            </>
          )}
        </label>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <pre className="text-xs text-center w-96">
          {jsonData
            ? JSON.stringify(jsonData, null, 2)
            : "No file uploaded yet"}
        </pre>
      </div>
    </LayoutAdjuster>
  );
};

export default MakeUserPurchase;
