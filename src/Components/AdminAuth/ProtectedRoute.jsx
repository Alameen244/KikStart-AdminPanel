import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const ProtectedRoute = ({ children, requireVerified = true }) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireVerified && !user?.isVerified) {
    return <Navigate to="/otp" replace state={{ email: user?.email }} />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
