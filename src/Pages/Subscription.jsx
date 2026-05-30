import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Chip,
  Collapse,
  IconButton,
  Skeleton,
  Stack,
  Avatar,
  Tooltip,
  Button,
} from "@mui/material";
import {
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  ReceiptLong as ReceiptIcon,
  CreditScore as CreditScoreIcon,
  TrendingUp as TrendingUpIcon,
  Group as GroupIcon,
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import {
  getAdminUsersSummary,
  getAdminUserTransactions,
} from "../Apis/subsciptionApis/subsciptionApis";
import ReciptModal from "../../../frontEnd/src/Components/ReciptModal/ReciptModal";

// ─── helpers ────────────────────────────────────────────────────────────────

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount ?? 0,
  );

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const capitalize = (str) => str?.charAt(0).toUpperCase() + str?.slice(1) ?? "—";

const getInitials = (name, email) => {
  if (name)
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  return email?.[0]?.toUpperCase() ?? "?";
};

const AVATAR_COLORS = [
  "#1a1a2e",
  "#16213e",
  "#0f3460",
  "#533483",
  "#2b4162",
  "#12486b",
  "#1b4332",
  "#3d405b",
];

const getAvatarColor = (str) => {
  let hash = 0;
  for (let i = 0; i < (str?.length ?? 0); i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const planColor = (plan) => {
  switch (plan) {
    case "professional":
      return { color: "#5c35d4", bg: "#f0ebff" };
    case "advanced":
      return { color: "#b45309", bg: "#fef3c7" };
    case "basic":
      return { color: "#0369a1", bg: "#e0f2fe" };
    default:
      return { color: "#555", bg: "#f5f5f5" };
  }
};

const statusColor = (status) => {
  switch (status) {
    case "active":
      return { color: "#2e7d32", bg: "#edf7ee" };
    case "inactive":
      return { color: "#c62828", bg: "#fdecea" };
    case "cancelled":
      return { color: "#c62828", bg: "#fdecea" };
    default:
      return { color: "#555", bg: "#f5f5f5" };
  }
};

const txStatusColor = (status) => {
  switch (status) {
    case "paid":
      return { color: "#2e7d32", bg: "#edf7ee" };
    case "unpaid":
      return { color: "#b45309", bg: "#fef9ec" };
    case "cancelled":
      return { color: "#c62828", bg: "#fdecea" };
    default:
      return { color: "#555", bg: "#f5f5f5" };
  }
};

// ─── stat card ───────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, accent }) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 180,
        p: 2.5,
        borderRadius: "14px",
        border: "1px solid #f0f0f0",
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          backgroundColor: accent + "18",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 12, color: "#888", mb: 0.3 }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: "#1a1a2e",
            lineHeight: 1,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Paper>
  );
}

// ─── skeleton rows ───────────────────────────────────────────────────────────

function SkeletonRows({ cols }) {
  return Array.from({ length: 8 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: cols }).map((__, j) => (
        <TableCell key={j}>
          <Skeleton variant="text" width={j === 0 ? 180 : 90} height={20} />
        </TableCell>
      ))}
    </TableRow>
  ));
}

// ─── inner tx table ──────────────────────────────────────────────────────────

function UserTransactionRows({ userId }) {
  const [txData, setTxData] = useState([]);
  const [txPag, setTxPag] = useState(null);
  const [txPage, setTxPage] = useState(1);
  const [txLoading, setTxLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = (tx) => {
    setSelectedTx(tx);
    setModalOpen(true);
  };
  const handleClose = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedTx(null), 200);
  };
  const fetchTx = useCallback(
    async (pg) => {
      setTxLoading(true);
      try {
        const res = await getAdminUserTransactions({ userId, page: pg });
        if (res?.success) {
          setTxData(res.data.transactions);
          setTxPag(res.data.pagination);
        }
      } catch (err) {
        console.error("Failed to fetch user transactions:", err);
      } finally {
        setTxLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    fetchTx(txPage);
  }, [txPage, fetchTx]);

  return (
    <Box sx={{ px: 3, py: 2, backgroundColor: "#fafbff" }}>
      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: "#888",
          textTransform: "uppercase",
          letterSpacing: 1,
          mb: 1.5,
        }}
      >
        Transaction History
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "10px",
          border: "1px solid #eee",
          overflow: "hidden",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              {["Invoice ID", "Date", "Plan", "Amount", "Status" , "Recipt"].map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#777",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    py: 1.2,
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {txLoading ? (
              <SkeletonRows cols={5} />
            ) : txData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    textAlign: "center",
                    py: 3,
                    color: "#aaa",
                    fontSize: 13,
                  }}
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              txData.map((tx) => {
                const { color, bg } = txStatusColor(tx.status);
                const { color: pc, bg: pb } = planColor(tx.plan);
                return (
                  <TableRow
                    key={tx._id}
                    sx={{
                      "&:last-child td": { border: 0 },
                      "&:hover": { backgroundColor: "#f9f9ff" },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "#555",
                      }}
                    >
                      #{tx.stripeInvoiceId?.slice(-9).toUpperCase()}
                    </TableCell>
                    <TableCell sx={{ fontSize: 12, color: "#555" }}>
                      {formatDate(tx.billingDate)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={capitalize(tx.plan)}
                        size="small"
                        sx={{
                          backgroundColor: pb,
                          color: pc,
                          fontWeight: 600,
                          fontSize: 11,
                          height: 22,
                          borderRadius: "5px",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{ fontSize: 12, fontWeight: 700, color: "#222" }}
                    >
                      {formatAmount(tx.amount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={capitalize(tx.status)}
                        size="small"
                        sx={{
                          backgroundColor: bg,
                          color,
                          fontWeight: 600,
                          fontSize: 11,
                          height: 22,
                          borderRadius: "5px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={
                          <ReceiptIcon sx={{ fontSize: "16px !important" }} />
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(tx);
                        }}
                        sx={{
                          textTransform: "none",
                          fontSize: 12,
                          fontWeight: 600,
                          borderRadius: "8px",
                          borderColor: "#e0e0e0",
                          color: "#444",
                          py: 0.5,
                          px: 1.5,
                          "&:hover": {
                            borderColor: "#1a1a2e",
                            color: "#1a1a2e",
                            backgroundColor: "transparent",
                          },
                        }}
                      >
                        See Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* inner pagination */}
      {!txLoading && txPag?.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
          <Pagination
            count={txPag.totalPages}
            page={txPage}
            onChange={(_, v) => setTxPage(v)}
            size="small"
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": { fontSize: 12 },
              "& .Mui-selected": {
                backgroundColor: "#1a1a2e !important",
                color: "#fff",
              },
            }}
          />
        </Box>
      )}
      <ReciptModal
        open={modalOpen}
        onClose={handleClose}
        transaction={selectedTx}
          />
          <ReciptModal open={modalOpen} onClose={handleClose} transaction={selectedTx} />
    </Box>
  );
}

// ─── expandable user row ─────────────────────────────────────────────────────

function UserRow({ user }) {
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
        onClick={() => setOpen((p) => !p)}
      >
        {/* expand toggle */}
        <TableCell sx={{ width: 44, pr: 0 }}>
          <IconButton size="small" sx={{ color: "#aaa" }}>
            {open ? (
              <ArrowUpIcon fontSize="small" />
            ) : (
              <ArrowDownIcon fontSize="small" />
            )}
          </IconButton>
        </TableCell>

        {/* user */}
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

        {/* plan */}
        <TableCell>
          <Chip
            label={capitalize(user.subscription?.plan ?? "—")}
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

        {/* status */}
        <TableCell>
          <Chip
            label={capitalize(user.subscription?.status ?? "—")}
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

        {/* total paid */}
        <TableCell>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>
            {formatAmount(user.totalPaid)}
          </Typography>
        </TableCell>

        {/* tx count */}
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

      {/* expandable tx history */}
      <TableRow>
        <TableCell colSpan={6} sx={{ p: 0, border: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <UserTransactionRows userId={user._id} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export default function SubscriptionsPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchUsers = useCallback(async (pg) => {
    setLoading(true);
    try {
      const res = await getAdminUsersSummary(pg);
      if (res?.success) {
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch users summary:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  // derive quick stats from loaded page data
  const totalRevenue = users.reduce((sum, u) => sum + (u.totalPaid ?? 0), 0);
  const activeCount = users.filter(
    (u) => u.subscription?.status === "active",
  ).length;
  const totalTransactions = users.reduce(
    (sum, u) => sum + (u.transactionCount ?? 0),
    0,
  );

  return (
    <Box>
      {/* page header */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <CreditScoreIcon sx={{ fontSize: 26, color: "#1a1a2e" }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#1a1a2e", fontSize: 22 }}
        >
          Subscriptions
        </Typography>
      </Stack>

      {/* stat cards */}
      <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 3 }}>
        <StatCard
          icon={<MoneyIcon sx={{ fontSize: 20, color: "#2e7d32" }} />}
          label="Total Revenue (this page)"
          value={formatAmount(totalRevenue)}
          accent="#2e7d32"
        />
        <StatCard
          icon={<GroupIcon sx={{ fontSize: 20, color: "#0369a1" }} />}
          label="Active Subscribers"
          value={loading ? "—" : `${activeCount} / ${users.length}`}
          accent="#0369a1"
        />
        <StatCard
          icon={<TrendingUpIcon sx={{ fontSize: 20, color: "#5c35d4" }} />}
          label="Transactions (this page)"
          value={loading ? "—" : totalTransactions}
          accent="#5c35d4"
        />
        {pagination && (
          <StatCard
            icon={<ReceiptIcon sx={{ fontSize: 20, color: "#b45309" }} />}
            label="Total Users"
            value={pagination.totalCount}
            accent="#b45309"
          />
        )}
      </Stack>

      {/* main table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid #f0f0f0",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
                      <TableHead>
                           {/* expand col */}
              <TableRow sx={{ backgroundColor: "#fafafa" }}>
                <TableCell sx={{ width: 44 }} />
                {["User", "Plan", "Status", "Total Paid", "Transactions"].map(
                  (col) => (
                    <TableCell
                      key={col}
                      sx={{
                        fontWeight: 700,
                        fontSize: 12,
                        color: "#555",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        py: 1.8,
                        borderBottom: "1px solid #f0f0f0",
                      }}
                    >
                      {col}
                    </TableCell>
                  ),
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <SkeletonRows cols={6} />
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    sx={{
                      textAlign: "center",
                      py: 8,
                      color: "#aaa",
                      fontSize: 14,
                    }}
                  >
                    No subscribers found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => <UserRow key={user._id} user={user} />)
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* outer pagination */}
        {!loading && pagination?.totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 3,
              py: 2,
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "#888" }}>
              Showing {users.length} of {pagination.totalCount} users
            </Typography>
            <Pagination
              count={pagination.totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              size="small"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": { fontSize: 13, fontWeight: 500 },
                "& .Mui-selected": {
                  backgroundColor: "#1a1a2e !important",
                  color: "#fff",
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
