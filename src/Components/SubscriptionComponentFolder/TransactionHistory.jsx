import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { ReceiptLong as ReceiptIcon } from "@mui/icons-material";
import { getAdminUserTransactions } from "../../Apis/subsciptionApis/subsciptionApis";
import ReciptModal from "../../../../frontEnd/src/Components/ReciptModal/ReciptModal";
import SkeletonRows from "./SkeletonRows";
import {
  capitalize,
  formatAmount,
  formatDate,
  planColor,
  txStatusColor,
  exportUserTransactionsPDF,
} from "./subscriptionUtils";

import ExportButton from "../../Components/ExportButton/ExportButton";
import { Download as DownloadIcon } from "@mui/icons-material";

const TRANSACTION_COLUMNS = [
  "Invoice ID",
  "Date",
  "Plan",
  "Amount",
  "Status",
  "Receipt",
];

export default function TransactionHistory({ userId }) {
  const [txData, setTxData] = useState([]);
  const [txPag, setTxPag] = useState(null);
  const [txPage, setTxPage] = useState(1);
  const [txLoading, setTxLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleOpen = (tx) => {
    setSelectedTx(tx);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setTimeout(() => setSelectedTx(null), 200);
  };

  return (
    <Box sx={{ px: 3, py: 2, backgroundColor: "#fafbff" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: "#888",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Transaction History
        </Typography>

        <ExportButton
          onClick={async () => {
            try {
              const res = await getAdminUserTransactions({
                userId,
                exportAll: true,
              });
              if (res?.success) {
                exportUserTransactionsPDF(res.data.transactions, {
                  _id: userId,
                });
              }
            } catch (err) {
              console.error("Export failed:", err);
            }
          }}
          height="35px"
          px="12px"
          fontSize="12px"
        />
      </Stack>

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
              {TRANSACTION_COLUMNS.map((col) => (
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
              <SkeletonRows cols={TRANSACTION_COLUMNS.length} />
            ) : txData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={TRANSACTION_COLUMNS.length}
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

      {!txLoading && txPag?.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.5 }}>
          <Pagination
            count={txPag.totalPages}
            page={txPage}
            onChange={(_, value) => setTxPage(value)}
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
    </Box>
  );
}
