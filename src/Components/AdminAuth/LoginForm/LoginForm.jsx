import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import KIKSTART from "../../../assets/KIKSTART.png";
import FormHeadings from "../../../../../frontEnd/src/Components/FormHeadings/FormHeadings";
import OneLineField from "../../../../../frontEnd/src/Components/OneLineField/OneLineField";
import PaswordField from "../../../../../frontEnd/src/Components/PasswordField/PaswordField";
import { Typography } from "@mui/material";
import RedButton from "../../../../../frontEnd/src/Components/RedButton/RedButton";
import { useMutation } from "@tanstack/react-query";
import { login, sendOtp } from "../../../Apis/AuthApis/authApis";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate , useLocation } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";


const LoginForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState(() => {
    // Restore from sessionStorage on mount
    const saved = sessionStorage.getItem("loginFormData");
    return saved
      ? JSON.parse(saved)
      : {
        email: location.state?.email || "",
        password: "",
      };
  });

  // Save to sessionStorage whenever formData changes
  useEffect(() => {
    sessionStorage.setItem("loginFormData", JSON.stringify(formData));
  }, [formData]);
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  const loginMutation = useMutation({
    mutationFn: login,
  });

  const verifyEmail = () => {
    return (
      <div>
        <p style={{
          color: "#5f0909",
          fontWeight:500,
          fontFamily: "Noto Sans",
          marginBottom: "6px"
        }}>please verify your email first</p>
        <RedButton text="Get Otp for verification" px="18px" py="12px" color="secondary" fontSize="13px" onClick={handleClick} fontWeight="600"/>
      </div>
    )
  }
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    // Client-side validation
    if ((!formData.email) || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    const loginPromise = loginMutation.mutateAsync(formData).then(async (res) => {
      Cookies.set("adminToken", res?.token, { expires: 7 });
      localStorage.setItem("loginName", res?.data?.name || res?.name || "");
      await refreshAuth();
      setFormData({ email: "", password: "" });
      sessionStorage.removeItem("loginFormData");
      navigate("/");
      return res;
    });
    toast.promise(loginPromise, {
      pending: "Logging in...",
      success: {
        render({ data }) {
          return data?.message || "Login successful!";
        },
      },
      error: {
        render({ data }) {
          if (data?.response?.data?.message.toLowerCase() === "please verify your email first") {
            return verifyEmail();
          }
          return data?.response?.data?.message || "Login failed. Please try again.";
        },
        icon: ({ data }) => {
      if (
        data?.response?.data?.message?.toLowerCase() ===
        "please verify your email first"
      ) {
        return false;
      }

      return true;
        },
      },
    });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
 const otpMutation = useMutation({
    mutationFn: sendOtp,
  });
  const handleClick = () => {
    const otpPromise = otpMutation.mutateAsync({ email: formData.email }).then((res) => {
      navigate("/otp", { state: { email: formData.email } })
      return res;
    })
    toast.promise(otpPromise, {
      pending: "Sending OTP...",
      success: {
        render({ data }) {
          return data?.message || "OTP sent successfully!";
        },
      },
      error: {
        render({ data }) {
          return data?.response?.data?.message || "Failed to send OTP. Please try again.";
        },
      },
    });

  };
  return (
    <Box className="LoginForm">
      <Box className="imageBox" component={Link} to="/">
        <Box component="img" src={KIKSTART} />
      </Box>
      <Box className="Headings">
        <FormHeadings
          heading="Login"
          subHeading="Please fill this form to login your account"
          align="center"
        />
      </Box>
      <form onSubmit={handleLoginSubmit}>
        <Box sx={{ marginBottom: "16px" }}>
          <OneLineField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleLoginChange}
            required
          />
        </Box>
        <Box>
          <PaswordField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleLoginChange}
          />
        </Box>
        <Typography className="forgotText" onClick={() => navigate("/forgot-password", { state: { email: formData.email } })} sx={{
          "&:hover": {
            cursor:"pointer",
          },
        }}>Forgot password?</Typography>
        <RedButton
          text={loginMutation.isPending ? "Logging in..." : "LOGIN"}
          color="secondary"
          py="18px"
          px="53px"
          type="submit"
          disabled={loginMutation.isPending}
        />
      </form>
    </Box>
  );
};

export default LoginForm;
