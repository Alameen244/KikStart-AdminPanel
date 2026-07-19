import React from "react";
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";

export default function AssignProgramsDialog({
  open,
  onClose,
  selectedCoach,
  selectedProgramIds,
  onProgramIdsChange,
  programs,
  isAssigning,
  onAssign,
}) {
  const selectedPrograms = programs.filter((p) => selectedProgramIds.includes(p._id));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>
        Assign Programs{selectedCoach?.name ? ` — ${selectedCoach.name}` : ""}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: "semiDark.main", mb: 2 }}>
          A coach can be assigned to multiple programs. Select all that apply.
        </Typography>
        <Autocomplete
          multiple
          options={programs}
          getOptionLabel={(option) => option.title}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          value={selectedPrograms}
          onChange={(_e, newValue) => onProgramIdsChange(newValue.map((p) => p._id))}
          renderInput={(params) => <TextField {...params} label="Programs" placeholder="Select programs" />}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ color: "myRed.main" }}>Cancel</Button>
        <Button
          variant="contained"
          disabled={selectedProgramIds.length === 0 || isAssigning}
          onClick={onAssign}
          sx={{ backgroundColor: "myRed.main", borderRadius: 999, textTransform: "none", fontWeight: 700 }}
        >
          {isAssigning ? "Assigning..." : "Assign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}