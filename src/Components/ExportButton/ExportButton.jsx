import { Button, CircularProgress } from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";

export default function ExportButton({
  loading = false,
  disabled = false,
  onClick,
  label = "Export PDF",
  height = 42,
  px = "16px",
}) {
  return (
    <Button
      variant="contained"
      startIcon={
        loading ? (
          <CircularProgress size={16} color="inherit" />
        ) : (
          <FileDownloadOutlined />
        )
      }
      onClick={onClick}
      disabled={loading || disabled}
      sx={{
        height: height,
        px: px,

        borderRadius: "16px",

      background: "linear-gradient(135deg, #8582ad, #575775)",

        "&:hover": {
          background: "linear-gradient(135deg, #8fb8b5 0%, #587270 100%)",
        },

        boxShadow: "0 12px 30px rgba(99,102,241,.25);",
        color: "#fff",

        fontWeight: 700,

        border: "1px solid rgba(255,255,255,.1)",

        position: "relative",

        overflow: "hidden",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent)",
          transition: ".7s",
        },

        "&:hover::before": {
          left: "100%",
        },
      }}
    >
      {loading ? "Exporting..." : label}
    </Button>
  );
}
