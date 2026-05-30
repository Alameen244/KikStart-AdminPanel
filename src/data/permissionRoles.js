export const baseModules = [
  "Dashboard",
  "User Management",
  "CMS Management",
  "Subscriptions",
  "Home Content",
  "About Us",
  "Programs",
  "Why Us",
  "Contact Us",
  "Interested Schools",
  "Become a Coach",
  "Coach's Login",
  "FAQs",
  "Permission Management",
  "Role Management",
];

export const createEmptyPermissions = () =>
  baseModules.map((module) => ({
    module,
    actions: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
  }));



export const countPermissions = (permissions = []) =>
  permissions.reduce(
    (count, moduleItem) =>
      count + Object.values(moduleItem.actions || {}).filter(Boolean).length,
    0,
  );

export const uniqueRoleNames = (roles = []) =>
  [...new Set(roles.map((role) => role.roleName).filter(Boolean))];
