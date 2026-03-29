import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";

export default function GymCardSection() {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Gym Card Content
      </Typography>
      <Paper sx={{ p: 3, minHeight: "200px" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Gym card content will appear here. This section will include gym
          facilities, equipment, or membership information.
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="outlined" size="small">
            View
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "myRed.main",
              "&:hover": { backgroundColor: "myRed.dark" },
            }}
          >
            Edit
          </Button>
          <Button variant="outlined" size="small" color="error">
            Delete
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
