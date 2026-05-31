import { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { QueryStats } from "@mui/icons-material";

import {
    getAnalyticsOverview,
    getRevenueChart,
    getPlanDistribution,
} from "../Apis/subsciptionApis/subsciptionApis";

import AnalyticsFilterBar from "../Components/ReveneuAnalyticsComponents/Analyticsfilterbar ";
import OverviewCards from "../Components/ReveneuAnalyticsComponents/OverviewCards";
import PlanDistributionChart from "../Components/ReveneuAnalyticsComponents/PlanDistributionChart";
import RevenueChart from "../Components/ReveneuAnalyticsComponents/RevenueChart";

const now = new Date();

const DEFAULT_FILTERS = {
    year:  now.getFullYear(),
    month: now.getMonth() + 1,   // 1-indexed
    view:  "monthly",
};

const RevenueAnalyticsPage = () => {
    const [filters, setFilters]   = useState(DEFAULT_FILTERS);

    const [overviewData,      setOverviewData]      = useState(null);
    const [chartData,         setChartData]         = useState(null);
    const [distributionData,  setDistributionData]  = useState(null);

    const [overviewLoading,     setOverviewLoading]     = useState(true);
    const [chartLoading,        setChartLoading]        = useState(true);
    const [distributionLoading, setDistributionLoading] = useState(true);

    // fetch overview + distribution whenever year/month/view changes
    useEffect(() => {
        const params = {
            year:  filters.year,
            month: filters.view === "yearly" ? null : filters.month,
        };

        setOverviewLoading(true);
        getAnalyticsOverview(params)
            .then((res) => setOverviewData(res?.data ?? null))
            .finally(() => setOverviewLoading(false));

        setDistributionLoading(true);
        getPlanDistribution(params)
            .then((res) => setDistributionData(res?.data ?? null))
            .finally(() => setDistributionLoading(false));
    }, [filters.year, filters.month, filters.view]);

    // fetch chart whenever year/view changes
    useEffect(() => {
        setChartLoading(true);
        getRevenueChart({ year: filters.year, view: filters.view })
            .then((res) => setChartData(res?.data ?? null))
            .finally(() => setChartLoading(false));
    }, [filters.year, filters.view]);

    return (
        <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f8f7f4", minHeight: "100vh" }}>

            {/* Page header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <QueryStats sx={{ color: "#e53935", fontSize: 28 }} />
                <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ color: "#1a1a2e", lineHeight: 1 }}>
                        Revenue Analytics
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#888" }}>
                        Track subscription revenue, growth and plan distribution
                    </Typography>
                </Box>
            </Box>

            {/* Filter bar */}
            <AnalyticsFilterBar filters={filters} onChange={setFilters} />

            {/* Stat cards */}
            <OverviewCards data={overviewData} loading={overviewLoading} />

            {/* Charts row */}
            <Grid container spacing={2.5}>
                <Grid item xs={12} md={8}>
                    <RevenueChart
                        data={chartData}
                        loading={chartLoading}
                        view={filters.view}
                        year={filters.year}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <PlanDistributionChart
                        data={distributionData}
                        loading={distributionLoading}
                    />
                </Grid>
            </Grid>

        </Box>
    );
};

export default RevenueAnalyticsPage;
