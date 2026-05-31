import { Box, Grid, Skeleton, Typography } from "@mui/material";
import {
    AttachMoney,
    PeopleAlt,
    Receipt,
    TrendingDown,
    TrendingUp,
} from "@mui/icons-material";

const CARDS = [
    {
        key:     "totalRevenue",
        label:   "Total Revenue",
        icon:    AttachMoney,
        color:   "#4caf50",
        bgColor: "#f0faf0",
        format:  (v) => `$${Number(v ?? 0).toFixed(2)}`,
    },
    {
        key:     "newSubscribers",
        label:   "New Subscribers",
        icon:    PeopleAlt,
        color:   "#1976d2",
        bgColor: "#e8f4fd",
        format:  (v) => v ?? 0,
    },
    {
        key:     "totalTransactions",
        label:   "Transactions",
        icon:    Receipt,
        color:   "#9c27b0",
        bgColor: "#f5eefa",
        format:  (v) => v ?? 0,
    },
    {
        key:     "activeSubscribers",
        label:   "Active Subscribers",
        icon:    PeopleAlt,
        color:   "#e53935",
        bgColor: "#fdecea",
        format:  (v) => v ?? 0,
    },
];

const GrowthBadge = ({ value }) => {
    if (value === null || value === undefined) return null;
    const positive = value >= 0;
    return (
        <Box
            sx={{
                display:      "inline-flex",
                alignItems:   "center",
                gap:          0.3,
                px:           1,
                py:           0.3,
                borderRadius: 10,
                bgcolor:      positive ? "#e8f5e9" : "#fdecea",
                mt:           0.5,
            }}
        >
            {positive
                ? <TrendingUp  sx={{ fontSize: 13, color: "#2e7d32" }} />
                : <TrendingDown sx={{ fontSize: 13, color: "#c62828" }} />
            }
            <Typography variant="caption" fontWeight={700}
                sx={{ color: positive ? "#2e7d32" : "#c62828" }}
            >
                {positive ? "+" : ""}{value}%
            </Typography>
        </Box>
    );
};

const OverviewCards = ({ data, loading }) => {
    return (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {CARDS.map((card) => {
                const Icon = card.icon;
                return (
                    <Grid item xs={12} sm={6} md={3} key={card.key}>
                        <Box
                            sx={{
                                bgcolor:      "#fff",
                                borderRadius: 2.5,
                                p:            2.5,
                                boxShadow:    "0 1px 4px rgba(0,0,0,0.08)",
                                border:       "1px solid #f0f0f0",
                                display:      "flex",
                                alignItems:   "flex-start",
                                gap:          2,
                                transition:   "box-shadow 0.2s",
                                "&:hover":    { boxShadow: "0 4px 16px rgba(0,0,0,0.10)" },
                            }}
                        >
                            {/* Icon bubble */}
                            <Box
                                sx={{
                                    width:        46,
                                    height:       46,
                                    borderRadius: 2,
                                    bgcolor:      card.bgColor,
                                    display:      "flex",
                                    alignItems:   "center",
                                    justifyContent: "center",
                                    flexShrink:   0,
                                }}
                            >
                                <Icon sx={{ color: card.color, fontSize: 22 }} />
                            </Box>

                            {/* Text */}
                            <Box>
                                <Typography variant="caption" sx={{ color: "#888", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>
                                    {card.label}
                                </Typography>

                                {loading ? (
                                    <Skeleton width={80} height={32} />
                                ) : (
                                    <Typography variant="h6" fontWeight={700} sx={{ color: "#1a1a2e", lineHeight: 1.2, mt: 0.2 }}>
                                        {card.format(data?.[card.key])}
                                    </Typography>
                                )}

                                {/* growth badge only on revenue card */}
                                {card.key === "totalRevenue" && !loading && (
                                    <GrowthBadge value={data?.revenueGrowth} />
                                )}
                            </Box>
                        </Box>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default OverviewCards;
