import { useCallback, useEffect, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { CreditScore as CreditScoreIcon } from "@mui/icons-material";
import { getAdminUsersSummary } from "../Apis/subsciptionApis/subsciptionApis";
import { exportSubscriptionsPDF } from "../Components/SubscriptionComponentFolder/subscriptionUtils";
import { SubscriptionStats, SubscriptionTable } from "../Components/SubscriptionComponentFolder";

const DEFAULT_FILTERS = {
    plan: "",
    subscriptionStatus: "",
    transactionStatus: "",
    sortBy: "totalPaid",
};

// sortBy uses a combined key for UX simplicity; split here for API
const resolveSortParams = (sortBy) => {
    if (sortBy === "totalPaidAsc")      return { sortBy: "totalPaid",        sortOrder: "asc" };
    if (sortBy === "transactionCount")  return { sortBy: "transactionCount", sortOrder: "desc" };
    if (sortBy === "name")              return { sortBy: "name",             sortOrder: "asc" };
    return                                     { sortBy: "totalPaid",        sortOrder: "desc" }; // default
};

export default function SubscriptionsPage() {
    const [users,      setUsers]      = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading,    setLoading]    = useState(true);
    const [page,       setPage]       = useState(1);
    const [filters,    setFilters]    = useState(DEFAULT_FILTERS);

    const fetchUsers = useCallback(async (pg, activeFilters) => {
        setLoading(true);
        try {
            const { sortBy, sortOrder } = resolveSortParams(activeFilters.sortBy);
            const res = await getAdminUsersSummary({
                page: pg,
                plan:               activeFilters.plan,
                subscriptionStatus: activeFilters.subscriptionStatus,
                transactionStatus:  activeFilters.transactionStatus,
                sortBy,
                sortOrder,
            });
            if (res?.success) {
                setUsers(res.data.users);
                setPagination(res.data.pagination);
            }
        } catch (err) {
            console.error("Failed to fetch users summary:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // reset to page 1 whenever filters change
    useEffect(() => {
        setPage(1);
    }, [filters]);

    useEffect(() => {
        fetchUsers(page, filters);
    }, [page, filters, fetchUsers]);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleFilterClear = () => setFilters(DEFAULT_FILTERS);

    // Export current page — users already in state
    const handleExportPage = async () => {
        exportSubscriptionsPDF(users, filters);
    };

    // Export all — fetch without pagination
    const handleExportAll = async () => {
        try {
            const { sortBy, sortOrder } = resolveSortParams(filters.sortBy);
            const res = await getAdminUsersSummary({
                exportAll: true,
                plan:               filters.plan,
                subscriptionStatus: filters.subscriptionStatus,
                transactionStatus:  filters.transactionStatus,
                sortBy,
                sortOrder,
            });
            if (res?.success) {
                exportSubscriptionsPDF(res.data.users, filters);
            }
        } catch (err) {
            console.error("Export all failed:", err);
        }
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                <CreditScoreIcon sx={{ fontSize: 26, color: "#1a1a2e" }} />
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a1a2e", fontSize: 22 }}>
                    Subscriptions
                </Typography>
            </Stack>

            <SubscriptionStats users={users} pagination={pagination} loading={loading} />

            <SubscriptionTable
                users={users}
                pagination={pagination}
                loading={loading}
                page={page}
                onPageChange={setPage}
                filters={filters}
                onFilterChange={handleFilterChange}
                onFilterClear={handleFilterClear}
                onExportPage={handleExportPage}
                onExportAll={handleExportAll}
            />
        </Box>
    );
}
