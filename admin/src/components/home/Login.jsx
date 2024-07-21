import axios from "axios";
import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";
import { API_URL } from "../../url";
import toast from "react-hot-toast";

function Login() {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [IP, setIP] = useState("");
  const [OS, setOS] = useState("");
  const [otpStatus, setOtpStatus] = useState();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const parser = new UAParser();

  useEffect(() => {
    const getDeviceData = async () => {
      try {
        const ip = await axios.get("https://ipapi.co/json");
        setIP(ip.data.ip);
        setOS(`${parser.getOS().name} ${parser.getOS().version}`);
      } catch (error) {
        console.log(error);
      }
    };
    getDeviceData();
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGetOTP = async () => {
    if (number.length < 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("number", number);
      formData.append("imei", IP);
      formData.append("os", OS);
      formData.append("devicemodel", "Desktop");
      const response = await axios.post(
        `${API_URL}/admin/user/login.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        setOtpStatus(201);
        setCountdown(90); // Set countdown to 90 seconds
        toast.success("OTP Sent Successfully");
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
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
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );
      console.log(response);

      if (response.status === 201) {
        toast.success("Login Successful");
        localStorage.setItem("authToken", response.data.data);
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) {
      toast.error(`Please wait for the ${countdown} seconds to resend OTP`);
      return;
    } // Prevent resending OTP before countdown ends
    try {
      const formData = new FormData();
      formData.append("number", number);
      const response = await axios.post(
        `${API_URL}/admin/user/resendotp.php`,
        formData,
        {
          headers: { "content-type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        setCountdown(90); // Reset countdown to 90 seconds
        toast.success("OTP Resent Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center m-auto min-h-screen gap-10">
      <h1 className="text-3xl font-bold">Log In to Continue</h1>
      <div className="flex flex-col justify-center items-center border border-gray-200 p-6 rounded-lg gap-2 m-2">
        <div className="flex justify-start items-center gap-2 mt-2">
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            id="number"
            type="number"
            minLength={10}
            maxLength={10}
            placeholder="Enter Number"
            className="border border-gray-200 px-2 py-1.5 rounded-md focus:outline-none focus:border-2 focus:border-black/50"
          />
          <button
            onClick={otpStatus ? handleResendOTP : handleGetOTP}
            // disabled={number.length < 10 || loading || countdown > 0}
            className="bg-green-50 hover:bg-green-100 border border-green-200 text-black font-semibold py-1.5 px-2 rounded"
          >
            {otpStatus && !loading ? "Resend" : "Get OTP"}
          </button>
        </div>
        {countdown > 0 && (
          <p>
            Resend OTP in {Math.floor(countdown / 60)}:
            {countdown % 60 < 10 ? `0${countdown % 60}` : countdown % 60}{" "}
            seconds
          </p>
        )}
        <div className="flex justify-start items-center">
          {otpStatus && (
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              required
              id="otp"
              placeholder="Enter OTP"
              minLength={6}
              maxLength={6}
              className="border border-gray-200 px-2 py-1.5 rounded-md focus:outline-none focus:border-2 focus:border-black/50"
            />
          )}
        </div>
        {otpStatus && (
          <button
            onClick={handleLogin}
            // disabled={otp.length < 6}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-black font-semibold p-1 rounded"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

export default Login;
