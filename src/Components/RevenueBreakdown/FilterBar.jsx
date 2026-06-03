import { Box, MenuItem, Select, Typography } from "@mui/material";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

const sx = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    px: 2.5,
    py: 1.5,
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #ebebeb",
    flexWrap: "wrap",
  },
  group: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    color: "#aaa",
  },
  select: {
    minWidth: 100,
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8e8e8" },
    "& .MuiSelect-select": { py: "6px", px: "12px", fontSize: 13, fontWeight: 600, color: "#1a1a2e" },
    "& .MuiSvgIcon-root": { color: "#aaa" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#ccc" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1a1a2e", borderWidth: 1 },
    borderRadius: "8px",
  },
  divider: {
    width: "1px",
    height: 20,
    background: "#ebebeb",
    mx: 0.5,
    display: { xs: "none", sm: "block" },
  },
  pillGroup: {
    display: "flex",
    gap: 0.5,
    background: "#f5f5f5",
    borderRadius: "8px",
    p: "3px",
  },
  pill: (active) => ({
    fontSize: 12,
    fontWeight: 600,
    px: 1.5,
    py: 0.5,
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    transition: "all 0.15s ease",
    background: active ? "#fff" : "transparent",
    color: active ? "#1a1a2e" : "#999",
    boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
    "&:hover": {
      color: active ? "#1a1a2e" : "#666",
    },
  }),
};

export default function FilterBar({ year, status, onYearChange, onStatusChange }) {
  return (
    <Box sx={sx.wrapper}>
      <Box sx={sx.group}>
        <Typography sx={sx.label}>Year</Typography>
        <Select
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
          size="small"
          sx={sx.select}
        >
          {YEARS.map((y) => (
            <MenuItem key={y} value={y} sx={{ fontSize: 13, fontWeight: 600 }}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={sx.divider} />

      <Box sx={sx.group}>
        <Typography sx={sx.label}>Status</Typography>
        <Box sx={sx.pillGroup}>
          {[
            { value: "paid", label: "Paid only" },
            { value: "all", label: "All" },
          ].map(({ value, label }) => (
            <Box
              key={value}
              component="button"
              sx={sx.pill(status === value)}
              onClick={() => onStatusChange(value)}
            >
              {label}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
