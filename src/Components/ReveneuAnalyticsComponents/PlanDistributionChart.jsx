import { Box, Chip, Skeleton, Typography } from "@mui/material";
import { DonutLarge } from "@mui/icons-material";
import ReactApexChart from "react-apexcharts";

const PLAN_COLORS = {
    basic:        "#1976d2",
    professional: "#e53935",
    advanced:     "#4caf50",
};

const PLAN_LABELS = {
    basic:        "Basic",
    professional: "Professional",
    advanced:     "Advanced",
};

const PlanDistributionChart = ({ data, loading }) => {
    const series     = (data ?? []).map((d) => d.percentage);
    const labels     = (data ?? []).map((d) => PLAN_LABELS[d.plan] ?? d.plan);
    const colors     = (data ?? []).map((d) => PLAN_COLORS[d.plan] ?? "#999");
    const hasData    = series.some((v) => v > 0);

    const options = {
        chart:  { type: "donut", fontFamily: "inherit" },
        labels,
        colors,
        legend: { show: false },
        dataLabels: {
            enabled:   true,
            formatter: (val) => `${Number(val).toFixed(1)}%`,
            style:     { fontSize: "13px", fontWeight: 700 },
            dropShadow: { enabled: false },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: "65%",
                    labels: {
                        show: true,
                        total: {
                            show:      true,
                            label:     "Total",
                            color:     "#888",
                            fontSize:  "13px",
                            formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) + "%",
                        },
                    },
                },
            },
        },
        stroke:  { width: 0 },
        tooltip: { y: { formatter: (v) => `${v}%` } },
    };

    return (
        <Box
            sx={{
                bgcolor:      "#fff",
                borderRadius: 2.5,
                p:            3,
                boxShadow:    "0 1px 4px rgba(0,0,0,0.08)",
                border:       "1px solid #f0f0f0",
                height:       "100%",
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                <Box sx={{ bgcolor: "#fdecea", borderRadius: 1.5, p: 0.8, display: "flex" }}>
                    <DonutLarge sx={{ color: "#e53935", fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1a1a2e", lineHeight: 1 }}>
                        Plan Distribution
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                        % of subscribers per plan
                    </Typography>
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Skeleton variant="circular" width={200} height={200} />
                </Box>
            ) : !hasData ? (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200 }}>
                    <Typography variant="body2" sx={{ color: "#bbb" }}>No data for this period</Typography>
                </Box>
            ) : (
                <>
                    <ReactApexChart options={options} series={series} type="donut" height={240} />

                    {/* Custom legend with revenue */}
                    <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.2 }}>
                        {(data ?? []).map((d) => (
                            <Box
                                key={d.plan}
                                sx={{
                                    display:      "flex",
                                    alignItems:   "center",
                                    justifyContent: "space-between",
                                    px:           1.5,
                                    py:           1,
                                    borderRadius: 1.5,
                                    bgcolor:      "#fafafa",
                                    border:       "1px solid #f0f0f0",
                                }}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: PLAN_COLORS[d.plan] }} />
                                    <Typography variant="body2" fontWeight={600} sx={{ color: "#333", textTransform: "capitalize" }}>
                                        {d.plan}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <Chip
                                        label={`${d.count} users`}
                                        size="small"
                                        sx={{ bgcolor: "#f0f0f0", fontSize: "0.7rem", height: 20 }}
                                    />
                                    <Typography variant="body2" fontWeight={700} sx={{ color: "#1a1a2e", minWidth: 55, textAlign: "right" }}>
                                        ${d.revenue.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
};

export default PlanDistributionChart;
