import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";

export default function ProgramsSection() {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Programs Content
      </Typography>
      <Paper sx={{ p: 3, minHeight: "200px" }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Programs content will appear here. This section will include
          different training programs, schedules, and pricing.
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
