import React from "react";
import {
  Box,
  Button,
  Chip,
  Fade,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { FilterList, Search, SwapVert } from "@mui/icons-material";

const ROLES = [
  { value: "", label: "All Roles" },
  { value: "user", label: "User" },
  { value: "subAdmin", label: "Sub Admin" },
  { value: "admin", label: "Admin" },
];

const SUBSCRIPTION_STATUSES = [
  { value: "", label: "All Subscriptions" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "cancelled", label: "Cancelled" },
];

const PLANS = [
  { value: "", label: "All Plans" },
  { value: "basic", label: "Basic" },
  { value: "professional", label: "Professional" },
  { value: "advanced", label: "Advanced" },
];

const SORT_FIELDS = [
  { value: "createdAt", label: "Join Date" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "subscription.plan", label: "Plan" },
];

export default function UserFilters({
  filters,
  onChange,
  onReset,
  hasActiveFilters,
}) {
  const handleChange = (field) => (e) => {
    onChange({
      [field]: e.target.value,
      ...(field !== "search" ? { page: 1 } : {}),
    });
  };

  const toggleSortOrder = () => {
    onChange({
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
      page: 1,
    });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mb: 1.5,
          ml: { xs: 0, md: "auto" },
          width: { xs: "100%", sm: "auto" },
          justifyContent: "flex-end",
          flexWrap: "nowrap",
        }}
      >
        {/* Reset */}
        <Box
          sx={{
            width: 112,
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Fade in={hasActiveFilters} timeout={220}>
            <Button
              variant="outlined"
              color="error"
              onClick={onReset}
              disabled={!hasActiveFilters}
              sx={{
                height: 40,
                width: "100%",
                borderRadius: "12px",
                textTransform: "none",
                whiteSpace: "nowrap",
                pointerEvents: hasActiveFilters ? "auto" : "none",
              }}
            >
              Clear Filters
            </Button>
          </Fade>
        </Box>

        {/* Sort Direction toggle */}
        <Tooltip
          title={`Currently: ${
            filters.sortOrder === "asc"
              ? "A → Z / Oldest first"
              : "Z → A / Newest first"
          }`}
        >
          <Button
            variant="contained"
            onClick={toggleSortOrder}
            startIcon={
              <SwapVert
                sx={{
                  transition: "transform .3s ease",
                  transform:
                    filters.sortOrder === "asc"
                      ? "rotate(0deg)"
                      : "rotate(180deg)",
                }}
              />
            }
            sx={{
              height: 40,
              borderRadius: "12px",
              minWidth: 138,
              px: 2,
              textTransform: "none",
              transition: "all .25s ease",

              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,
              },
            }}
          >
            {filters.sortOrder === "asc" ? "Oldest First" : "Newest First"}
          </Button>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.5,
          alignItems: "center",
          mb: 2.5,
          bgcolor: "background.paper",
          p: 2.5,
          borderRadius: 3,
          background: "#fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          border: "1px solid #f1f1f1",
        }}
      >
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search name or email…"
          value={filters.search}
          onChange={handleChange("search")}
          sx={{
            flexGrow: 1,
            flex: 1,
            minWidth: 280,

            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "#fafafa",

              "&:hover": {
                backgroundColor: "#fff",
              },

              "&.Mui-focused": {
                backgroundColor: "#fff",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Role */}
        <FormControl
          size="small"
          sx={{
            minWidth: 140,

            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              backgroundColor: "#f7f8fa",
            },
          }}
        >
          <InputLabel>Role</InputLabel>
          <Select
            value={filters.role}
            label="Role"
            onChange={handleChange("role")}
          >
            {ROLES.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Subscription Status */}
        <FormControl
          size="small"
          sx={{
            minWidth: 140,

            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              backgroundColor: "#f7f8fa",
            },
          }}
        >
          <InputLabel>Subscription</InputLabel>
          <Select
            value={filters.subscriptionStatus}
            label="Subscription"
            onChange={handleChange("subscriptionStatus")}
          >
            {SUBSCRIPTION_STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Plan */}
        <FormControl
          size="small"
          sx={{
            minWidth: 140,

            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              backgroundColor: "#f7f8fa",
            },
          }}
        >
          <InputLabel>Plan</InputLabel>
          <Select
            value={filters.plan}
            label="Plan"
            onChange={handleChange("plan")}
          >
            {PLANS.map((p) => (
              <MenuItem key={p.value} value={p.value}>
                {p.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl
          size="small"
          sx={{
            minWidth: 140,

            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              backgroundColor: "#f7f8fa",
            },
          }}
        >
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            label="Sort By"
            onChange={handleChange("sortBy")}
            startAdornment={
              <FilterList
                fontSize="small"
                sx={{ ml: 1, color: "text.secondary" }}
              />
            }
          >
            {SORT_FIELDS.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
