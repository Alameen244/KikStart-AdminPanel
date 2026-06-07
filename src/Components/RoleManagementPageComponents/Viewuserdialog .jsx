import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { titleize } from "./utils";

// Props:
//   open  – boolean
//   onClose – () => void
//   user  – row object | null

export default function ViewUserDialog({ open, onClose, user }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>User Details</DialogTitle>

      <DialogContent>
        <Stack spacing={1.5} sx={{ pt: 1 }}>
          <Typography>
            <strong>Name:</strong> {user?.name || "N/A"}
          </Typography>
          <Typography>
            <strong>Email:</strong> {user?.email || "N/A"}
          </Typography>
          <Typography>
            <strong>Assigned Role:</strong>{" "}
            {user?.assignedRoleName ? titleize(user.assignedRoleName) : "Not assigned"}
          </Typography>
          <Typography>
            <strong>Permissions:</strong> {user?.permissionCount || 0}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
