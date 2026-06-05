import React, { useMemo, useState, useCallback } from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Typography,
} from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
    deleteUserById,
    exportAllUsers,
    getAllUsers,
    getUserById,
} from "../Apis/AuthApis/authApis";
import { exportUsersPDF } from "../Components/UserManagement/Exportuserspdf";
import UserFilters from "../Components/UserManagement/Userfilters";
import UserTable from "../Components/UserManagement/Usertable";
import UserViewDialog from "../Components/UserManagement/Userviewdialog";
import UserDeleteDialog from "../Components/UserManagement/Userdeletedialog";
import ExportButton from "../Components/ExportButton/ExportButton";

// ─── Default filter state ──────────────────────────────────────────────────────
const DEFAULT_FILTERS = {
    page:               1,
    limit:              20,
    search:             "",
    role:               "",
    subscriptionStatus: "",
    plan:               "",
    sortBy:             "createdAt",
    sortOrder:          "desc",
};

export default function UserManagement() {
    const queryClient = useQueryClient();

    // ── Filters + pagination state ──────────────────────────────────────────────
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [selectedRow, setSelectedRow] = useState(null);
    const [mode, setMode] = useState("");          // "view" | "delete" | ""
    const [isExporting, setIsExporting] = useState(false);

    // Merge partial updates and always reset to page 1 unless page is explicitly set
    const handleFilterChange = useCallback((updates) => {
        setFilters((prev) => ({ ...prev, ...updates }));
    }, []);

    const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

    // ── Check if any non-default filter is active ───────────────────────────────
    const hasActiveFilters = useMemo(() => (
        filters.search !== "" ||
        filters.role !== "" ||
        filters.subscriptionStatus !== "" ||
        filters.plan !== "" ||
        filters.sortBy !== "createdAt" ||
        filters.sortOrder !== "desc"
    ), [filters]);

    // ── Main users query — re-fetches on every filter change ────────────────────
    const {
        data: usersResponse,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["admin-users", filters],
        queryFn:  () => getAllUsers(filters),
        keepPreviousData: true,   // no blank flash on filter change
    });

    // ── Map API data → table rows ────────────────────────────────────────────────
    const rows = useMemo(
        () =>
            Array.isArray(usersResponse?.data)
                ? usersResponse.data.map((user) => ({
                      id:           user?._id,
                      name:         user?.name || "N/A",
                      email:        user?.email || "N/A",
                      phone:        user?.phone || "N/A",
                      location:     user?.location || "N/A",
                      pinCode:      user?.pinCode || "N/A",
                      role:         user?.role || "user",
                      status:       user?.isVerified ? "Active" : "Inactive",
                      subscription: user?.subscription?.status || "inactive",
                      plan:         user?.subscription?.plan || "N/A",
                      createdAt:    user?.createdAt,
                  }))
                : [],
        [usersResponse],
    );

    const totalPages = usersResponse?.totalPages ?? 1;
    const totalCount = usersResponse?.total ?? rows.length;

    // ── View user details query ──────────────────────────────────────────────────
    const userDetailsQuery = useQuery({
        queryKey: ["admin-user", selectedRow?.id],
        queryFn:  () => getUserById(selectedRow.id),
        enabled:  mode === "view" && Boolean(selectedRow?.id),
    });

    // ── Delete mutation ──────────────────────────────────────────────────────────
    const deleteMutation = useMutation({
        mutationFn: deleteUserById,
        onSuccess: (response) => {
            toast.success(response?.message || "User deleted successfully.");
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            handleClose();
        },
        onError: (mutationError) => {
            toast.error(mutationError?.response?.data?.message || "Failed to delete user.");
        },
    });

    // ── Dialog helpers ───────────────────────────────────────────────────────────
    const handleOpen  = (row, type) => { setSelectedRow(row); setMode(type); };
    const handleClose = () => { setSelectedRow(null); setMode(""); };
    const handleDelete = () => { if (selectedRow?.id) deleteMutation.mutate(selectedRow.id); };

    // ── PDF Export ───────────────────────────────────────────────────────────────
    const handleExport = async () => {
        setIsExporting(true);
        try {
            // Build export params — same filters, no pagination
            const { page, limit, ...exportParams } = filters;
            const response = await exportAllUsers(exportParams);

            if (!response?.data?.length) {
                toast.info("No users to export with current filters.");
                return;
            }

            exportUsersPDF(response.data, {
                search:             filters.search,
                role:               filters.role,
                subscriptionStatus: filters.subscriptionStatus,
                plan:               filters.plan,
            });

            toast.success(`Exported ${response.data.length} users as PDF.`);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Export failed.");
        } finally {
            setIsExporting(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────────
    return (
        <UserManagementContainer>
            {/* Header */}
            <Box
                sx={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                    mb:             3,
                    flexWrap:       "wrap",
                    gap:            1,
                }}
            >
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, color: "dark.main" }}>
                        User Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {isLoading
                            ? "Loading…"
                            : `Showing ${rows.length} of ${totalCount} users`}
                    </Typography>
                </Box>

               <ExportButton onClick={handleExport} loading={isExporting} />
            </Box>

            {/* Filters */}
            <UserFilters
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleReset}
                hasActiveFilters={hasActiveFilters}
            />

            {/* Table */}
            {isLoading ? (
                <CenteredState>
                    <CircularProgress />
                </CenteredState>
            ) : isError ? (
                <Alert severity="error">
                    {error?.response?.data?.message || "Failed to load users."}
                </Alert>
            ) : (
                <UserTable
                    rows={rows}
                    totalPages={totalPages}
                    page={filters.page}
                    onPageChange={(p) => handleFilterChange({ page: p })}
                    onAction={handleOpen}
                />
            )}

            {/* View Dialog */}
            <UserViewDialog
                open={mode === "view"}
                onClose={handleClose}
                userDetailsQuery={userDetailsQuery}
                fallbackUser={selectedRow}
            />

            {/* Delete Dialog */}
            <UserDeleteDialog
                open={mode === "delete"}
                onClose={handleClose}
                onConfirm={handleDelete}
                user={selectedRow}
                isPending={deleteMutation.isPending}
            />
        </UserManagementContainer>
    );
}

const UserManagementContainer = styled(Box)({
    maxWidth: "1200px",
    margin:   "0 auto",
});

const CenteredState = styled(Box)({
    minHeight:      "220px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
});
