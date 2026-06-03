import { ExpandMore } from "@mui/icons-material";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import RevenueTable from "./RevenueTable";

const PLAN_META = {
  basic: { label: "Basic Plan", color: "#2e7d32", bg: "#edf7ee" },
  professional: { label: "Professional Plan", color: "#1565c0", bg: "#eef4ff" },
  advanced: { label: "Advanced Plan", color: "#c62828", bg: "#fdecea" },
};

const formatMoney = (value) =>
  `$${Number(value ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function PlanBreakdownCard({
  plan,
  rows,
  summary,
  year,
  status,
}) {
  const [open, setOpen] = useState(false);
  const meta = PLAN_META[plan];

  const planRevenue = summary?.[plan]?.totalRevenue ?? 0;
  const planTxns = summary?.[plan]?.transactions ?? 0;

  return (
    <Box
      sx={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #ebebeb",
        overflow: "hidden",
        transition: "box-shadow .2s ease, transform .2s ease",
        boxShadow: open
          ? "0 8px 28px rgba(0,0,0,0.09)"
          : "0 2px 8px rgba(0,0,0,0.04)",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* ── Header row ── */}
      <Box
        onClick={() => setOpen((p) => !p)}
        sx={{
          display: "grid",
          // dot | label | spacer | revenue | transactions | chevron
          gridTemplateColumns: "28px 1fr auto auto auto",
          gap: { xs: 2, sm: 3 },
          px: { xs: 2, md: 3 },
          minHeight: 80, // ← fixed row height — every card identical
          py: 0,
          alignItems: "center", // ← center items vertically
          cursor: "pointer",
          background: open
            ? `linear-gradient(135deg, ${meta.color}14, ${meta.bg})`
            : "#fff",
          borderBottom: open ? "1px solid #f0f0f0" : "none",
          transition: "background 0.15s",
          "&:hover": { backgroundColor: meta.bg },
        }}
      >
        {/* 1 — Status dot */}
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: meta.color,
            boxShadow: `0 0 0 4px ${meta.color}22`,
            justifySelf: "center",
          }}
        />

        {/* 2 — Plan label */}
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 14.5,
              color: "#1a1a2e",
              lineHeight: 1.3,
            }}
          >
            {meta.label}
          </Typography>
          <Typography
            sx={{ fontSize: 12, color: "#aaa", mt: 0.2, lineHeight: 1 }}
          >
            Monthly performance details
          </Typography>
        </Box>

      {/* Stats section — labels row + values row, perfectly aligned */}
<Box sx={{ display: "flex", alignItems: "stretch", gap: 0 }}>

  {/* Revenue column */}
  <Box sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: 120,
    px: 2,
    borderLeft: "1px solid #f0f0f0",
  }}>
    <Typography sx={{
      textTransform: "uppercase",
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: "0.9px",
      color: "#b0b8c4",
      lineHeight: 1,
      mb: 1,
    }}>
      Revenue
    </Typography>
    <Box sx={{
      display: "inline-flex",
      alignItems: "center",
      px: 1.6,
      py: 0.5,
      borderRadius: "999px",
      background: meta.bg,
      border: `1px solid ${meta.color}30`,
    }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: meta.color, lineHeight: 1 }}>
        {formatMoney(planRevenue)}
      </Typography>
    </Box>
  </Box>

  {/* Transactions column */}
  <Box sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: 110,
    px: 2,
    borderLeft: "1px solid #f0f0f0",
  }}>
    <Typography sx={{
      textTransform: "uppercase",
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: "0.9px",
      color: "#b0b8c4",
      lineHeight: 1,
      mb: 1,
    }}>
      Transactions
    </Typography>
    <Typography sx={{ fontWeight: 800, fontSize: 16, color: "#1a1a2e", lineHeight: 1 }}>
      {Number(planTxns).toLocaleString("en-US")}
    </Typography>
  </Box>

</Box>

        {/* 5 — Chevron */}
        <IconButton
          size="small"
          sx={{
            color: "#9ca3af",
            transition: "transform 0.25s",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ExpandMore fontSize="small" />
        </IconButton>
      </Box>

      {/* ── Collapsible body ── */}
      <Collapse in={open} unmountOnExit>
        <Box
          sx={{
            p: { xs: 1.5, md: 2 },
            background: "linear-gradient(to bottom, #fafafa, #ffffff)",
          }}
        >
          <RevenueTable
            rows={rows}
            summary={summary}
            plan={plan}
            title={`${meta.label} – Monthly Breakdown`}
            year={year}
            status={status}
          />
        </Box>
      </Collapse>
    </Box>
  );
}
