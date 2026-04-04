import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import WhyUsSection from "../../Components/WhyUs/Sections/WhyUsSection";

export default function WhyUsPage() {
  return (
    <PageWrapper>
      <Header>
        <TitleRow>
          <IconBadge>
            <HelpOutlineRoundedIcon />
          </IconBadge>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "dark.main" }}>
              Why Us Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              Manage the full Why Us section, card ordering, status, and how many
              active cards appear on home through the section home limit.
            </Typography>
          </Box>
        </TitleRow>
      </Header>

      <WhyUsSection />
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
