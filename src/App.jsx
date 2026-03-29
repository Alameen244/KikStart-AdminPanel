import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { theme } from "./theme";
import DashboardSection from "./Components/DashboardSection/DashboardSection";
import Dashboard from "./Pages/Dashboard";
import UserManagement from "./Pages/UserManagement";
import ContentManagement from "./Pages/ContentManagement";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        style={{ zIndex: 2000 }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<DashboardSection />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="content/*" element={<ContentManagement />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
