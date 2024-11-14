import { useState, useEffect } from "react";
import axios from "axios";
import { UAParser } from "ua-parser-js";
import { Loader2, Send, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { API_URL } from "@/url";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [IP, setIP] = useState("");
  const [OS, setOS] = useState("");
  const [otpStatus, setOtpStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  useEffect(() => {
    const parser = new UAParser();
    const getDeviceData = async () => {
      try {
        const ip = await axios.get("https://ipapi.co/json");
        setIP(ip.data.ip);
        setOS(`${parser.getOS().name} ${parser.getOS().version}`);
      } catch (error) {
        console.error(error);
      }
    };
    getDeviceData();

    if (typeof window !== "undefined" && localStorage.getItem("authToken")) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGetOTP = async () => {
    if (number.length !== 10 || !/^[6789]/.test(number)) {
      toast.error("Please enter a valid mobile number");
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
        setOtpStatus(true);
        setCountdown(90);
        toast.success("OTP Sent Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
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
      setLoading(true);
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

      if (response.status === 200) {
        toast.success("Login Successful");
        localStorage.setItem("authToken", JSON.stringify(response.data));
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) {
      toast.error(`Please wait for ${countdown} seconds to resend OTP`);
      return;
    }
    try {
      setLoading(true);
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
        setCountdown(150);
        toast.success("OTP Resent Successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your mobile number to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="w-16">
                <Input value="+91" disabled className="text-center" />
              </div>
              <Input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Mobile Number"
                type="tel"
                maxLength={10}
              />
            </div>
            {otpStatus && (
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                type="text"
                maxLength={6}
              />
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button
            onClick={otpStatus ? handleLogin : handleGetOTP}
            disabled={
              loading || (otpStatus ? otp.length < 6 : number.length < 10)
            }
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : otpStatus ? (
              <>
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Get OTP <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          {otpStatus && (
            <Button
              variant="outline"
              onClick={handleResendOTP}
              disabled={loading || countdown > 0}
              className="w-full"
            >
              {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
