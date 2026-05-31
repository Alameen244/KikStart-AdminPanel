import {
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

const MONTHS = [
    { value: 1,  label: "January"   },
    { value: 2,  label: "February"  },
    { value: 3,  label: "March"     },
    { value: 4,  label: "April"     },
    { value: 5,  label: "May"       },
    { value: 6,  label: "June"      },
    { value: 7,  label: "July"      },
    { value: 8,  label: "August"    },
    { value: 9,  label: "September" },
    { value: 10, label: "October"   },
    { value: 11, label: "November"  },
    { value: 12, label: "December"  },
];

const generateYears = () => {
    const current = new Date().getFullYear();
    const years = [];
    for (let y = 2026; y <= current; y++) years.push(y);
    return years;
};

const AnalyticsFilterBar = ({ filters, onChange }) => {
    const years = generateYears();

    const handleView = (_, newView) => {
        if (!newView) return;
        onChange({ ...filters, view: newView });
    };

    return (
        <Box
            sx={{
                display:      "flex",
                alignItems:   "center",
                gap:          2,
                flexWrap:     "wrap",
                p:            2.5,
                mb:           3,
                bgcolor:      "#fff",
                borderRadius: 2,
                boxShadow:    "0 1px 4px rgba(0,0,0,0.08)",
                border:       "1px solid #f0f0f0",
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 1 }}>
                <CalendarMonth sx={{ color: "#e53935", fontSize: 20 }} />
                <Typography variant="body2" fontWeight={600} sx={{ color: "#333", whiteSpace: "nowrap" }}>
                    Filter by
                </Typography>
            </Box>

            {/* Year */}
            <FormControl size="small" sx={{ minWidth: 110 }}>
                <InputLabel>Year</InputLabel>
                <Select
                    value={filters.year}
                    label="Year"
                    onChange={(e) => onChange({ ...filters, year: e.target.value })}
                >
                    {years.map((y) => (
                        <MenuItem key={y} value={y}>{y}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Month — faded when yearly view */}
            <FormControl
                size="small"
                sx={{
                    minWidth: 140,
                    opacity:  filters.view === "yearly" ? 0.4 : 1,
                    pointerEvents: filters.view === "yearly" ? "none" : "auto",
                    transition: "opacity 0.2s",
                }}
            >
                <InputLabel>Month</InputLabel>
                <Select
                    value={filters.month}
                    label="Month"
                    onChange={(e) => onChange({ ...filters, month: e.target.value })}
                >
                    {MONTHS.map((m) => (
                        <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* View toggle */}
            <ToggleButtonGroup
                value={filters.view}
                exclusive
                onChange={handleView}
                size="small"
                sx={{
                    ml: "auto",
                    "& .MuiToggleButton-root": {
                        px: 2.5,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        borderColor: "#e0e0e0",
                        color: "#666",
                        "&.Mui-selected": {
                            bgcolor: "#e53935",
                            color: "#fff",
                            borderColor: "#e53935",
                            "&:hover": { bgcolor: "#c62828" },
                        },
                    },
                }}
            >
                <ToggleButton value="monthly">Monthly</ToggleButton>
                <ToggleButton value="yearly">Yearly</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};

export default AnalyticsFilterBar;
