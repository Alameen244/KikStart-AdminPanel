import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import KIKSTART from "../../../assets/KIKSTART.png";
import FormHeadings from "../../../../../frontEnd/src/Components/FormHeadings/FormHeadings";
import OneLineField from "../../../../../frontEnd/src/Components/OneLineField/OneLineField";
import PaswordField from "../../../../../frontEnd/src/Components/PasswordField/PaswordField";
import RedButton from "../../../../../frontEnd/src/Components/RedButton/RedButton";
import { forgotPassword } from "../../../../../frontEnd/src/Apis/authApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!email) {
      toast.error("Reset session expired. Please request OTP again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (!/[A-Z]/.test(formData.newPassword)) {
      toast.error("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[a-z]/.test(formData.newPassword)) {
      toast.error("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[0-9]/.test(formData.newPassword)) {
      toast.error("Password must contain at least one number");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const resetPromise = forgotPasswordMutation.mutateAsync({
      email,
      newPassword: formData.newPassword,
    });

    toast.promise(resetPromise, {
      pending: "Updating password...",
      success: {
        render({ data }) {
          return data?.message || "Password reset successful";
        },
      },
      error: {
        render({ data }) {
          return data?.response?.data?.message || "Password reset failed";
        },
      },
    });

    try {
      await resetPromise;
      navigate("/login");
    } catch (_) {
      // backend error message is already shown via toast.promise
    }
  };

  return (
    <Box className="LoginForm">
      <Box className="imageBox" component={Link} to="/">
        <Box component="img" src={KIKSTART} />
      </Box>
      <Box className="Headings">
        <FormHeadings
          heading="Reset Password"
          subHeading={`Set a new password for ${email || "your account"}`}
          align="center"
        />
      </Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ marginBottom: "16px" }}>
          <PaswordField
            label="New Password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </Box>
        <Box sx={{ marginBottom: "30px" }}>
          <OneLineField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </Box>
        <RedButton
          text={forgotPasswordMutation.isPending ? "UPDATING..." : "UPDATE"}
          color="secondary"
          py="18px"
          px="53px"
          type="submit"
          disabled={forgotPasswordMutation.isPending}
        />
      </form>
    </Box>
  );
};

export default ResetPasswordForm;
