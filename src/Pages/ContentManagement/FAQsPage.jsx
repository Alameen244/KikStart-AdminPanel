import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import FAQsSection from "../../Components/FAQs/Sections/FAQsSection";

export default function FAQsPage() {
  return (
    <PageWrapper>
      <Header>
        <TitleRow>
          <IconBadge>
            <QuizRoundedIcon />
          </IconBadge>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "dark.main" }}>
              FAQs Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Manage the full FAQs page and control which active FAQs appear on home
              through the section home limit.
            </Typography>
          </Box>
        </TitleRow>
      </Header>

      <FAQsSection />
    </PageWrapper>
  );
}

const PageWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

const Header = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const TitleRow = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "14px",
});

const IconBadge = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: 16,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(237, 28, 36, 0.1)",
  color: theme.palette.myRed,
}));
