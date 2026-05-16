import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import OtpInput from "./OtpInput";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import KIKSTART from "../../../assets/KIKSTART.png";
import FormHeadings from "../../../../../frontEnd/src/Components/FormHeadings/FormHeadings";
import { Container } from "@mui/material";
import { verifySignUpOtp, verifyForgotOtp, resendOTP, sendOtp } from "../../../Apis/AuthApis/authApis";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../Context/AuthContext";

const OTPWrapper = styled(Box)({
  boxSizing: "border-box",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FFF8F8",

  "& .OTPCard": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "20px",
    padding: "48px 56px",
    boxShadow: "0px 4px 32px rgba(0,0,0,0.10)",
    minWidth: "420px",
  },

  "& .imageBox": {
    maxWidth: "204px",
    maxHeight: "89px",
    marginBottom: "45px",
  },

  "& .Headings": {
    display: "flex",
    flexDirection: "column",
    marginBottom: "30px",
  },

  "& .phoneText": {
    fontFamily: "Noto Sans",
    fontWeight: 400,
    fontSize: 15,
    color: "#494949",
    textAlign: "center",
    marginBottom: "32px",
    "& span": {
      fontWeight: 700,
      color: "#ED1C24",
    },
  },

  "& .resendText": {
    fontFamily: "Noto Sans",
    fontWeight: 400,
    fontSize: 15,
    color: "#494949",
    textAlign: "center",
    margin: "20px 0 28px",
    "& span": {
      fontWeight: 700,
      color: "#ED1C24",
      cursor: "pointer",
      textDecoration: "underline",
    },
    "& span.disabled": {
      color: "#9e9e9e",
      cursor: "not-allowed",
      textDecoration: "none",
    },
  },
  "& .countdownBox": {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    alignItems: "center",
  },
  "& .timerRow": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  "& .timerLabel": {
    fontFamily: "Noto Sans",
    fontSize: "14px",
    color: "#666",
  },
  "& .timerBadge": {
    fontFamily: "Noto Sans",
    fontWeight: 700,
    color: "#fff",
    background: "#ED1C24",
    padding: "4px 10px",
    borderRadius: "999px",
    minWidth: "72px",
    textAlign: "center",
    letterSpacing: "0.02em",
  },
  "& .contentBox": {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "25px",
  },
});

const OTP_EXPIRY_SECONDS = 3 * 60;
const RESEND_COOLDOWN_SECONDS = 30;

const getOtpExpiryKey = (contact, purpose) => `otp_expiry_until_${purpose}_${contact}`;
const getResendKey = (contact, purpose) => `otp_resend_until_${purpose}_${contact}`;
const getPurpose = (state) => (state?.purpose === "forgot" ? "forgot" : "signup");
const formatSeconds = (value) => {
  const safeValue = Math.max(0, value);
  const min = Math.floor(safeValue / 60)
    .toString()
    .padStart(2, "0");
  const sec = (safeValue % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
};

const OTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  // Initialize state directly from location state (best practice)
  const state = location.state;
  const purpose = getPurpose(state);
  const initialContactInfo = state?.email || state?.phoneNumber || "";
  const initialContactType = state?.email
    ? "email"
    : state?.phoneNumber
      ? "phone"
      : "email";
  const initialShowOtpInput = !!state?.email || !!state?.phoneNumber;

  const [showOtpInput] = useState(initialShowOtpInput);
  const [contactInfo] = useState(initialContactInfo);
  const [contactType] = useState(initialContactType);
  const [otpRemainingSeconds, setOtpRemainingSeconds] = useState(0);
  const [resendRemainingSeconds, setResendRemainingSeconds] = useState(0);
  const canResend = resendRemainingSeconds <= 0;

  // Handle case where no state exists
  useEffect(() => {
    if (!state?.email && !state?.phoneNumber) {
      const fallbackRoute = purpose === "forgot" ? "/forgot-password" : "/signUp";
      navigate(fallbackRoute);
      toast.error("No contact information found.");
    }
  }, [state, navigate, purpose]);

  useEffect(() => {
    if (!contactInfo) return;

    const now = Date.now();
    const otpExpiryKey = getOtpExpiryKey(contactInfo, purpose);
    const resendKey = getResendKey(contactInfo, purpose);

    let otpExpiryUntil = Number(sessionStorage.getItem(otpExpiryKey));
    if (!otpExpiryUntil) {
      otpExpiryUntil = now + OTP_EXPIRY_SECONDS * 1000;
      sessionStorage.setItem(otpExpiryKey, String(otpExpiryUntil));
    }

    let resendUntil = Number(sessionStorage.getItem(resendKey));
    if (!resendUntil) {
      resendUntil = now + RESEND_COOLDOWN_SECONDS * 1000;
      sessionStorage.setItem(resendKey, String(resendUntil));
    }

    const tick = () => {
      const current = Date.now();
      const latestOtpExpiryUntil = Number(sessionStorage.getItem(otpExpiryKey)) || 0;
      const latestResendUntil = Number(sessionStorage.getItem(resendKey)) || 0;
      const otpLeft = Math.max(
        0,
        Math.ceil((latestOtpExpiryUntil - current) / 1000),
      );
      const resendLeft = Math.max(
        0,
        Math.ceil((latestResendUntil - current) / 1000),
      );
      setOtpRemainingSeconds(otpLeft);
      setResendRemainingSeconds(resendLeft);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [contactInfo, purpose]);

  const setResendCooldown = (seconds) => {
    if (!contactInfo) return;
    const resendUntil = Date.now() + seconds * 1000;
    sessionStorage.setItem(getResendKey(contactInfo, purpose), String(resendUntil));
    setResendRemainingSeconds(seconds);
  };

  const resetOtpExpiry = () => {
    if (!contactInfo) return;
    const otpExpiryUntil = Date.now() + OTP_EXPIRY_SECONDS * 1000;
    sessionStorage.setItem(getOtpExpiryKey(contactInfo, purpose), String(otpExpiryUntil));
    setOtpRemainingSeconds(OTP_EXPIRY_SECONDS);
  };

  const parseWaitSeconds = (message) => {
    const match = message?.match(/(\d+)\s*seconds?/i);
    if (!match) return null;
    const seconds = Number(match[1]);
    return Number.isFinite(seconds) ? seconds : null;
  };

  const getResendWaitingText = () => {
    if (canResend) return "";
    if (resendRemainingSeconds > 0) {
      return `Please wait ${resendRemainingSeconds}s for resend OTP`;
    }
    return "Please wait before resending OTP";
  };

  const verifyOtpMutation = useMutation({
    mutationFn: purpose === "forgot" ? verifyForgotOtp : verifySignUpOtp,
  });
  const handleOtpSubmit = async (otp) => {
    const verifyPromise = verifyOtpMutation.mutateAsync({
      email: contactInfo,
      otp: otp,
    });

    toast.promise(verifyPromise, {
      pending: "Verifying OTP...",
      success: "OTP verified successfully!",
      error: {
        render({ data }) {
          return data?.response?.data?.message || "OTP verification failed";
        },
      },
    });

    try {
      await verifyPromise;
      if (purpose === "forgot") {
        navigate("/reset-password", { state: { email: contactInfo } });
      } else {
        await refreshAuth();
        navigate("/login", { state: { email: contactInfo } });
      }
    } catch (_) {
      // handled by toast.promise
    }
  };

  const resendOtpMutation = useMutation({
    mutationFn: purpose === "forgot" ? sendOtp : resendOTP,
  });
  // Dynamic heading based on contact type
  const getHeadingText = () => {
    if (purpose === "forgot") {
      return `Enter the OTP sent to ${contactInfo} to reset your password.`;
    }
    if (contactType === "email") {
      return `We've sent a verification code to your email: ${contactInfo}`;
    } else {
      return `We've sent a verification code to your phone: ${contactInfo}`;
    }
  };

  // Resend OTP handler (with countdown check)
  const handleResendOtp = async () => {
    if (canResend) {
      const resendPromise = resendOtpMutation.mutateAsync({
        email: contactInfo,
      });

      toast.promise(resendPromise, {
        pending: "Sending OTP...",
        success: "OTP resent successfully!",
        error: {
          render({ data }) {
            return data?.response?.data?.message || "Failed to resend OTP";
          },
        },
      });

      try {
        await resendPromise;
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        resetOtpExpiry();
      } catch (error) {
        const message = error?.response?.data?.message || "";
        const waitSeconds = parseWaitSeconds(message);
        if (waitSeconds !== null) {
          setResendCooldown(waitSeconds);
          toast.warning(`Please wait ${waitSeconds}s for resend OTP`);
        }
      }
    } else {
      toast.error(getResendWaitingText());
    }
  };

  return (
    <Container maxWidth="xl" disableGutters>
      <OTPWrapper>
        <Box className="OTPCard">
          <Box component={Link} to="/" className="imageBox">
            <Box
              component="img"
              src={KIKSTART}
              alt="KikStart"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
          <Box className="contentBox">
            <FormHeadings
              heading="Verify Your Account"
              subHeading={getHeadingText()}
              align="center"
            />

            {showOtpInput && (
              <>
                <OtpInput length={6} onOtpSubmit={handleOtpSubmit} />
                <Box className="countdownBox">
                  <Box className="timerRow">
                    <Typography className="timerLabel">OTP expires in</Typography>
                    <Typography className="timerBadge">
                      {formatSeconds(otpRemainingSeconds)}
                    </Typography>
                  </Box>
                  {!canResend && (
                    <Typography className="timerLabel">
                      Please wait {resendRemainingSeconds}s for resend OTP
                    </Typography>
                  )}
                </Box>
                <Typography className="resendText">
                  Didn't receive the code?{" "}
                  <span
                    onClick={handleResendOtp}
                    className={canResend ? "" : "disabled"}
                  >
                    Resend OTP
                  </span>
                </Typography>
              </>
            )}
          </Box>
        </Box>
      </OTPWrapper>
    </Container>
  );
};

export default OTP;
