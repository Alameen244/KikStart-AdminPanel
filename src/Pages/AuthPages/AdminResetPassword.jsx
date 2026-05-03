import ResetPasswordForm from "../../Components/AdminAuth/ResetPasswordForm/ResetPasswordForm";
import AdminAuthShell from "../../Components/AdminAuth/AdminAuthShell";

export default function AdminResetPassword() {
  return (
    <AdminAuthShell>
      <ResetPasswordForm />
    </AdminAuthShell>
  );
}
