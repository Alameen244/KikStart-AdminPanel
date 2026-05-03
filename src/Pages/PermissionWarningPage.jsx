import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function PermissionWarningPage({
  title = "Permission Required",
  message = "You do not have permission to view the data on this page.",
}) {
  return (
    <PageWrapper>
      <WarningCard elevation={0}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "dark.main", mb: 1.5 }}>
          {title}
        </Typography>
        <Typography sx={{ color: "semiDark.main", lineHeight: 1.7 }}>
          {message}
        </Typography>
      </WarningCard>
    </PageWrapper>
  );
}

const PageWrapper = styled(Box)({
  maxWidth: "1200px",
  margin: "0 auto",
  minHeight: "60vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const WarningCard = styled(Paper)(() => ({
  width: "100%",
  maxWidth: 680,
  padding: 32,
  borderRadius: 24,
  border: "1px solid rgba(43, 43, 43, 0.08)",
  background: "linear-gradient(180deg, #ffffff 0%, #fff8f8 100%)",
  boxShadow: "0 20px 40px rgba(43, 43, 43, 0.06)",
}));
