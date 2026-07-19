import React from "react";
import { Chip, Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";

export default function ViewCoachDialog({ open, onClose, coach }) {
  if (!coach) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>Coach Details</DialogTitle>
      <DialogContent>
        <Stack spacing={1.5}>
          <Typography><strong>Name:</strong> {coach.name}</Typography>
          <Typography><strong>Email:</strong> {coach.email}</Typography>
          <Typography><strong>Max Students:</strong> {coach.maxStudents}</Typography>
          <Typography><strong>Status:</strong> {coach.isActive ? "Active" : "Inactive"}</Typography>

          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Assigned Programs</Typography>
          {coach.assignedPrograms.length === 0 ? (
            <Typography variant="body2" sx={{ color: "semiDark.main" }}>No programs assigned yet.</Typography>
          ) : (
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {coach.assignedPrograms.map((program) => (
                <Chip key={program._id} label={program.title} size="small" />
              ))}
            </Stack>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}