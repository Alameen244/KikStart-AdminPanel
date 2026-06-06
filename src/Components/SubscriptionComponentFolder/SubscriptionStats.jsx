import { Stack } from "@mui/material";
import {
  AttachMoney as MoneyIcon,
  Group as GroupIcon,
  ReceiptLong as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import StatCard from "./StatCard";
import { formatAmount } from "./subscriptionUtils";

export default function SubscriptionStats({ users, pagination, loading }) {
  const totalRevenue = users.reduce((sum, user) => sum + (user.totalPaid ?? 0), 0);
  const activeCount = users.filter(
    (user) => user.subscription?.status === "active",
  ).length;
  const totalTransactions = users.reduce(
    (sum, user) => sum + (user.transactionCount ?? 0),
    0,
  );

  return (
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
        value={loading ? "-" : `${activeCount} / ${users.length}`}
        accent="#0369a1"
      />
      <StatCard
        icon={<TrendingUpIcon sx={{ fontSize: 20, color: "#5c35d4" }} />}
        label="Transactions (this page)"
        value={loading ? "-" : totalTransactions}
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
  );
}
