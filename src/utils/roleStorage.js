import { seedRoles } from "../data/permissionRoles";

const ROLES_STORAGE_KEY = "kikstart_admin_roles";
const ASSIGNMENTS_STORAGE_KEY = "kikstart_role_assignments";

export const loadStoredRoles = () => {
  try {
    const stored = localStorage.getItem(ROLES_STORAGE_KEY);
    if (!stored) return seedRoles;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedRoles;
  } catch (_) {
    return seedRoles;
  }
};

export const saveStoredRoles = (roles) => {
  localStorage.setItem(ROLES_STORAGE_KEY, JSON.stringify(roles));
};

export const loadRoleAssignments = () => {
  try {
    const stored = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
};

export const saveRoleAssignments = (assignments) => {
  localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(assignments));
};
