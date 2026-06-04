import React from "react";
import {
    Box,
    Chip,
    IconButton,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { Delete, Edit, Visibility } from "@mui/icons-material";

const getRoleColor = (role) => {
    switch ((role || "").toLowerCase()) {
        case "admin":    return "error";
        case "subadmin": return "warning";
        default:         return "default";
    }
};

const getStatusColor = (status) => (status === "Active" ? "success" : "default");

export default function UserTable({ rows, totalPages, page, onPageChange, onAction }) {
    return (
        <Box>
            <TableContainer component={Paper} sx={{ overflowX: "auto", borderRadius: 3 }}>
                <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Subscription</TableCell>
                            <TableCell>Plan</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((row) => (
                                <TableRow key={row.id} hover>
                                    <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.role}
                                            color={getRoleColor(row.role)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            color={getStatusColor(row.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={row.subscription}
                                            color={row.subscription === "active" ? "success" : "default"}
                                            size="small"
                                            sx={{ textTransform: "capitalize" }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textTransform: "capitalize" }}>
                                        {row.plan}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => onAction(row, "view")} size="small">
                                            <Visibility />
                                        </IconButton>
                                        <IconButton size="small" disabled>
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => onAction(row, "delete")}
                                            size="small"
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 6, color: "text.secondary" }}>
                                    No users found matching the current filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => onPageChange(value)}
                        color="primary"
                        shape="rounded"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Box>
    );
}
