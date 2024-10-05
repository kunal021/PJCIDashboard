/* eslint-disable react/prop-types */
import axios from "axios";
import { API_URL } from "../../url";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const getDataToAdd = async (type, setData) => {
  try {
    const formData = new FormData();
    formData.append("type", type);
    const response = await axios.post(
      `${API_URL}/admin/slider/getdatatoadd.php`,
      formData,
      { headers: { "content-type": "multipart/form-data" } }
    );
    console.log(response);
    if (response.status === 200) {
      setData(response.data.data);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.response.data.message || "Error fetching data");
  }
};

function GetSliderData({ type, handleChange, value, setValue, useType }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    getDataToAdd(type, setData);
    if (useType === "add") {
      setValue((prev) => ({ ...prev, type_id: "" }));
    }
  }, [setValue, type, useType]);

  const renderOptions = () => {
    if (type == 1) {
      return data?.map((item, idx) => (
        <option key={idx} value={item.id}>
          {item.course_name}
        </option>
      ));
    }
    if (type == 2) {
      return data?.map((item, idx) => (
        <option key={idx} value={item.id}>
          {item.full_course_name}
        </option>
      ));
    }
    if (type == 3) {
      return data?.map((item, idx) => (
        <option key={idx} value={item.test_id}>
          {item.test_name}
        </option>
      ));
    }
    return null;
  };

  return (
    <>
      {type != 0 && (
        <select
          name="type_id"
          value={value}
          onChange={handleChange}
          className="w-96 h-fit mt-2.5 py-1.5 px-1 flex justify-center items-center border rounded-md border-gray-300"
        >
          {!value && (
            <option value="" disabled>
              Select an option
            </option>
          )}
          {renderOptions()}
        </select>
      )}
    </>
  );
}

export default GetSliderData;
