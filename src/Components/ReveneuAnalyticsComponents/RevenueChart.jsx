import { Box, Skeleton, Typography } from "@mui/material";
import { BarChart } from "@mui/icons-material";
import ReactApexChart from "react-apexcharts";

const RevenueChart = ({ data, loading, view, year }) => {
    const categories = view === "yearly"
        ? (data ?? []).map((d) => String(d.year))
        : (data ?? []).map((d) => d.month);

    const revenueValues      = (data ?? []).map((d) => d.revenue      ?? 0);
    const transactionValues  = (data ?? []).map((d) => d.transactions ?? 0);

    const options = {
        chart: {
            type:    "bar",
            toolbar: { show: false },
            fontFamily: "inherit",
        },
        plotOptions: {
            bar: {
                borderRadius:    6,
                columnWidth:     "50%",
                dataLabels:      { position: "top" },
            },
        },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: {
            categories,
            axisBorder: { show: false },
            axisTicks:  { show: false },
            labels: { style: { colors: "#888", fontSize: "12px" } },
        },
        yaxis: [
            {
                title:  { text: "Revenue ($)", style: { color: "#888" } },
                labels: {
                    style: { colors: "#888" },
                    formatter: (v) => `$${v}`,
                },
            },
            {
                opposite: true,
                title:    { text: "Transactions", style: { color: "#888" } },
                labels:   { style: { colors: "#888" } },
            },
        ],
        fill:    { opacity: 1 },
        tooltip: {
            y: [
                { formatter: (v) => `$${v.toFixed(2)}` },
                { formatter: (v) => `${v} txns` },
            ],
        },
        colors:  ["#e53935", "#1976d2"],
        grid: {
            borderColor: "#f0f0f0",
            strokeDashArray: 4,
        },
        legend: {
            position:             "top",
            horizontalAlign:      "right",
            labels:               { colors: "#555" },
        },
    };

    const series = [
        { name: "Revenue",      data: revenueValues     },
        { name: "Transactions", data: transactionValues },
    ];

    return (
        <Box
            sx={{
                bgcolor:      "#fff",
                borderRadius: 2.5,
                p:            3,
                boxShadow:    "0 1px 4px rgba(0,0,0,0.08)",
                border:       "1px solid #f0f0f0",
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}>
                <Box sx={{ bgcolor: "#fdecea", borderRadius: 1.5, p: 0.8, display: "flex" }}>
                    <BarChart sx={{ color: "#e53935", fontSize: 20 }} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#1a1a2e", lineHeight: 1 }}>
                        Revenue Over Time
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                        {view === "yearly" ? "All years" : `Monthly breakdown — ${year}`}
                    </Typography>
                </Box>
            </Box>

            {loading ? (
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
            ) : (
                <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={300}
                />
            )}
        </Box>
    );
};

export default RevenueChart;
