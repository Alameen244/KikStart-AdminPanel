import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./ContentManagement/HomePage";
import FAQsPage from "./ContentManagement/FAQsPage";
import WhyUsPage from "./ContentManagement/WhyUsPage";

const contentPages = [
  { id: "home", title: "Home", path: "home/*", element: <HomePage /> },
  { id: "about", title: "About Us", path: "about" },
  { id: "programs", title: "Programs", path: "programs" },
  { id: "why-us", title: "Why Us", path: "why-us", element: <WhyUsPage /> },
  { id: "contact-us", title: "Contact Us", path: "contact-us" },
  { id: "schools", title: "Interested Schools", path: "schools" },
  {
    id: "become-a-coach",
    title: "Become a Coach",
    path: "become-a-coach",
  },
  { id: "coach-login", title: "Coach's Login", path: "coach-login" },
  { id: "faqs", title: "FAQs", path: "faqs", element: <FAQsPage /> }
];

export default function ContentManagement() {
  return (
    <ContentManagementContainer>
      <Routes>
        <Route index element={<Navigate to="/content/home" replace />} />

        {contentPages.map((page) => (
          <Route
            key={page.id}
            path={page.path}
            element={page.element || <ContentPlaceholder title={page.title} />}
          />
        ))}

        <Route path="*" element={<Navigate to="/content/home" replace />} />
      </Routes>
    </ContentManagementContainer>
  );
}

function ContentPlaceholder({ title }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Page content coming soon...
      </Typography>
    </Paper>
  );
}

const ContentManagementContainer = styled(Box)({
  maxWidth: "1200px",
  margin: "0 auto",
});
