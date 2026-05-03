import ForgotPasswordForm from "../../../../frontEnd/src/Components/Auth/ForgotPasswordForm/ForgotPasswordForm";
import AdminAuthShell from "../../Components/AdminAuth/AdminAuthShell";

export default function AdminForgotPassword() {
  return (
    <AdminAuthShell>
      <ForgotPasswordForm />
    </AdminAuthShell>
  );
}
