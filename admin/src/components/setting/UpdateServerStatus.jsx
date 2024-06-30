import axios from "axios";
import { useState } from "react";
import { API_URL } from "../../url";

function UpdateServerStatus() {
  const [statusCode, setStatusCode] = useState("1");
  const handleChangeStatus = async (statusCode) => {
    const confirmAlert = window.confirm(
      `${
        statusCode === 1
          ? "Server will become Inactive. Do you want to proceed"
          : "Server will become Active. Do you want to proceed"
      }`
    );
    if (confirmAlert) {
      try {
        statusCode = statusCode === "1" ? "0" : "1";
        const formData = new FormData();
        // formData.append("userid", userId);
        formData.append("status_code", statusCode);
        await axios.post(
          `${API_URL}/admin/settings/updateserverstatus.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );

        // Update local state instead of fetching users again
        console.log(statusCode);
        setStatusCode(statusCode);
      } catch (error) {
        console.log("Error updating user status:", error);
        // Handle error (e.g., show an error message)
      }
    }
  };
  return (
    <div className="flex items-center justify-start">
      <p className="font-semibold text-center">
        {statusCode === "1" ? "Server is Active" : "Server is Inactive"}
      </p>
      <button
        onClick={() => {
          handleChangeStatus(statusCode);
        }}
        className="toggle-switch scale-75"
      >
        <input type="checkbox" checked={statusCode === "1"} readOnly />
        <div className="toggle-switch-background">
          <div className="toggle-switch-handle"></div>
        </div>
      </button>
    </div>
  );
}

export default UpdateServerStatus;
