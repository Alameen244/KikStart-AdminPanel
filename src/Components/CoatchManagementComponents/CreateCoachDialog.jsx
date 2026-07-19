import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";

export default function CreateCoachDialog({ open, onClose, form, onFormChange, isCreating, onSubmit }) {
  const canSubmit = form.name.trim() && form.email.trim();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Create Coach</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Name" value={form.name} onChange={(e) => onFormChange("name", e.target.value)} fullWidth />
          <TextField label="Email" value={form.email} onChange={(e) => onFormChange("email", e.target.value)} fullWidth />
          <TextField
            label="Experience (optional)"
            value={form.experience}
            onChange={(e) => onFormChange("experience", e.target.value)}
            fullWidth
            placeholder="e.g. 5 years coaching youth football"
          />
          <TextField
            label="Bio (optional)"
            value={form.bio}
            onChange={(e) => onFormChange("bio", e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
          <Typography variant="body2" sx={{ color: "semiDark.main" }}>
            Password will be auto-generated and sent to the coach by email.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ color: "myRed.main" }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!canSubmit || isCreating}
          onClick={onSubmit}
          sx={{ backgroundColor: "myRed.main", borderRadius: 999, textTransform: "none", fontWeight: 700 }}
        >
          {isCreating ? "Creating..." : "Create Coach"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}