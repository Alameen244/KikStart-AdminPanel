import React from "react";
import {
    Box,
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip,
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

export default function UserFilters({ filters, onChange, onReset, hasActiveFilters }) {
    const handleChange = (field) => (e) => {
        onChange({ [field]: e.target.value, ...(field !== "search" ? { page: 1 } : {}) });
    };

    const toggleSortOrder = () => {
        onChange({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc", page: 1 });
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1.5,
                alignItems: "center",
                mb: 2.5,
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            {/* Search */}
            <TextField
                size="small"
                placeholder="Search name or email…"
                value={filters.search}
                onChange={handleChange("search")}
                sx={{ minWidth: 220, flexGrow: 1 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search fontSize="small" sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Role */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Role</InputLabel>
                <Select value={filters.role} label="Role" onChange={handleChange("role")}>
                    {ROLES.map((r) => (
                        <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Subscription Status */}
            <FormControl size="small" sx={{ minWidth: 170 }}>
                <InputLabel>Subscription</InputLabel>
                <Select value={filters.subscriptionStatus} label="Subscription" onChange={handleChange("subscriptionStatus")}>
                    {SUBSCRIPTION_STATUSES.map((s) => (
                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Plan */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Plan</InputLabel>
                <Select value={filters.plan} label="Plan" onChange={handleChange("plan")}>
                    {PLANS.map((p) => (
                        <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Sort By */}
            <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Sort By</InputLabel>
                <Select value={filters.sortBy} label="Sort By" onChange={handleChange("sortBy")}
                    startAdornment={<FilterList fontSize="small" sx={{ ml: 1, color: "text.secondary" }} />}
                >
                    {SORT_FIELDS.map((s) => (
                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Sort Direction toggle */}
            <Tooltip title={`Currently: ${filters.sortOrder === "asc" ? "A → Z / Oldest first" : "Z → A / Newest first"}`}>
                <Button
                    variant="outlined"
                    size="small"
                    onClick={toggleSortOrder}
                    startIcon={<SwapVert />}
                    sx={{ height: 40, whiteSpace: "nowrap" }}
                >
                    {filters.sortOrder === "asc" ? "Asc" : "Desc"}
                </Button>
            </Tooltip>

            {/* Reset */}
            {hasActiveFilters && (
                <Button
                    variant="text"
                    size="small"
                    color="error"
                    onClick={onReset}
                    sx={{ height: 40, whiteSpace: "nowrap" }}
                >
                    Clear Filters
                </Button>
            )}
        </Box>
    );
}
