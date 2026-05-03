import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
  DeleteOutline,
  Launch,
  PersonAddAlt1,
  RemoveRedEye,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignPermissionRoleToSubAdmin,
  createSubAdmin,
  deleteSubAdminById,
  getSubAdmins,
} from "../Apis/AuthApis/authApis";
import { getRoles } from "../Apis/RolePermissionApis/rolePermissionApi";
import { toast } from "react-toastify";

const titleize = (value = "") =>
  value.replace(/\b\w/g, (char) => char.toUpperCase());

export default function RoleManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [readDialogOpen, setReadDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [createUserForm, setCreateUserForm] = useState({
    name: "",
    email: "",
  });

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
  const roles = Array.isArray(rolesQuery.data?.data) ? rolesQuery.data.data : [];

  const createSubAdminMutation = useMutation({
    mutationFn: createSubAdmin,
    onSuccess: async (response) => {
      toast.success(response?.message || "Subadmin created successfully.");
      await queryClient.invalidateQueries({ queryKey: ["subadmins"] });
      setCreateDialogOpen(false);
      setCreateUserForm({ name: "", email: "" });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create subadmin.");
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: assignPermissionRoleToSubAdmin,
    onSuccess: async (response) => {
      toast.success(response?.message || "Role assigned successfully.");
      await queryClient.invalidateQueries({ queryKey: ["subadmins"] });
      handleCloseAssignDialog();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to assign role.");
    },
  });

  const deleteSubAdminMutation = useMutation({
    mutationFn: deleteSubAdminById,
    onSuccess: async (response) => {
      toast.success(response?.message || "Subadmin deleted successfully.");
      await queryClient.invalidateQueries({ queryKey: ["subadmins"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete subadmin.");
    },
  });

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
                count +
                Object.values(item.actions || {}).filter(Boolean).length,
              0,
            )
          : 0,
      })),
    [subAdmins],
  );

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

  const handleOpenReadDialog = (user) => {
    setSelectedUser(user);
    setReadDialogOpen(true);
  };

  const handleCreateRole = () => {
    navigate("/permissions", { state: { tab: "create" } });
  };

  const handleSubmitCreateUser = () => {
    createSubAdminMutation.mutate({
      name: createUserForm.name.trim(),
      email: createUserForm.email.trim(),
    });
  };

  const handleAssignRole = () => {
    if (!selectedUser?.id || !selectedRoleId) return;
    assignRoleMutation.mutate({
      userId: selectedUser.id,
      permissionRoleId: selectedRoleId,
    });
  };

  return (
    <PageShell>
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

      {subAdminsQuery.isError || rolesQuery.isError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {subAdminsQuery.error?.response?.data?.message ||
            rolesQuery.error?.response?.data?.message ||
            "Failed to load role management data."}
        </Alert>
      ) : null}

      {subAdminsQuery.isLoading ? (
        <StateCard>
          <Typography>Loading subadmins...</Typography>
        </StateCard>
      ) : (
        <TableCard elevation={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <HeaderCell>S No</HeaderCell>
                  <HeaderCell>User Name</HeaderCell>
                  <HeaderCell>Email</HeaderCell>
                  <HeaderCell>Role</HeaderCell>
                  <HeaderCell align="center">Enable</HeaderCell>
                  <HeaderCell align="center">Actions</HeaderCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.length > 0 ? (
                  rows.map((user) => (
                    <BodyRow key={user.id}>
                      <BodyCell>{user.serial}</BodyCell>
                      <BodyCell>{user.name}</BodyCell>
                      <BodyCell>{user.email}</BodyCell>
                      <BodyCell>
                        {user.assignedRoleName ? (
                          <RoleCellButton type="button" onClick={() => handleOpenAssignDialog(user)}>
                            <Typography sx={{ fontWeight: 700, color: "myRed.main" }}>
                              {titleize(user.assignedRoleName)}
                            </Typography>
                          </RoleCellButton>
                        ) : (
                          <AssignIconButton onClick={() => handleOpenAssignDialog(user)}>
                            <Add />
                          </AssignIconButton>
                        )}
                      </BodyCell>
                      <BodyCell align="center">
                        <Checkbox checked={user.enabled} disableRipple />
                      </BodyCell>
                      <BodyCell align="center">
                        <ActionStack>
                          <IconButton onClick={() => handleOpenReadDialog(user)}>
                            <RemoveRedEye />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => deleteSubAdminMutation.mutate(user.id)}
                            disabled={deleteSubAdminMutation.isPending}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </ActionStack>
                      </BodyCell>
                    </BodyRow>
                  ))
                ) : (
                  <TableRow>
                    <BodyCell colSpan={6} align="center">
                      No subadmins found.
                    </BodyCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TableCard>
      )}

      <Dialog open={assignDialogOpen} onClose={handleCloseAssignDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Assign Role</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Typography sx={{ color: "semiDark.main" }}>
              {selectedUser?.name || "User"} can be assigned one of the existing roles.
            </Typography>

            <FormControl fullWidth>
              <InputLabel id="assign-role-label">Existing Role</InputLabel>
              <Select
                labelId="assign-role-label"
                label="Existing Role"
                value={selectedRoleId}
                onChange={(event) => setSelectedRoleId(event.target.value)}
              >
                {roles.map((role) => (
                  <MenuItem key={role._id} value={role._id}>
                    {titleize(role.name)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="text"
              startIcon={<Launch />}
              onClick={handleCreateRole}
              sx={{
                alignSelf: "flex-start",
                color: "myRed.main",
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Create Role
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAssignRole}
            disabled={!selectedRoleId || assignRoleMutation.isPending}
            sx={{
              backgroundColor: "myRed.main",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {assignRoleMutation.isPending ? "Assigning..." : "Assign"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              value={createUserForm.name}
              onChange={(event) =>
                setCreateUserForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={createUserForm.email}
              onChange={(event) =>
                setCreateUserForm((prev) => ({ ...prev, email: event.target.value }))
              }
            />
            <Typography sx={{ color: "semiDark.main" }}>
              Password will be auto-generated and sent to the user by email. Every new user from here is created as a subadmin.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitCreateUser}
            disabled={
              !createUserForm.name.trim() ||
              !createUserForm.email.trim() ||
              createSubAdminMutation.isPending
            }
            sx={{
              backgroundColor: "myRed.main",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            {createSubAdminMutation.isPending ? "Creating..." : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={readDialogOpen} onClose={() => setReadDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Typography><strong>Name:</strong> {selectedUser?.name || "N/A"}</Typography>
            <Typography><strong>Email:</strong> {selectedUser?.email || "N/A"}</Typography>
            <Typography>
              <strong>Assigned Role:</strong> {selectedUser?.assignedRoleName ? titleize(selectedUser.assignedRoleName) : "Not assigned"}
            </Typography>
            <Typography><strong>Permissions:</strong> {selectedUser?.permissionCount || 0}</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReadDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageShell>
  );
}

const PageShell = styled(Box)({
  maxWidth: "1280px",
  margin: "0 auto",
});

const HeaderRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,
  marginBottom: 24,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

const TableCard = styled(Paper)(() => ({
  borderRadius: 24,
  border: "1px solid rgba(43, 43, 43, 0.08)",
  boxShadow: "0 18px 40px rgba(43, 43, 43, 0.06)",
  overflow: "hidden",
}));

const HeaderCell = styled(TableCell)(() => ({
  fontWeight: 700,
  color: "#2B2B2B",
  backgroundColor: "rgba(237, 28, 36, 0.06)",
  borderBottom: "1px solid rgba(43, 43, 43, 0.08)",
}));

const BodyRow = styled(TableRow)(() => ({
  "&:hover": {
    backgroundColor: "rgba(237, 28, 36, 0.03)",
  },
}));

const BodyCell = styled(TableCell)(() => ({
  borderBottom: "1px solid rgba(43, 43, 43, 0.08)",
  color: "#2B2B2B",
}));

const AssignIconButton = styled(IconButton)(() => ({
  width: 34,
  height: 34,
  borderRadius: 10,
  border: "1px dashed rgba(237, 28, 36, 0.5)",
  color: "#ED1C24",
}));

const RoleCellButton = styled("button")(() => ({
  border: "none",
  background: "rgba(237, 28, 36, 0.06)",
  borderRadius: 999,
  padding: "8px 14px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
}));

const ActionStack = styled(Box)(() => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
}));

const StateCard = styled(Paper)(() => ({
  padding: 24,
  borderRadius: 20,
  textAlign: "center",
}));
