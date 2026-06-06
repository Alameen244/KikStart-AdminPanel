import { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Collapse,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  ReceiptLong as ReceiptIcon,
} from "@mui/icons-material";
import TransactionHistory from "./TransactionHistory";
import {
  capitalize,
  formatAmount,
  getAvatarColor,
  getInitials,
  planColor,
  statusColor,
} from "./subscriptionUtils";

export default function UserRow({ user }) {
  const [open, setOpen] = useState(false);
  const { color: sc, bg: sb } = statusColor(user.subscription?.status);
  const { color: pc, bg: pb } = planColor(user.subscription?.plan);
  const avatarColor = getAvatarColor(user.email);

  return (
    <>
      <TableRow
        sx={{
          cursor: "pointer",
          "&:hover": { backgroundColor: "#fafafa" },
          transition: "background 0.15s",
          "& td": { borderBottom: open ? "none" : undefined },
        }}
        onClick={() => setOpen((previous) => !previous)}
      >
        <TableCell sx={{ width: 44, pr: 0 }}>
          <IconButton size="small" sx={{ color: "#aaa" }}>
            {open ? (
              <ArrowUpIcon fontSize="small" />
            ) : (
              <ArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Avatar
              sx={{
                width: 34,
                height: 34,
                fontSize: 13,
                fontWeight: 700,
                backgroundColor: avatarColor,
              }}
            >
              {getInitials(user.name, user.email)}
            </Avatar>
            <Box>
              {user.name && (
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1a1a2e",
                    lineHeight: 1.2,
                  }}
                >
                  {user.name}
                </Typography>
              )}
              <Typography sx={{ fontSize: 12, color: "#888" }}>
                {user.email}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        <TableCell>
          <Chip
            label={capitalize(user.subscription?.plan)}
            size="small"
            sx={{
              backgroundColor: pb,
              color: pc,
              fontWeight: 600,
              fontSize: 12,
              height: 24,
              borderRadius: "6px",
            }}
          />
        </TableCell>

        <TableCell>
          <Chip
            label={capitalize(user.subscription?.status)}
            size="small"
            sx={{
              backgroundColor: sb,
              color: sc,
              fontWeight: 600,
              fontSize: 12,
              height: 24,
              borderRadius: "6px",
            }}
          />
        </TableCell>

        <TableCell>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>
            {formatAmount(user.totalPaid)}
          </Typography>
        </TableCell>

        <TableCell>
          <Tooltip title="Total transactions">
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <ReceiptIcon sx={{ fontSize: 15, color: "#aaa" }} />
              <Typography sx={{ fontSize: 13, color: "#555" }}>
                {user.transactionCount}
              </Typography>
            </Stack>
          </Tooltip>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <TransactionHistory userId={user._id} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
