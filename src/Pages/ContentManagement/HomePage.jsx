import React from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import BannerSection from "../../Components/Home/Sections/BannerSection";
import WhoSection from "../../Components/Home/Sections/WhoSection";
import HomeWhyUsSection from "../../Components/Home/Sections/HomeWhyUsSection";
import ProgramsSection from "../../Components/Home/Sections/ProgramsSection";
import TestimonialSection from "../../Components/Home/Sections/TestimonialSection";
import HomeFAQsSection from "../../Components/Home/Sections/HomeFAQsSection";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sections = [
    { id: "banner", label: "Banner", path: "banner", element: <BannerSection /> },
    { id: "who", label: "Who Section", path: "who", element: <WhoSection /> },
    { id: "why-us", label: "Why Us", path: "why-us", element: <HomeWhyUsSection /> },
    { id: "programs", label: "Programs", path: "programs", element: <ProgramsSection /> },
    { id: "testimonial", label: "testimonial", path: "testimonial", element: <TestimonialSection /> },
    { id: "faqs", label: "FAQs", path: "faqs", element: <HomeFAQsSection /> },
  ];

  const currentSection = location.pathname.split("/").filter(Boolean).pop();
  const selectedSection = sections.some((section) => section.id === currentSection)
    ? currentSection
    : "banner";

  return (
    <HomePageContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, color: "dark.main" }}>
          Home Page Management
        </Typography>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Select Section</InputLabel>
          <Select
            value={selectedSection}
            label="Select Section"
            onChange={(e) => navigate(`/content/home/${e.target.value}`)}
          >  
            {sections.map((section) => (
              <MenuItem key={section.id} value={section.path}>
                {section.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Routes>
        <Route index element={<Navigate to="/content/home/banner" replace />} />
        {sections.map((section) => (
          <Route key={section.id} path={section.path} element={section.element} />
        ))}
        <Route path="*" element={<Navigate to="/content/home/banner" replace />} />
      </Routes>
    </HomePageContainer>
  );
};

const HomePageContainer = styled(Box)({
  maxWidth: "1200px",
  margin: "0 auto",
});

export default HomePage;
