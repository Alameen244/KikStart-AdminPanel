import { useState } from "react";
import {
    Box,
    CircularProgress,
    Divider,
    ListItemIcon,
    Menu,
    MenuItem,
    Typography,
} from "@mui/material";
import {
    Download as DownloadIcon,
    TableChart as PageIcon,
    AllInbox as AllIcon,
} from "@mui/icons-material";
import ExportButton from "../../Components/ExportButton/ExportButton";

export default function SubscriptionExport({ onExportPage, onExportAll }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [loadingPage, setLoadingPage] = useState(false);
    const [loadingAll, setLoadingAll]   = useState(false);
    const open = Boolean(anchorEl);

    const handleExportPage = async () => {
        setAnchorEl(null);
        setLoadingPage(true);
        await onExportPage();
        setLoadingPage(false);
    };

    const handleExportAll = async () => {
        setAnchorEl(null);
        setLoadingAll(true);
        await onExportAll();
        setLoadingAll(false);
    };

    const isLoading = loadingPage || loadingAll;

    return (
        <Box>
            <ExportButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                disabled={isLoading}
                isLoading={isLoading}
                 fontSize="14px"
            />


            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        borderRadius: "12px",
                        mt: 0.5,
                        minWidth: 200,
                        border: "1px solid #f0f0f0",
                        "& .MuiMenuItem-root": {
                            fontSize: 13,
                            py: 1.2,
                            px: 2,
                            gap: 1,
                        },
                    },
                }}
            >
                <Typography sx={{ px: 2, py: 1, fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1 }}>
                    Export Options
                </Typography>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem onClick={handleExportPage}>
                    <ListItemIcon><PageIcon fontSize="small" sx={{ color: "#555" }} /></ListItemIcon>
                    Current Page
                </MenuItem>
                <MenuItem onClick={handleExportAll}>
                    <ListItemIcon><AllIcon fontSize="small" sx={{ color: "#555" }} /></ListItemIcon>
                    All Records
                </MenuItem>
            </Menu>
        </Box>
    );
}
