import { Box, Paper, Typography } from "@mui/material";

export default function StatCard({ icon, label, value, accent }) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 180,
        p: 2.5,
        borderRadius: "14px",
        border: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          backgroundColor: `${accent}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 12, color: "#888", mb: 0.3 }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: "#1a1a2e",
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}
