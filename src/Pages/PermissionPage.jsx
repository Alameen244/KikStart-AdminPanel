import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add,
  ArrowForward,
  Check,
  Close,
  DeleteOutline,
  EditOutlined,
  Visibility,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PermissionMatrixTable, {
  HeaderActionButton,
} from "../Components/Permissions/PermissionMatrixTable";
import { createEmptyPermissions } from "../data/permissionRoles";
import {
  createRole,
  deleteRole,
  getRoles,
  updateRole,
} from "../Apis/RolePermissionApis/rolePermissionApi";
import {
  assignPermissionRoleToSubAdmin,
  getSubAdmins,
} from "../Apis/AuthApis/authApis";
import { toast } from "react-toastify";

const ASSIGNED_ROLES_PER_PAGE = 4;
const ROLE_NAMES_PER_PAGE = 5;
const EXCLUDED_PERMISSION_MODULES = new Set(["CMS", "CMS Management"]);

const titleize = (value = "") =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());

const filterVisiblePermissions = (permissions = []) =>
  permissions.filter(
    (item) => item?.module && !EXCLUDED_PERMISSION_MODULES.has(item.module),
  );

const countPermissions = (permissions = []) =>
  filterVisiblePermissions(permissions).reduce(
    (count, item) =>
      count + Object.values(item.actions || {}).filter(Boolean).length,
    0,
  );

export default function PermissionPage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState(
    location.state?.tab === "create" ? "create" : "roles",
  );
  const [selectedAssignedPage, setSelectedAssignedPage] = useState(1);
  const [selectedRoleNamesPage, setSelectedRoleNamesPage] = useState(1);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [formState, setFormState] = useState({
    roleName: "",
    name: "",
    email: "",
    permissions: createEmptyPermissions(),
  });
  const [editState, setEditState] = useState({
    roleId: null,
    roleName: "",
    permissions: [],
  });
  const [isEditingSelectedRole, setIsEditingSelectedRole] = useState(false);

  const rolesQuery = useQuery({
    queryKey: ["permission-roles"],
    queryFn: getRoles,
  });

  const subAdminsQuery = useQuery({
    queryKey: ["subadmins"],
    queryFn: getSubAdmins,
  });

  useEffect(() => {
    if (location.state?.tab === "create") {
      setActiveView("create");
    }
  }, [location.state]);

  const roles = Array.isArray(rolesQuery.data?.data) ? rolesQuery.data.data : [];
  const subAdmins = Array.isArray(subAdminsQuery.data?.data)
    ? subAdminsQuery.data.data
    : [];
  const assignedRoles = subAdmins.filter((user) => user?.permissionRole?._id);

  useEffect(() => {
    if (!selectedAssignmentId && assignedRoles[0]?._id) {
      setSelectedAssignmentId(assignedRoles[0]._id);
    }
  }, [assignedRoles, selectedAssignmentId]);

  const selectedAssignment =
    assignedRoles.find((item) => item._id === selectedAssignmentId) ||
    assignedRoles[0] ||
    null;
  const selectedRole = selectedAssignment?.permissionRole || null;

  const paginatedAssignedRoles = assignedRoles.slice(
    (selectedAssignedPage - 1) * ASSIGNED_ROLES_PER_PAGE,
    selectedAssignedPage * ASSIGNED_ROLES_PER_PAGE,
  );
  const assignedRolesPageCount = Math.max(
    1,
    Math.ceil(assignedRoles.length / ASSIGNED_ROLES_PER_PAGE),
  );

  const paginatedRoleNames = roles.slice(
    (selectedRoleNamesPage - 1) * ROLE_NAMES_PER_PAGE,
    selectedRoleNamesPage * ROLE_NAMES_PER_PAGE,
  );
  const roleNamesPageCount = Math.max(
    1,
    Math.ceil(roles.length / ROLE_NAMES_PER_PAGE),
  );

  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: async (response) => {
      const createdRole = response?.data;
      let assignedMessage = "";

      if (createdRole?._id && formState.email.trim()) {
        const matchingSubAdmin = subAdmins.find(
          (user) =>
            user?.email?.toLowerCase() === formState.email.trim().toLowerCase(),
        );

        if (matchingSubAdmin?._id) {
          try {
            await assignPermissionRoleToSubAdmin({
              userId: matchingSubAdmin._id,
              permissionRoleId: createdRole._id,
            });
            assignedMessage = " and assigned to subadmin";
          } catch (assignmentError) {
            toast.warning(
              assignmentError?.response?.data?.message ||
                "Role created, but assignment could not be completed.",
            );
          }
        }
      }

      toast.success(`Role created successfully${assignedMessage}.`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["permission-roles"] }),
        queryClient.invalidateQueries({ queryKey: ["subadmins"] }),
      ]);
      setFormState({
        roleName: "",
        name: "",
        email: "",
        permissions: createEmptyPermissions(),
      });
      setActiveView("roles");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create role.");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: async (response) => {
      toast.success(response?.message || "Role updated successfully.");
      setIsEditingSelectedRole(false);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["permission-roles"] }),
        queryClient.invalidateQueries({ queryKey: ["subadmins"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update role.");
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: async (response) => {
      toast.success(response?.message || "Role deleted successfully.");
      setIsEditingSelectedRole(false);
      setEditState({
        roleId: null,
        roleName: "",
        permissions: [],
      });
      setSelectedAssignmentId(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["permission-roles"] }),
        queryClient.invalidateQueries({ queryKey: ["subadmins"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete role.");
    },
  });

  const canCreateRole = formState.roleName.trim().length > 0;
  const canSaveSelectedRole = editState.roleName.trim().length > 0;

  useEffect(() => {
    if (!selectedRole?._id) {
      setIsEditingSelectedRole(false);
      setEditState({
        roleId: null,
        roleName: "",
        permissions: [],
      });
      return;
    }

    setEditState({
      roleId: selectedRole._id,
      roleName: titleize(selectedRole.name || ""),
      permissions: filterVisiblePermissions(selectedRole.permissions || []),
    });
    setIsEditingSelectedRole(false);
  }, [selectedRole?._id, selectedRole?.name, selectedRole?.permissions]);

  const togglePermissionForModules = (permissions, moduleName, action) =>
    permissions.map((moduleItem) =>
      moduleItem.module === moduleName
        ? {
            ...moduleItem,
            actions: {
              ...moduleItem.actions,
              [action]: !moduleItem.actions[action],
            },
          }
        : moduleItem,
    );

  const handleTogglePermission = (moduleName, action) => {
    setFormState((prev) => ({
      ...prev,
      permissions: togglePermissionForModules(prev.permissions, moduleName, action),
    }));
  };

  const handleToggleSelectedRolePermission = (moduleName, action) => {
    setEditState((prev) => ({
      ...prev,
      permissions: togglePermissionForModules(prev.permissions, moduleName, action),
    }));
  };

  const handleAssignRole = () => {
    createRoleMutation.mutate({
      name: formState.roleName.trim(),
      permissions: filterVisiblePermissions(formState.permissions),
    });
  };

  const handleStartEditingSelectedRole = () => {
    if (!selectedRole?._id) return;

    setEditState({
      roleId: selectedRole._id,
      roleName: titleize(selectedRole.name || ""),
      permissions: filterVisiblePermissions(selectedRole.permissions || []),
    });
    setIsEditingSelectedRole(true);
  };

  const handleCancelEditingSelectedRole = () => {
    setEditState({
      roleId: selectedRole?._id || null,
      roleName: titleize(selectedRole?.name || ""),
      permissions: filterVisiblePermissions(selectedRole?.permissions || []),
    });
    setIsEditingSelectedRole(false);
  };

  const handleSaveSelectedRole = () => {
    if (!editState.roleId) return;

    updateRoleMutation.mutate({
      id: editState.roleId,
      payload: {
        name: editState.roleName.trim(),
        permissions: filterVisiblePermissions(editState.permissions),
      },
    });
  };

  const handleDeleteSelectedRole = () => {
    if (!selectedRole?._id) return;

    const confirmed = window.confirm(
      `Delete the "${titleize(selectedRole.name || "")}" role?`,
    );

    if (!confirmed) return;

    deleteRoleMutation.mutate(selectedRole._id);
  };

  const selectedRoleHeaderActions = selectedRole?._id ? (
    <Box sx={{ display: "inline-flex", gap: 1 }}>
      {isEditingSelectedRole ? (
        <>
          <HeaderActionButton
            aria-label="Cancel editing role"
            onClick={handleCancelEditingSelectedRole}
            disabled={updateRoleMutation.isPending}
          >
            <Close fontSize="small" />
          </HeaderActionButton>
          <HeaderActionButton
            aria-label="Save role"
            onClick={handleSaveSelectedRole}
            disabled={!canSaveSelectedRole || updateRoleMutation.isPending}
          >
            <Check fontSize="small" />
          </HeaderActionButton>
        </>
      ) : (
        <>
          <HeaderActionButton
            aria-label="Edit role"
            onClick={handleStartEditingSelectedRole}
          >
            <EditOutlined fontSize="small" />
          </HeaderActionButton>
          <HeaderActionButton
            aria-label="Delete role"
            className="danger"
            onClick={handleDeleteSelectedRole}
            disabled={deleteRoleMutation.isPending}
          >
            <DeleteOutline fontSize="small" />
          </HeaderActionButton>
        </>
      )}
    </Box>
  ) : null;

  return (
    <PageShell>
      <HeaderRow>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "dark.main" }}>
            Permission Management
          </Typography>
          <Typography sx={{ mt: 1, color: "semiDark.main" }}>
            Create custom roles and define access for each admin module.
          </Typography>
        </Box>

        <SwitcherCard elevation={0}>
          <SwitcherButton
            type="button"
            onClick={() => setActiveView("roles")}
            className={activeView === "roles" ? "active" : ""}
          >
            Roles
          </SwitcherButton>
          <SwitcherButton
            type="button"
            onClick={() => setActiveView("create")}
            className={activeView === "create" ? "active" : ""}
          >
            <Add sx={{ fontSize: 18 }} />
            Create Role
          </SwitcherButton>
        </SwitcherCard>
      </HeaderRow>

      {activeView === "roles" ? (
        <>
          {rolesQuery.isError || subAdminsQuery.isError ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {rolesQuery.error?.response?.data?.message ||
                subAdminsQuery.error?.response?.data?.message ||
                "Failed to load permission data."}
            </Alert>
          ) : null}

          <Grid container spacing={3}>
            <Grid item xs={12} xl={8}>
              <SectionCard elevation={0}>
                <CardTitle>Assigned Role</CardTitle>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeaderCell>Role</TableHeaderCell>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Email</TableHeaderCell>
                        <TableHeaderCell>Access</TableHeaderCell>
                        <TableHeaderCell align="center">View</TableHeaderCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedAssignedRoles.length > 0 ? (
                        paginatedAssignedRoles.map((assignment) => (
                          <RoleTableRow
                            key={assignment._id}
                            className={
                              selectedAssignment?._id === assignment._id
                                ? "selected"
                                : ""
                            }
                            onClick={() => setSelectedAssignmentId(assignment._id)}
                          >
                            <BodyCell>
                              {titleize(assignment.permissionRole?.name || "N/A")}
                            </BodyCell>
                            <BodyCell>{assignment.name || "N/A"}</BodyCell>
                            <BodyCell>{assignment.email || "N/A"}</BodyCell>
                            <BodyCell>
                              <Chip
                                label={`${countPermissions(
                                  assignment.permissionRole?.permissions,
                                )} permissions`}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(237, 28, 36, 0.1)",
                                  color: "myRed.main",
                                  fontWeight: 700,
                                }}
                              />
                            </BodyCell>
                            <BodyCell align="center">
                              <IconButton
                                onClick={() => setSelectedAssignmentId(assignment._id)}
                              >
                                <Visibility />
                              </IconButton>
                            </BodyCell>
                          </RoleTableRow>
                        ))
                      ) : (
                        <TableRow>
                          <BodyCell colSpan={5} align="center">
                            No assigned roles found.
                          </BodyCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>

                <PaginationRow>
                  <Pagination
                    count={assignedRolesPageCount}
                    page={selectedAssignedPage}
                    onChange={(_, value) => setSelectedAssignedPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                </PaginationRow>
              </SectionCard>
            </Grid>

            <Grid item xs={12} xl={4}>
              <CompactSectionCard elevation={0}>
                <CardTitle>Existing Role Names</CardTitle>
                <RoleNameList>
                  {paginatedRoleNames.length > 0 ? (
                    paginatedRoleNames.map((role) => (
                      <RoleNameItem key={role._id}>
                        <Typography sx={{ fontWeight: 600, color: "dark.main" }}>
                          {titleize(role.name)}
                        </Typography>
                      </RoleNameItem>
                    ))
                  ) : (
                    <Typography sx={{ color: "semiDark.main" }}>
                      No roles created yet.
                    </Typography>
                  )}
                </RoleNameList>
                <TopPaginationRow>
                  <Pagination
                    count={roleNamesPageCount}
                    page={selectedRoleNamesPage}
                    onChange={(_, value) => setSelectedRoleNamesPage(value)}
                    color="primary"
                    shape="rounded"
                    size="small"
                  />
                </TopPaginationRow>
              </CompactSectionCard>
            </Grid>

            <Grid item xs={12} xl={5}>
              <RoleInfoCard elevation={0}>
                <CardTitle sx={{ mb: 2 }}>Selected Role</CardTitle>
                <InfoGrid>
                  <InfoTile>
                    <LabelText>Role</LabelText>
                    <ValueText>
                      {titleize(selectedAssignment?.permissionRole?.name || "No role selected")}
                    </ValueText>
                  </InfoTile>
                  <InfoTile>
                    <LabelText>Assigned To</LabelText>
                    <ValueText>{selectedAssignment?.name || "N/A"}</ValueText>
                  </InfoTile>
                  <InfoTile>
                    <LabelText>Email</LabelText>
                    <ValueText>{selectedAssignment?.email || "N/A"}</ValueText>
                  </InfoTile>
                  <InfoTile>
                    <LabelText>Total Access</LabelText>
                    <ValueText>
                      {countPermissions(selectedAssignment?.permissionRole?.permissions)}
                    </ValueText>
                  </InfoTile>
                </InfoGrid>
              </RoleInfoCard>
            </Grid>

            <Grid item xs={12} xl={7}>
              <PermissionMatrixTable
                editable={isEditingSelectedRole}
                roleName={
                  isEditingSelectedRole
                    ? editState.roleName
                    : titleize(selectedAssignment?.permissionRole?.name || "")
                }
                onRoleNameChange={(value) =>
                  setEditState((prev) => ({ ...prev, roleName: value }))
                }
                modules={
                  isEditingSelectedRole
                    ? editState.permissions
                    : selectedAssignment?.permissionRole?.permissions || []
                }
                onTogglePermission={handleToggleSelectedRolePermission}
                headerActions={selectedRoleHeaderActions}
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <CreateRoleCard elevation={0}>
          <Grid container spacing={2.5} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                placeholder="Optional assignee name"
                value={formState.name}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Optional assignee email"
                value={formState.email}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </Grid>
          </Grid>

          <PermissionMatrixTable
            editable
            roleName={formState.roleName}
            onRoleNameChange={(value) =>
              setFormState((prev) => ({ ...prev, roleName: value }))
            }
            modules={filterVisiblePermissions(formState.permissions)}
            onTogglePermission={handleTogglePermission}
          />

          <Divider sx={{ my: 3, borderColor: "rgba(43, 43, 43, 0.08)" }} />

          <FooterRow>
            <Typography sx={{ color: "semiDark.main" }}>
              Create the role and optionally assign it immediately by matching a subadmin email.
            </Typography>
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              disabled={!canCreateRole || createRoleMutation.isPending}
              onClick={handleAssignRole}
              sx={{
                backgroundColor: "myRed.main",
                borderRadius: 999,
                px: 3,
                py: 1.2,
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "primary.main",
                },
              }}
            >
              {createRoleMutation.isPending ? "Saving..." : "Assign Role"}
            </Button>
          </FooterRow>
        </CreateRoleCard>
      )}
    </PageShell>
  );
}

const PageShell = styled(Box)(({ theme }) => ({
  maxWidth: "1280px",
  margin: "0 auto",
  paddingBottom: 24,
  [theme.breakpoints.down("md")]: {
    paddingBottom: 8,
  },
}));

const HeaderRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,
  marginBottom: 28,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

const SwitcherCard = styled(Paper)(() => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: 8,
  borderRadius: 999,
  backgroundColor: "#ffffff",
  border: "1px solid rgba(43, 43, 43, 0.08)",
  boxShadow: "0 16px 40px rgba(43, 43, 43, 0.06)",
}));

const SwitcherButton = styled("button")(() => ({
  border: "none",
  background: "transparent",
  color: "#494949",
  cursor: "pointer",
  padding: "12px 18px",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontSize: 15,
  fontWeight: 700,
  transition: "all 0.2s ease",
  "&.active": {
    backgroundColor: "#ED1C24",
    color: "#FFFFFF",
    boxShadow: "0 12px 24px rgba(237, 28, 36, 0.24)",
  },
}));

const SectionCard = styled(Paper)(() => ({
  borderRadius: 24,
  padding: 24,
  border: "1px solid rgba(43, 43, 43, 0.08)",
  boxShadow: "0 20px 40px rgba(43, 43, 43, 0.06)",
  background: "#ffffff",
}));

const CompactSectionCard = styled(SectionCard)(() => ({
  display: "flex",
  flexDirection: "column",
  gap: 18,
}));

const RoleInfoCard = styled(Paper)(() => ({
  borderRadius: 24,
  padding: 24,
  border: "1px solid rgba(43, 43, 43, 0.08)",
  boxShadow: "0 20px 40px rgba(43, 43, 43, 0.06)",
  background: "linear-gradient(135deg, rgba(237, 28, 36, 0.06) 0%, #ffffff 65%)",
  alignSelf: "flex-start",
}));

const CreateRoleCard = styled(SectionCard)(() => ({
  background: "linear-gradient(180deg, #ffffff 0%, #fffafa 100%)",
}));

const CardTitle = styled(Typography)(() => ({
  fontWeight: 700,
  color: "#2B2B2B",
  marginBottom: 16,
}));

const TableHeaderCell = styled(TableCell)(() => ({
  fontWeight: 700,
  color: "#2B2B2B",
  backgroundColor: "rgba(237, 28, 36, 0.06)",
  borderBottom: "1px solid rgba(43, 43, 43, 0.08)",
}));

const BodyCell = styled(TableCell)(() => ({
  borderBottom: "1px solid rgba(43, 43, 43, 0.08)",
  color: "#2B2B2B",
}));

const RoleTableRow = styled(TableRow)(() => ({
  transition: "background-color 0.2s ease",
  cursor: "pointer",
  "&.selected": {
    backgroundColor: "rgba(237, 28, 36, 0.05)",
  },
  "&:hover": {
    backgroundColor: "rgba(237, 28, 36, 0.03)",
  },
}));

const RoleNameList = styled(Stack)(() => ({
  gap: 12,
}));

const RoleNameItem = styled(Box)(() => ({
  borderRadius: 16,
  padding: "14px 16px",
  backgroundColor: "rgba(237, 28, 36, 0.05)",
  border: "1px solid rgba(237, 28, 36, 0.08)",
}));

const InfoGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
  gap: 14,
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
  },
}));

const InfoTile = styled(Box)(() => ({
  borderRadius: 18,
  padding: 16,
  backgroundColor: "#ffffff",
  border: "1px solid rgba(43, 43, 43, 0.08)",
}));

const LabelText = styled(Typography)(() => ({
  fontSize: 13,
  color: "#494949",
  marginBottom: 6,
}));

const ValueText = styled(Typography)(() => ({
  fontWeight: 700,
  color: "#2B2B2B",
}));

const PaginationRow = styled(Box)(() => ({
  display: "flex",
  justifyContent: "flex-end",
  paddingTop: 18,
}));

const TopPaginationRow = styled(Box)(() => ({
  display: "flex",
  justifyContent: "flex-end",
}));

const FooterRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 16,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));
