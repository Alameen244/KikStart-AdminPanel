import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    IconButton,
} from "@mui/material";
import { FilterAltOff as ClearIcon } from "@mui/icons-material";

const selectSx = {
    fontSize: 13,
    borderRadius: "10px",
    backgroundColor: "#fff",
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e8e8e8" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#bbb" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#1a1a2e" },
};

const labelSx = { fontSize: 13 };

export default function SubscriptionFilters({ filters, onChange, onClear }) {
    const hasActiveFilter =
        filters.plan || filters.subscriptionStatus || filters.transactionStatus || filters.sortBy !== "totalPaid";

    return (
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            {/* Plan */}
            <FormControl size="small" sx={{ minWidth: 130 }}>
                <InputLabel sx={labelSx}>Plan</InputLabel>
                <Select
                    value={filters.plan}
                    label="Plan"
                    onChange={(e) => onChange("plan", e.target.value)}
                    sx={selectSx}
                >
                    <MenuItem value="">All Plans</MenuItem>
                    <MenuItem value="basic">Basic</MenuItem>
                    <MenuItem value="professional">Professional</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
            </FormControl>

            {/* Subscription Status */}
            <FormControl size="small" sx={{ minWidth: 155 }}>
                <InputLabel sx={labelSx}>Sub. Status</InputLabel>
                <Select
                    value={filters.subscriptionStatus}
                    label="Sub. Status"
                    onChange={(e) => onChange("subscriptionStatus", e.target.value)}
                    sx={selectSx}
                >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
            </FormControl>

            {/* Transaction Status */}
            <FormControl size="small" sx={{ minWidth: 155 }}>
                <InputLabel sx={labelSx}>Tx. Status</InputLabel>
                <Select
                    value={filters.transactionStatus}
                    label="Tx. Status"
                    onChange={(e) => onChange("transactionStatus", e.target.value)}
                    sx={selectSx}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="unpaid">Unpaid</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
            </FormControl>

            {/* Sort By */}
            <FormControl size="small" sx={{ minWidth: 165 }}>
                <InputLabel sx={labelSx}>Sort By</InputLabel>
                <Select
                    value={filters.sortBy}
                    label="Sort By"
                    onChange={(e) => onChange("sortBy", e.target.value)}
                    sx={selectSx}
                >
                    <MenuItem value="totalPaid">Total Paid (High→Low)</MenuItem>
                    <MenuItem value="totalPaidAsc">Total Paid (Low→High)</MenuItem>
                    <MenuItem value="transactionCount">Most Transactions</MenuItem>
                    <MenuItem value="name">Name (A→Z)</MenuItem>
                </Select>
            </FormControl>

            {/* Clear filters */}
            {hasActiveFilter && (
                <Tooltip title="Clear all filters">
                    <IconButton
                        onClick={onClear}
                        size="small"
                        sx={{
                            border: "1px solid #e8e8e8",
                            borderRadius: "10px",
                            color: "#888",
                            "&:hover": { borderColor: "#e53e3e", color: "#e53e3e", backgroundColor: "transparent" },
                        }}
                    >
                        <ClearIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )}
        </Stack>
    );
}
