import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { PersonAddAlt1, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// ── API imports (fix paths to match your project) ──────────────────────────
import {
  assignPermissionRoleToSubAdmin,
  createSubAdmin,
  deleteSubAdminById,
  getSubAdmins,
} from "../Apis/AuthApis/authApis";
import { getRoles } from "../Apis/RolePermissionApis/rolePermissionApi";

// ── Local components ────────────────────────────────────────────────────────
import SubAdminTable from "../Components/RoleManagementPageComponents/Subadmintable";
import AssignRoleDialog from "../Components/RoleManagementPageComponents/Assignroledialog";
import CreateUserDialog from "../Components/RoleManagementPageComponents/Createuserdialog ";
import ViewUserDialog from "../Components/RoleManagementPageComponents/Viewuserdialog ";
import { FilterRow, HeaderRow, PageShell, StateCard } from "../Components/RoleManagementPageComponents/styled";
import { titleize } from "../Components/RoleManagementPageComponents/utils";

export default function RoleManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Dialog / selection state ───────────────────────────────────────────
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [createForm, setCreateForm] = useState({ name: "", email: "" });

  // ── Filter state ───────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRoleId, setFilterRoleId] = useState(""); // "" = All Roles

  // ── Queries ────────────────────────────────────────────────────────────
  const subAdminsQuery = useQuery({
    queryKey: ["subadmins"],
    queryFn: getSubAdmins,
  });

  const rolesQuery = useQuery({
    queryKey: ["permission-roles"],
    queryFn: getRoles,
  });

  const subAdmins = Array.isArray(subAdminsQuery.data?.data)
    ? subAdminsQuery.data.data
    : [];
  const roles = Array.isArray(rolesQuery.data?.data)
    ? rolesQuery.data.data
    : [];

  // ── Mutations ──────────────────────────────────────────────────────────
  const createSubAdminMutation = useMutation({
    mutationFn: createSubAdmin,
    onSuccess: async (res) => {
      toast.success(res?.message || "Subadmin created successfully.");
      await queryClient.invalidateQueries({ queryKey: ["subadmins"] });
      setCreateDialogOpen(false);
      setCreateForm({ name: "", email: "" });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create subadmin.");
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: assignPermissionRoleToSubAdmin,
    onSuccess: async (res) => {
      toast.success(res?.message || "Role assigned successfully.");
      await queryClient.invalidateQueries({ queryKey: ["subadmins"] });
      handleCloseAssignDialog();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to assign role.");
    },
  });

  const deleteSubAdminMutation = useMutation({
    mutationFn: deleteSubAdminById,
    onSuccess: async (res) => {
      toast.success(res?.message || "Subadmin deleted successfully.");
      await queryClient.invalidateQueries({ queryKey: ["subadmins"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete subadmin.");
    },
  });

  // ── Derived: normalised rows ───────────────────────────────────────────
  const rows = useMemo(
    () =>
      subAdmins.map((user, index) => ({
        id: user?._id,
        serial: index + 1,
        name: user?.name || "N/A",
        email: user?.email || "N/A",
        enabled: Boolean(user?.isVerified),
        assignedRoleId: user?.permissionRole?._id || "",
        assignedRoleName: user?.permissionRole?.name || "",
        permissionCount: Array.isArray(user?.permissionRole?.permissions)
          ? user.permissionRole.permissions.reduce(
              (count, item) =>
                count + Object.values(item.actions || {}).filter(Boolean).length,
              0,
            )
          : 0,
      })),
    [subAdmins],
  );

  // ── Derived: filtered rows ─────────────────────────────────────────────
  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return rows.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = !filterRoleId || user.assignedRoleId === filterRoleId;
      return matchesSearch && matchesRole;
    });
  }, [rows, searchQuery, filterRoleId]);

  // ── Derived: roles present in table (for filter dropdown) ─────────────
  const assignedRoleOptions = useMemo(() => {
    const seen = new Set();
    const options = [];
    rows.forEach((user) => {
      if (user.assignedRoleId && !seen.has(user.assignedRoleId)) {
        seen.add(user.assignedRoleId);
        options.push({ id: user.assignedRoleId, name: user.assignedRoleName });
      }
    });
    return options.sort((a, b) => a.name.localeCompare(b.name));
  }, [rows]);

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleOpenAssignDialog = (user) => {
    setSelectedUser(user);
    setSelectedRoleId(user?.assignedRoleId || "");
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedUser(null);
    setSelectedRoleId("");
  };

  const handleOpenViewDialog = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssignRole = () => {
    if (!selectedUser?.id || !selectedRoleId) return;
    assignRoleMutation.mutate({
      userId: selectedUser.id,
      permissionRoleId: selectedRoleId,
    });
  };

  const handleSubmitCreate = () => {
    createSubAdminMutation.mutate({
      name: createForm.name.trim(),
      email: createForm.email.trim(),
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <PageShell>

      {/* Header */}
      <HeaderRow>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "dark.main", mb: 1 }}>
            Role Management
          </Typography>
          <Typography sx={{ color: "semiDark.main" }}>
            Create subadmins, assign permission roles, and manage role access.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<PersonAddAlt1 />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            backgroundColor: "myRed.main",
            borderRadius: 999,
            px: 2.5,
            py: 1.2,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Create User
        </Button>
      </HeaderRow>

      {/* Search + Role filter */}
      <FilterRow>
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email…"
          size="small"
          sx={{ flex: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "semiDark.main", fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 3 },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="role-filter-label">Filter by Role</InputLabel>
          <Select
            labelId="role-filter-label"
            label="Filter by Role"
            value={filterRoleId}
            onChange={(e) => setFilterRoleId(e.target.value)}
            sx={{ borderRadius: 3 }}
          >
            <MenuItem value="">All Roles</MenuItem>
            {assignedRoleOptions.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                {titleize(role.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </FilterRow>

      {/* Error state */}
      {(subAdminsQuery.isError || rolesQuery.isError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {subAdminsQuery.error?.response?.data?.message ||
            rolesQuery.error?.response?.data?.message ||
            "Failed to load role management data."}
        </Alert>
      )}

      {/* Loading / Table */}
      {subAdminsQuery.isLoading ? (
        <StateCard>
          <Typography>Loading subadmins...</Typography>
        </StateCard>
      ) : (
        <SubAdminTable
          rows={filteredRows}
          searchQuery={searchQuery}
          filterRoleId={filterRoleId}
          isDeleting={deleteSubAdminMutation.isPending}
          onOpenAssign={handleOpenAssignDialog}
          onOpenRead={handleOpenViewDialog}
          onDelete={(id) => deleteSubAdminMutation.mutate(id)}
        />
      )}

      {/* Dialogs */}
      <AssignRoleDialog
        open={assignDialogOpen}
        onClose={handleCloseAssignDialog}
        selectedUser={selectedUser}
        selectedRoleId={selectedRoleId}
        onRoleChange={setSelectedRoleId}
        roles={roles}
        isAssigning={assignRoleMutation.isPending}
        onAssign={handleAssignRole}
        onNavigateCreate={() =>
          navigate("/permissions", { state: { tab: "create" } })
        }
      />

      <CreateUserDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        form={createForm}
        onFormChange={handleFormChange}
        isCreating={createSubAdminMutation.isPending}
        onSubmit={handleSubmitCreate}
      />

      <ViewUserDialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        user={selectedUser}
      />

    </PageShell>
  );
}
