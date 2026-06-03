import {
  ArrowDownward,
  ArrowUpward,
  Download,
  UnfoldMore,
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useMemo, useState } from "react";

const PLAN_COLORS = {
  basic: "#2e7d32",
  professional: "#1565c0",
  advanced: "#c62828",
};

const fmt = (n) =>
  `$${Number(n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
const fmtN = (n) => Number(n ?? 0).toLocaleString("en-US");
const isZero = (n) => !n || Number(n) === 0;

const ALL_COLS = [
  "Month",
  "Basic",
  "Professional",
  "Advanced",
  "Total Revenue",
  "Transactions",
  "Avg/Sub",
];
const PLAN_COLS = ["Month", "Revenue", "Transactions", "Avg/Sub"];

const sx = {
  wrapper: {
    background: "#fff",
    borderRadius: "12px",
    border: "1px solid #ebebeb",
    overflow: "hidden",
  },
  titleBar: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    px: { xs: 2, md: 2.5 },
    py: 1.75,
    borderBottom: "1px solid #f0f0f0",
    marginLeft: "16px",
  },
  title: {
    fontWeight: 700,
    fontSize: 14,
    color: "#1a1a2e",
    flex: 1,
  },
  planBadge: (plan) => ({
    fontSize: 11,
    fontWeight: 700,
    px: 1,
    py: 0.3,
    borderRadius: "5px",
    textTransform: "capitalize",
    letterSpacing: "0.3px",
    color: PLAN_COLORS[plan],
    background: `${PLAN_COLORS[plan]}15`,
  }),
  csvBtn: {
    ml: "auto",
    textTransform: "none",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: "8px",
    borderColor: "#e8e8e8",
    color: "#777",
    py: 0.5,
    px: 1.5,
    gap: 0.5,
    "&:hover": {
      borderColor: "#bbb",
      color: "#1a1a2e",
      backgroundColor: "transparent",
    },
  },
  headRow: { backgroundColor: "#fafafa" },
  headCell: {
    color: "#aaa",
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    py: 1.5,
    px: { xs: 1.5, md: 2.5 },
    borderBottom: "1px solid #f0f0f0",
    whiteSpace: "nowrap",
  },
  sortBtn: {
    color: "#ccc",
    p: 0,
    ml: 0.3,
    minWidth: 0,
    verticalAlign: "middle",
    "& svg": { fontSize: "13px !important" },
    "&:hover": { color: "#1a1a2e", backgroundColor: "transparent" },
  },
  cell: (zero) => ({
    fontSize: 13,
    color: zero ? "#d0d0d0" : "#555",
    py: 1.4,
    px: { xs: 1.5, md: 2.5 },
    borderBottom: "1px solid #f7f7f7",
    whiteSpace: "nowrap",
  }),
  monthCell: {
    fontSize: 13,
    fontWeight: 600,
    color: "#1a1a2e",
    py: 1.4,
    px: { xs: 1.5, md: 2.5 },
    borderBottom: "1px solid #f7f7f7",
    whiteSpace: "nowrap",
  },
  totalCell: (zero) => ({
    fontSize: 13,
    fontWeight: 700,
    color: zero ? "#d0d0d0" : "#1a1a2e",
    py: 1.4,
    px: { xs: 1.5, md: 2.5 },
    borderBottom: "1px solid #f7f7f7",
    whiteSpace: "nowrap",
  }),
  footerRow: { backgroundColor: "#fafafa" },
  footerCell: {
    fontWeight: 700,
    fontSize: 12,
    color: "#1a1a2e",
    borderTop: "1px solid #ebebeb",
    borderBottom: 0,
    py: 1.5,
    px: { xs: 1.5, md: 2.5 },
    whiteSpace: "nowrap",
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
};

export default function RevenueTable({
  rows = [],
  summary,
  plan = null,
  title,
  year,
  status,
}) {
  const [sortBy, setSortBy] = useState(null);
  const [sortDir, setSortDir] = useState("desc");

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else {
      setSortBy(col);
      setSortDir("desc");
    }
  };

  const displayRows = useMemo(() => {
    const data = [...rows];
    if (sortBy) {
      data.sort((a, b) => {
        const va = plan ? (a[plan]?.[sortBy] ?? 0) : (a[sortBy] ?? 0);
        const vb = plan ? (b[plan]?.[sortBy] ?? 0) : (b[sortBy] ?? 0);
        return sortDir === "desc" ? vb - va : va - vb;
      });
    }
    return data;
  }, [rows, sortBy, sortDir, plan]);

  const handlePDF = () => {
    const doc = new jsPDF({ orientation: plan ? "portrait" : "landscape" });

    // ── Title ──────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(26, 26, 46);
    doc.text(title ?? "Revenue Report", 14, 18);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text([year, status, plan].filter(Boolean).join(" · "), 14, 25);

    // ── Rows ───────────────────────────────────────────────────────
    const tableRows = displayRows.map((r) =>
      plan
        ? [
            r.month,
            fmt(r[plan]?.totalRevenue ?? 0),
            fmtN(r[plan]?.transactions ?? 0),
            fmt(r[plan]?.avgPerSubscriber ?? 0),
          ]
        : [
            r.month,
            fmt(r.basic?.totalRevenue ?? 0),
            fmt(r.professional?.totalRevenue ?? 0),
            fmt(r.advanced?.totalRevenue ?? 0),
            fmt(r.totalRevenue ?? 0),
            fmtN(r.transactions ?? 0),
            fmt(r.avgPerSubscriber ?? 0),
          ],
    );

    // ── Footer ─────────────────────────────────────────────────────
    const footerRow = plan
      ? [
          "Total",
          fmt(summary?.[plan]?.totalRevenue ?? 0),
          fmtN(summary?.[plan]?.transactions ?? 0),
          fmt(summary?.[plan]?.avgPerSubscriber ?? 0),
        ]
      : [
          "Total",
          fmt(summary?.basic?.totalRevenue ?? 0),
          fmt(summary?.professional?.totalRevenue ?? 0),
          fmt(summary?.advanced?.totalRevenue ?? 0),
          fmt(summary?.totalRevenue ?? 0),
          fmtN(summary?.transactions ?? 0),
          fmt(summary?.avgPerSubscriber ?? 0),
        ];

    // ── Headers ────────────────────────────────────────────────────
    const headers = plan
      ? ["Month", "Revenue", "Transactions", "Avg/Sub"]
      : [
          "Month",
          "Basic",
          "Professional",
          "Advanced",
          "Total Revenue",
          "Transactions",
          "Avg/Sub",
        ];

    // ── Column widths ──────────────────────────────────────────────
    // Portrait (210mm) usable = 210 - 14 - 14 = 182mm  → 4 cols
    // Landscape (297mm) usable = 297 - 14 - 14 = 269mm → 7 cols
    const planColStyles = {
      0: { cellWidth: 40, halign: "left", fontStyle: "bold" }, // 40
      1: { cellWidth: 47, halign: "right" }, // 87
      2: { cellWidth: 47, halign: "right" }, // 134
      3: { cellWidth: 48, halign: "right" }, // 182 fits portrait
    };

    const allColStyles = {
      0: { cellWidth: 25, halign: "left", fontStyle: "bold" }, // 25
      1: { cellWidth: 34, halign: "right" }, // 59
      2: { cellWidth: 40, halign: "right" }, // 99
      3: { cellWidth: 34, halign: "right" }, // 133
      4: { cellWidth: 38, halign: "right", fontStyle: "bold" }, // 171
      5: { cellWidth: 34, halign: "right" }, // 205
      6: { cellWidth: 64, halign: "right" }, // 269 ✅ fits landscape
    };

    autoTable(doc, {
      startY: 30,
      head: [headers],
      body: tableRows,
      foot: [footerRow],

      // columnStyles defined ONCE here only
      columnStyles: plan ? planColStyles : allColStyles,

      headStyles: {
        fillColor: [26, 26, 46],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
        halign: "right",
        cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
      },

      bodyStyles: {
        fontSize: 9,
        textColor: [80, 80, 80],
        cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
      },

      footStyles: {
        fontSize: 9,
        cellPadding: { top: 5, bottom: 5, left: 4, right: 4 },
        // halign: "right",
      },

      // No alternateRowStyles — handled manually below
      alternateRowStyles: { fillColor: [255, 255, 255] },

      didParseCell(data) {
        // Left-align Month header
        if (data.section === "head" && data.column.index === 0) {
          data.cell.styles.halign = "left";
        }

        // Highlight non-zero rows
        if (data.section === "body") {
          const rowData = displayRows[data.row.index];
          const rowTotal = plan
            ? rowData?.[plan]?.totalRevenue
            : rowData?.totalRevenue;
          if (rowTotal && Number(rowTotal) !== 0) {
            data.cell.styles.fillColor = [255, 253, 245];
          }
        }

        // Footer styling
        if (data.section === "foot") {
          const styles = plan ? planColStyles : allColStyles;

          if (styles[data.column.index]?.halign) {
            data.cell.styles.halign = styles[data.column.index].halign;
          }
          data.cell.styles.textColor = [229, 57, 53];
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [250, 250, 250];
        }
      },

      showFoot: "lastPage",
      margin: { top: 30, left: 14, right: 14 },
      tableLineColor: [235, 235, 235],
      tableLineWidth: 0.1,
    });

    doc.save(`revenue-${plan ?? "all"}-${year}-${status}.pdf`);
  };

  const SortIcon = ({ col }) => (
    <IconButton size="small" sx={sx.sortBtn} onClick={() => toggleSort(col)}>
      {sortBy === col ? (
        sortDir === "desc" ? (
          <ArrowDownward fontSize="inherit" />
        ) : (
          <ArrowUpward fontSize="inherit" />
        )
      ) : (
        <UnfoldMore fontSize="inherit" />
      )}
    </IconButton>
  );

  const cols = plan ? PLAN_COLS : ALL_COLS;

  return (
    <Box sx={sx.wrapper}>
      <Box sx={sx.titleBar}>
        <Typography sx={sx.title}>{title}</Typography>
        {plan && <Box sx={sx.planBadge(plan)}>{plan}</Box>}
        <Button
          variant="outlined"
          sx={sx.csvBtn}
          startIcon={<Download sx={{ fontSize: "14px !important" }} />}
          onClick={handlePDF}
        >
          Export CSV
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={sx.headRow}>
              {cols.map((col) => (
                <TableCell key={col} sx={sx.headCell}>
                  {col}
                  {(col === "Total Revenue" ||
                    col === "Revenue" ||
                    col === "Transactions") && (
                    <SortIcon
                      col={
                        col === "Transactions" ? "transactions" : "totalRevenue"
                      }
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {displayRows.map((row) => {
              const rowTotal = plan
                ? row[plan]?.totalRevenue
                : row.totalRevenue;
              const isActiveRow = !isZero(rowTotal);

              return (
                <TableRow
                  key={row.monthNum}
                  sx={{
                    backgroundColor: isActiveRow ? "#fffdf5" : "transparent",
                    "&:last-child td": { borderBottom: 0 },
                    "&:hover": {
                      backgroundColor: isActiveRow ? "#fff9e6" : "#fafafa",
                    },
                    transition: "background 0.12s",
                  }}
                >
                  <TableCell sx={sx.monthCell}>{row.month}</TableCell>

                  {plan ? (
                    <>
                      <TableCell
                        sx={sx.totalCell(isZero(row[plan]?.totalRevenue))}
                      >
                        {fmt(row[plan]?.totalRevenue)}
                      </TableCell>
                      <TableCell sx={sx.cell(isZero(row[plan]?.transactions))}>
                        {fmtN(row[plan]?.transactions)}
                      </TableCell>
                      <TableCell
                        sx={sx.cell(isZero(row[plan]?.avgPerSubscriber))}
                      >
                        {fmt(row[plan]?.avgPerSubscriber)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell sx={sx.cell(isZero(row.basic?.totalRevenue))}>
                        {fmt(row.basic?.totalRevenue)}
                      </TableCell>
                      <TableCell
                        sx={sx.cell(isZero(row.professional?.totalRevenue))}
                      >
                        {fmt(row.professional?.totalRevenue)}
                      </TableCell>
                      <TableCell
                        sx={sx.cell(isZero(row.advanced?.totalRevenue))}
                      >
                        {fmt(row.advanced?.totalRevenue)}
                      </TableCell>
                      <TableCell sx={sx.totalCell(isZero(row.totalRevenue))}>
                        {fmt(row.totalRevenue)}
                      </TableCell>
                      <TableCell sx={sx.cell(isZero(row.transactions))}>
                        {fmtN(row.transactions)}
                      </TableCell>
                      <TableCell sx={sx.cell(isZero(row.avgPerSubscriber))}>
                        {fmt(row.avgPerSubscriber)}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })}

            {summary && (
              <TableRow sx={sx.footerRow}>
                <TableCell sx={{ ...sx.footerCell, color: "#e53935" }}>
                  Total
                </TableCell>
                {plan ? (
                  <>
                    <TableCell sx={sx.footerCell}>
                      {fmt(summary[plan]?.totalRevenue)}
                    </TableCell>
                    <TableCell sx={sx.footerCell}>
                      {fmtN(summary[plan]?.transactions)}
                    </TableCell>
                    <TableCell sx={sx.footerCell}>
                      {fmt(summary[plan]?.avgPerSubscriber)}
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell sx={sx.footerCell}>
                      {fmt(summary.basic?.totalRevenue)}
                    </TableCell>
                    <TableCell sx={sx.footerCell}>
                      {fmt(summary.professional?.totalRevenue)}
                    </TableCell>
                    <TableCell sx={sx.footerCell}>
                      {fmt(summary.advanced?.totalRevenue)}
                    </TableCell>
                    <TableCell sx={{ ...sx.footerCell, color: "#e53935" }}>
                      {fmt(summary.totalRevenue)}
                    </TableCell>
                    <TableCell sx={sx.footerCell}>
                      {fmtN(summary.transactions)}
                    </TableCell>
                    <TableCell sx={sx.footerCell}>
                      {fmt(summary.avgPerSubscriber)}
                    </TableCell>
                  </>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
