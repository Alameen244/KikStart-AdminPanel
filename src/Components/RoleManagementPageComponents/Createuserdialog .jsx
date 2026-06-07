import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

// Props:
//   open          – boolean
//   onClose       – () => void
//   form          – { name: string, email: string }
//   onFormChange  – (field: "name" | "email", value: string) => void
//   isCreating    – boolean (createSubAdminMutation.isPending)
//   onSubmit      – () => void

export default function CreateUserDialog({
  open,
  onClose,
  form,
  onFormChange,
  isCreating,
  onSubmit,
}) {
  const isDisabled = !form.name.trim() || !form.email.trim() || isCreating;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create User</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Name"
            value={form.name}
            onChange={(e) => onFormChange("name", e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => onFormChange("email", e.target.value)}
          />
          <Typography sx={{ color: "semiDark.main" }}>
            Password will be auto-generated and sent to the user by email.
            Every new user from here is created as a subadmin.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isDisabled}
          sx={{
            backgroundColor: "myRed.main",
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {isCreating ? "Creating..." : "Create User"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
