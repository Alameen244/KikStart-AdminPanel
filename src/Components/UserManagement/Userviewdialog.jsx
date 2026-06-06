import React from "react";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Typography,
} from "@mui/material";

const Detail = ({ label, value }) => (
    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "right", maxWidth: "60%" }}>
            {value || "N/A"}
        </Typography>
    </Box>
);

export default function UserViewDialog({ open, onClose, userDetailsQuery, fallbackUser }) {
    const user = userDetailsQuery.data?.data || fallbackUser;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>User Details</DialogTitle>
            <DialogContent>
                {userDetailsQuery.isLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                        <CircularProgress size={28} />
                    </Box>
                ) : userDetailsQuery.isError ? (
                    <Alert severity="error">
                        {userDetailsQuery.error?.response?.data?.message || "Failed to load user details."}
                    </Alert>
                ) : (
                    <Box sx={{ mt: 1 }}>
                        {/* Account */}
                        <Typography variant="overline" color="text.secondary">Account</Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Detail label="Name"     value={user?.name} />
                        <Detail label="Email"    value={user?.email} />
                        <Detail label="Phone"    value={user?.phone} />
                        <Detail label="Location" value={user?.location} />
                        <Detail label="Pin Code" value={user?.pinCode} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Role</Typography>
                            <Chip
                                label={user?.role || "user"}
                                size="small"
                                color={
                                    user?.role === "admin" ? "error" :
                                    user?.role === "subAdmin" ? "warning" : "default"
                                }
                            />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Status</Typography>
                            <Chip
                                label={user?.isVerified ? "Active" : user?.status || "Inactive"}
                                size="small"
                                color={user?.isVerified ? "success" : "default"}
                            />
                        </Box>

                        {/* Subscription */}
                        <Typography variant="overline" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                            Subscription
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.75 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>Sub Status</Typography>
                            <Chip
                                label={user?.subscription?.status || "inactive"}
                                size="small"
                                color={user?.subscription?.status === "active" ? "success" : "default"}
                                sx={{ textTransform: "capitalize" }}
                            />
                        </Box>
                        <Detail
                            label="Plan"
                            value={user?.subscription?.plan
                                ? user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1)
                                : "N/A"}
                        />
                        <Detail
                            label="Start Date"
                            value={user?.subscription?.startDate
                                ? new Date(user.subscription.startDate).toLocaleDateString()
                                : null}
                        />
                        <Detail
                            label="End Date"
                            value={user?.subscription?.endDate
                                ? new Date(user.subscription.endDate).toLocaleDateString()
                                : null}
                        />
                        <Detail
                            label="Joined"
                            value={user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : null}
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}       
