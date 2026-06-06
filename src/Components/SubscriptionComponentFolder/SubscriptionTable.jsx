import {
  Box,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import SkeletonRows from "./SkeletonRows";
import UserRow from "./UserRow";
import SubscriptionFilters from "./SubscriptionFilters";
import SubscriptionExport from "./SubscriptionExport";
const USER_COLUMNS = ["User", "Plan", "Status", "Total Paid", "Transactions"];

export default function SubscriptionTable({
  users,
  pagination,
  loading,
  page,
  onPageChange,
  filters,
  onFilterChange,
  onFilterClear,
  onExportPage,
  onExportAll,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid #f0f0f0",
        overflow: "hidden",
      }}
    >
      {/* ── Toolbar: filters + export ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          px: 2.5,
          py: 2,
          borderBottom: "1px solid #f5f5f5",
        }}
      >
        <SubscriptionFilters
          filters={filters}
          onChange={onFilterChange}
          onClear={onFilterClear}
        />
        <SubscriptionExport
          onExportPage={onExportPage}
          onExportAll={onExportAll}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#fafafa" }}>
              <TableCell sx={{ width: 44 }} />
              {USER_COLUMNS.map((col) => (
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
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <SkeletonRows cols={USER_COLUMNS.length + 1} />
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={USER_COLUMNS.length + 1}
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
            onChange={(_, value) => onPageChange(value)}
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
  );
}
