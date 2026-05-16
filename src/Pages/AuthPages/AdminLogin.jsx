import LoginForm from "../../Components/AdminAuth/LoginForm/LoginForm";
import AdminAuthShell from "../../Components/AdminAuth/AdminAuthShell";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function AdminLogin() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const alreadyLoggedIn =
    !isLoading && isAuthenticated && user?.role === "admin";

  if (alreadyLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminAuthShell>
      <LoginForm />
    </AdminAuthShell>
  );
}
