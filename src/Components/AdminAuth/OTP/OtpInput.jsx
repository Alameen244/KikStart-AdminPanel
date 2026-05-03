import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

const OtpBox = styled("input")(({ theme }) => ({
  width: "64px",
  height: "64px",
  textAlign: "center",
  fontSize: "24px",
  fontFamily: "Noto Sans",
  fontWeight: 700,
  border: `2px solid #E0E0E0`,
  borderRadius: "12px",
  outline: "none",
  color: theme.palette.palette?.dark || "#2B2B2B",
  transition: "border-color 200ms ease",
  "&:focus": {
    borderColor: theme.palette.secondary.main,
  },
  "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
    appearance: "none",
  },
}));

const OtpInput = ({ length = 4, onOtpSubmit }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  // auto-focus first empty box on mount
  useEffect(() => {
    const firstEmpty = otp.indexOf("");
    const target = firstEmpty !== -1 ? firstEmpty : 0;
    inputRefs.current[target]?.focus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // allow only last entered digit
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // move to next EMPTY input if digit entered
    if (newOtp[index]) {
      const nextEmpty = newOtp.findIndex((v, i) => i > index && v === "");
      if (nextEmpty !== -1) {
        inputRefs.current[nextEmpty].focus();
      }
    }

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);
  };

  const handleClick = (index) => {
    // place cursor at end
    const input = inputRefs.current[index];
    const len = input.value.length;
    input.setSelectionRange(len, len);

    // jump to first empty if clicking ahead
    if (index > 0 && !otp[index - 1]) {
      const firstEmpty = otp.indexOf("");
      inputRefs.current[firstEmpty].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index]) {
        // clear current box regardless of cursor position
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // move to previous and clear it
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    for (let i = 0; i < length; i++) {
      newOtp[i] = pastedData[i] || "";
    }
    setOtp(newOtp);

    // focus last filled or last box
    const lastIndex = Math.min(pastedData.length - 1, length - 1);
    inputRefs.current[lastIndex].focus();

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);
  };

  return (
    <Box sx={{ display: "flex", gap: "16px", justifyContent: "center" }}>
      {otp.map((value, index) => (
        <OtpBox
          key={index}
          type="text"
          inputMode="numeric"
          value={value}
          ref={(input) => (inputRefs.current[index] = input)}
          onChange={(e) => handleChange(index, e)}
          onClick={() => handleClick(index)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
        />
      ))}
    </Box>
  );
};

export default OtpInput;
