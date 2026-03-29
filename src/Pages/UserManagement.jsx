import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { Edit, Delete, Visibility, Add } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const initialData = [
  { id: 1, name: "Rounak", email: "rounak@gmail.com", role: "Admin", status: "Active" },
  { id: 2, name: "Amit", email: "amit@gmail.com", role: "User", status: "Active" },
  { id: 3, name: "Priya", email: "priya@gmail.com", role: "Coach", status: "Inactive" },
];

export default function UserManagement() {
  const [rows, setRows] = useState(initialData);
  const [selectedRow, setSelectedRow] = useState(null);
  const [mode, setMode] = useState("");

  const handleOpen = (row, type) => {
    setSelectedRow({ ...row });
    setMode(type);
  };

  const handleClose = () => {
    setSelectedRow(null);
    setMode("");
  };

  const handleEditSave = () => {
    setRows(rows.map(r => (r.id === selectedRow.id ? selectedRow : r)));
    handleClose();
  };

  const handleDelete = () => {
    setRows(rows.filter(r => r.id !== selectedRow.id));
    handleClose();
  };

  const handleAddUser = () => {
    setMode("add");
    setSelectedRow({
      id: rows.length + 1,
      name: "",
      email: "",
      role: "User",
      status: "Active",
    });
  };

  const handleAddSave = () => {
    setRows((prevRows) => [...prevRows, selectedRow]);
    handleClose();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'error';
      case 'Coach': return 'warning';
      default: return 'primary';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'default';
  };

  return (
    <UserManagementContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'dark.main' }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddUser}
          sx={{ backgroundColor: 'myRed.main', '&:hover': { backgroundColor: 'myRed.dark' } }}
        >
          Add User
        </Button>
      </Box>

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
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <Chip label={row.role} color={getRoleColor(row.role)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={row.status} color={getStatusColor(row.status)} size="small" />
                </TableCell>

                <TableCell align="center">
                  <IconButton onClick={() => handleOpen(row, "view")} size="small">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleOpen(row, "edit")} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpen(row, "delete")} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* VIEW DIALOG */}
      <Dialog open={mode === "view"} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography><strong>Name:</strong> {selectedRow?.name}</Typography>
            <Typography><strong>Email:</strong> {selectedRow?.email}</Typography>
            <Typography><strong>Role:</strong> {selectedRow?.role}</Typography>
            <Typography><strong>Status:</strong> {selectedRow?.status}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={mode === "edit"} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            value={selectedRow?.name || ""}
            onChange={e => setSelectedRow({ ...selectedRow, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={selectedRow?.email || ""}
            onChange={e => setSelectedRow({ ...selectedRow, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Role"
            value={selectedRow?.role || ""}
            onChange={e => setSelectedRow({ ...selectedRow, role: e.target.value })}
            fullWidth
          />
          <TextField
            label="Status"
            value={selectedRow?.status || ""}
            onChange={e => setSelectedRow({ ...selectedRow, status: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={mode === "add"} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            value={selectedRow?.name || ""}
            onChange={e => setSelectedRow({ ...selectedRow, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={selectedRow?.email || ""}
            onChange={e => setSelectedRow({ ...selectedRow, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Role"
            value={selectedRow?.role || ""}
            onChange={e => setSelectedRow({ ...selectedRow, role: e.target.value })}
            fullWidth
          />
          <TextField
            label="Status"
            value={selectedRow?.status || ""}
            onChange={e => setSelectedRow({ ...selectedRow, status: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSave}>
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={mode === "delete"} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete <strong>{selectedRow?.name}</strong>?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </UserManagementContainer>
  );
}

const UserManagementContainer = styled(Box)({
  maxWidth: '1200px',
  margin: '0 auto',
});
