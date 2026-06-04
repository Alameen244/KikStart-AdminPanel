import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

export default function UserDeleteDialog({ open, onClose, onConfirm, user, isPending }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>Confirm Delete</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete{" "}
                    <strong>{user?.name}</strong>? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isPending}>
                    Cancel
                </Button>
                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                    disabled={isPending}
                >
                    {isPending ? "Deleting…" : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
