import { Box, IconButton, Paper, TableCell, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";

export const PageShell = styled(Box)({
  maxWidth: "1280px",
  margin: "0 auto",
});

export const HeaderRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,
  marginBottom: 24,
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

export const FilterRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 16,
  marginBottom: 20,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "stretch",
  },
}));

export const TableCard = styled(Paper)(() => ({
  borderRadius: 24,
  border: "1px solid rgba(43, 43, 43, 0.08)",
  boxShadow: "0 18px 40px rgba(43, 43, 43, 0.06)",
  overflow: "hidden",
}));

export const HeaderCell = styled(TableCell)(() => ({
  fontWeight: 700,
  color: "#2B2B2B",
  backgroundColor: "rgba(237, 28, 36, 0.06)",
  borderBottom: "1px solid rgba(43, 43, 43, 0.08)",
}));

export const BodyRow = styled(TableRow)(() => ({
  "&:hover": {
    backgroundColor: "rgba(237, 28, 36, 0.03)",
  },
}));

export const BodyCell = styled(TableCell)(() => ({
  borderBottom: "1px solid rgba(43, 43, 43, 0.08)",
  color: "#2B2B2B",
}));

export const AssignIconButton = styled(IconButton)(() => ({
  width: 34,
  height: 34,
  borderRadius: 10,
  border: "1px dashed rgba(237, 28, 36, 0.5)",
  color: "#ED1C24",
}));

export const RoleCellButton = styled("button")(() => ({
  border: "none",
  background: "rgba(237, 28, 36, 0.06)",
  borderRadius: 999,
  padding: "8px 14px",
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
}));

export const ActionStack = styled(Box)(() => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
}));

export const StateCard = styled(Paper)(() => ({
  padding: 24,
  borderRadius: 20,
  textAlign: "center",
}));
