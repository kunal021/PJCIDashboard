import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "../url";
import parser from "html-react-parser";
function PrivacyPolicy() {
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append("page_key", "privacy_policy");
        const response = await axios.post(
          `${API_URL}/admin/settings/get_page.php`,
          formData,
          { headers: { "content-type": "multipart/form-data" } }
        );
        console.log(response);
        setData(response.data.data.content);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          whiteSpace: "pre-wrap",
          padding: "20px",
          fontSize: "3rem",
          fontWeight: "bold",
        }}
      >
        Privacy Policy
      </div>
      <div style={{ whiteSpace: "pre-wrap", padding: "20px" }}>
        {data && parser(data)}
      </div>
    </div>
  );
}

export default PrivacyPolicy;
