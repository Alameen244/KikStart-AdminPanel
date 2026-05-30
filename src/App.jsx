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
import AdminLogin from "./Pages/AuthPages/AdminLogin";
import AdminForgotPassword from "./Pages/AuthPages/AdminForgotPassword";
import AdminResetPassword from "./Pages/AuthPages/AdminResetPassword";
import AdminOtp from "./Pages/AuthPages/AdminOtp";
import ProtectedRoute from "./Components/AdminAuth/ProtectedRoute";
import PermissionGuard from "./Components/AdminAuth/PermissionGuard";
import PermissionPage from "./Pages/PermissionPage";
import RoleManagement from "./Pages/RoleManagement";
import NotFoundPage from "../../frontEnd/src/Pages/404notFound";
import Subscription from "./Pages/Subscription";

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
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/reset-password" element={<AdminResetPassword />} />
          <Route path="/otp" element={<AdminOtp />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardSection />}>
              <Route
                index
                element={
                  <PermissionGuard moduleName="Dashboard">
                    <Dashboard />
                  </PermissionGuard>
                }
              />
              <Route
                path="users"
                element={
                  <PermissionGuard moduleName="User Management">
                    <UserManagement />
                  </PermissionGuard>
                }
              />
              <Route
                path="subscriptions"
                element={
                  <PermissionGuard moduleName="Subscriptions" adminOnly>
                    <Subscription />
                  </PermissionGuard>
                }
              />
              <Route
                path="role-management"
                element={
                  <PermissionGuard moduleName="Role Management" adminOnly>
                    <RoleManagement />
                  </PermissionGuard>
                }
              />
              <Route path="content/*" element={<ContentManagement />} />
              <Route
                path="permissions"
                element={
                  <PermissionGuard moduleName="Permission Management" adminOnly>
                    <PermissionPage />
                  </PermissionGuard>
                }
              />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
