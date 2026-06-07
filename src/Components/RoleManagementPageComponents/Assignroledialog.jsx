import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { Launch } from "@mui/icons-material";
import { titleize } from "./utils";

// Props:
//   open            – boolean
//   onClose         – () => void
//   selectedUser    – row object | null
//   selectedRoleId  – string (controlled by parent)
//   onRoleChange    – (roleId: string) => void
//   roles           – full roles list from DB [{ _id, name }]
//   isAssigning     – boolean (assignRoleMutation.isPending)
//   onAssign        – () => void
//   onNavigateCreate– () => void  (goes to /permissions?tab=create)

export default function AssignRoleDialog({
  open,
  onClose,
  selectedUser,
  selectedRoleId,
  onRoleChange,
  roles,
  isAssigning,
  onAssign,
  onNavigateCreate,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Assign Role</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Typography sx={{ color: "semiDark.main" }}>
            {selectedUser?.name || "User"} can be assigned one of the existing
            roles.
          </Typography>

          <FormControl fullWidth>
            <InputLabel id="assign-role-label">Existing Role</InputLabel>
            <Select
              labelId="assign-role-label"
              label="Existing Role"
              value={selectedRoleId}
              onChange={(e) => onRoleChange(e.target.value)}
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
            onClick={onNavigateCreate}
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
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onAssign}
          disabled={!selectedRoleId || isAssigning}
          sx={{
            backgroundColor: "myRed.main",
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {isAssigning ? "Assigning..." : "Assign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
