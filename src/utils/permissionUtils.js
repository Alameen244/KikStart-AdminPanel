export const hasModulePermission = (user, moduleName, action = "read") => {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (user.role !== "subAdmin") return false;

  const permissions = Array.isArray(user.permissionRole?.permissions)
    ? user.permissionRole.permissions
    : [];

  const matchedPermission = permissions.find(
    (item) => item?.module === moduleName,
  );

  return Boolean(matchedPermission?.actions?.[action]);
};
