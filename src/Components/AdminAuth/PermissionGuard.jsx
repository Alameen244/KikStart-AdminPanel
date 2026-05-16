import React from "react";
import { useAuth } from "../../Context/AuthContext";
import PermissionWarningPage from "../../Pages/PermissionWarningPage";
import { hasModulePermission } from "../../utils/permissionUtils";

export default function PermissionGuard({
  moduleName,
  action = "read",
  adminOnly = false,
  children,
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (adminOnly) {
    if (user?.role === "admin") {
      return children;
    }

    return (
      <PermissionWarningPage
        title="Admin Access Only"
        message="This page is currently available only for admin accounts."
      />
    );
  }

  if (hasModulePermission(user, moduleName, action)) {
    return children;
  }

  return (
    <PermissionWarningPage
      title="Access Restricted"
      message={`You do not have permission to ${action} the data for the ${moduleName} page.`}
    />
  );
}
