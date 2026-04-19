import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export default function ProgramsSection() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Program Section
      </Typography>

      <InfoCard elevation={0}>
        <AccentGlow />
        <IconWrap>
          <SchoolRoundedIcon fontSize="medium" />
        </IconWrap>

        <ContentBlock>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "dark.main" }}>
            This section is managed by the Programs page
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "700px", lineHeight: 1.7 }}
          >
            Manage program section heading, subheading, home limit, individual
            program cards, ordering, status, and multiple images from the
            dedicated Programs page.
          </Typography>
        </ContentBlock>

        <ButtonRow>
          <GoButton
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => navigate("/content/programs")}
          >
            Go To Programs Page
          </GoButton>
        </ButtonRow>
      </InfoCard>
    </PageWrapper>
  );
}

const PageWrapper = styled(Box)({
  width: "100%",
});

const InfoCard = styled(Paper)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  padding: "32px",
  minHeight: "260px",
  borderRadius: 24,
  border: "1px solid rgba(237, 28, 36, 0.12)",
  background:
    "linear-gradient(135deg, rgba(255,248,248,1) 0%, rgba(255,255,255,1) 55%, rgba(255,244,228,0.9) 100%)",
  boxShadow: theme.shadows[2],
  display: "flex",
  flexDirection: "column",
  gap: "22px",
  justifyContent: "center",
}));

const AccentGlow = styled(Box)({
  position: "absolute",
  top: "-90px",
  right: "-40px",
  width: "220px",
  height: "220px",
  borderRadius: "50%",
  background:
    "radial-gradient(circle, rgba(237,28,36,0.12) 0%, rgba(237,28,36,0) 72%)",
});

const IconWrap = styled(Box)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(237, 28, 36, 0.08)",
  color: theme.palette.myRed,
}));

const ContentBlock = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

const ButtonRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  paddingTop: "6px",
});

const GoButton = styled(Button)(({ theme }) => ({
  minWidth: "230px",
  height: "44px",
  borderRadius: 14,
  textTransform: "none",
  fontWeight: 700,
  backgroundColor: theme.palette.myRed,
  color: theme.palette.common.white,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
    boxShadow: "none",
  },
}));
