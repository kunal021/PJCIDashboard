/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/url";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const storedToken = JSON.parse(localStorage.getItem("authToken"));
    if (storedToken?.jwt_token) {
      setAuthToken(storedToken);
      // navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (number, otp) => {
    if (otp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("number", number);
      formData.append("otp", otp);

      const response = await axios.post(
        `${API_URL}/admin/user/loginotp.php`,
        formData,
        { headers: { "content-type": "multipart/form-data" } }
      );

      if (response.status === 200) {
        toast.success("Login Successful");
        localStorage.setItem("authToken", JSON.stringify(response.data));
        setAuthToken(response.data);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
