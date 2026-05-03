import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUserById,
  getAllUsers,
  getUserById,
} from "../Apis/AuthApis/authApis";
import { toast } from "react-toastify";

export default function UserManagement() {
  const queryClient = useQueryClient();
  const [selectedRow, setSelectedRow] = useState(null);
  const [mode, setMode] = useState("");

  const {
    data: usersResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  });

  const rows = useMemo(
    () =>
      Array.isArray(usersResponse?.data)
        ? usersResponse.data.map((user) => ({
            id: user?._id,
            name: user?.name || "N/A",
            email: user?.email || "N/A",
            phone: user?.phone || "N/A",
            location: user?.location || "N/A",
            pinCode: user?.pinCode || "N/A",
            role: user?.role || "user",
            status: user?.isVerified ? "Active" : "Inactive",
            createdAt: user?.createdAt,
          }))
        : [],
    [usersResponse],
  );

  const userDetailsQuery = useQuery({
    queryKey: ["admin-user", selectedRow?.id],
    queryFn: () => getUserById(selectedRow.id),
    enabled: mode === "view" && Boolean(selectedRow?.id),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUserById,
    onSuccess: (response) => {
      toast.success(response?.message || "User deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      handleClose();
    },
    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message || "Failed to delete user.",
      );
    },
  });

  const handleOpen = (row, type) => {
    setSelectedRow(row);
    setMode(type);
  };

  const handleClose = () => {
    setSelectedRow(null);
    setMode("");
  };

  const handleDelete = () => {
    if (!selectedRow?.id) return;
    deleteMutation.mutate(selectedRow.id);
  };

  const getRoleColor = (role) => {
    switch ((role || "").toLowerCase()) {
      case "admin":
        return "error";
      case "subadmin":
        return "warning";
      default:
        return "default";
    }
  };

  const getStatusColor = (status) =>
    status === "Active" ? "success" : "default";

  const userDetails = userDetailsQuery.data?.data || selectedRow;

  return (
    <UserManagementContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, color: "dark.main" }}>
          User Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Showing {rows.length} users from DataBase
        </Typography>
      </Box>

      {isLoading ? (
        <CenteredState>
          <CircularProgress />
        </CenteredState>
      ) : isError ? (
        <Alert severity="error">
          {error?.response?.data?.message || "Failed to load users."}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

            <TableBody>
               {rows.length > 0 ? (
                 rows.map((row) => (
                   <TableRow key={row.id}>
                     <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                     <TableCell>{row.email}</TableCell>
                     <TableCell>
                       <Chip
                         label={row.role}
                         color={getRoleColor(row.role)}
                         size="small"
                       />
                     </TableCell>
                     <TableCell>
                       <Chip
                         label={row.status}
                         color={getStatusColor(row.status)}
                         size="small"
                       />
                     </TableCell>
                     <TableCell align="center">
                       <IconButton
                         onClick={() => handleOpen(row, "view")}
                         size="small"
                       >
                         <Visibility />
                       </IconButton>
                       <IconButton size="small" disabled>
                         <Edit />
                       </IconButton>
                       <IconButton
                         onClick={() => handleOpen(row, "delete")}
                         size="small"
                         color="error"
                       >
                         <Delete />
                       </IconButton>
                     </TableCell>
                   </TableRow>
                 ))
               ) : (
                 <TableRow>
                   <TableCell colSpan={5} align="center">
                     No users found.
                   </TableCell>
                 </TableRow>
               )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={mode === "view"} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {userDetailsQuery.isLoading ? (
            <CenteredState>
              <CircularProgress size={28} />
            </CenteredState>
          ) : userDetailsQuery.isError ? (
            <Alert severity="error">
              {userDetailsQuery.error?.response?.data?.message ||
                "Failed to load user details."}
            </Alert>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography><strong>Name:</strong> {userDetails?.name || "N/A"}</Typography>
              <Typography><strong>Email:</strong> {userDetails?.email || "N/A"}</Typography>
              <Typography><strong>Phone:</strong> {userDetails?.phone || "N/A"}</Typography>
              <Typography><strong>Location:</strong> {userDetails?.location || "N/A"}</Typography>
              <Typography><strong>Pin Code:</strong> {userDetails?.pinCode || "N/A"}</Typography>
              <Typography><strong>Role:</strong> {userDetails?.role || "N/A"}</Typography>
              <Typography>
                <strong>Status:</strong> {userDetails?.isVerified ? "Active" : userDetails?.status || "Inactive"}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={mode === "delete"} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{selectedRow?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </UserManagementContainer>
  );
}

const UserManagementContainer = styled(Box)({
  maxWidth: "1200px",
  margin: "0 auto",
});

const CenteredState = styled(Box)({
  minHeight: "220px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});
