import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export const formatAmount = (amount) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount ?? 0,
  );

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "-";

export const getInitials = (name, email) => {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

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

export const getAvatarColor = (str) => {
  let hash = 0;

  for (let i = 0; i < (str?.length ?? 0); i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const planColor = (plan) => {
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

export const statusColor = (status) => {
  switch (status) {
    case "active":
      return { color: "#2e7d32", bg: "#edf7ee" };
    case "inactive":
    case "cancelled":
      return { color: "#c62828", bg: "#fdecea" };
    default:
      return { color: "#555", bg: "#f5f5f5" };
  }
};

export const txStatusColor = (status) => {
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


// ─────────────────────────────────────────────
// Export: all users summary table
// ─────────────────────────────────────────────
export const exportSubscriptionsPDF = (users, activeFilters = {}) => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Subscriptions Report", 14, 18);

    const filterParts = [];
    if (activeFilters.plan)               filterParts.push(`Plan: ${activeFilters.plan}`);
    if (activeFilters.subscriptionStatus) filterParts.push(`Status: ${activeFilters.subscriptionStatus}`);
    if (activeFilters.transactionStatus)  filterParts.push(`Tx Status: ${activeFilters.transactionStatus}`);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(
        filterParts.length ? `Filters: ${filterParts.join("  |  ")}` : "All subscribers",
        14, 26
    );
    doc.text(
        `Generated: ${new Date().toLocaleString()}   |   Total: ${users.length} users`,
        14, 32
    );

    autoTable(doc, {
        head: [["#", "Name", "Email", "Plan", "Status", "Total Paid", "Transactions"]],
        body: users.map((u, i) => [
            i + 1,
            u?.name || "N/A",
            u?.email || "N/A",
            u?.subscription?.plan ? capitalize(u.subscription.plan) : "N/A",
            u?.subscription?.status ? capitalize(u.subscription.status) : "N/A",
            formatAmount(u?.totalPaid ?? 0),
            u?.transactionCount ?? 0,
        ]),
        startY: 38,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [26, 26, 46], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 245, 250] },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 40 },
            2: { cellWidth: 65 },
            3: { cellWidth: 30 },
            4: { cellWidth: 28 },
            5: { cellWidth: 30 },
            6: { cellWidth: 28 },
        },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(160);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() - 30,
            doc.internal.pageSize.getHeight() - 8
        );
    }

    doc.save(`subscriptions-${Date.now()}.pdf`);
};

// ─────────────────────────────────────────────
// Export: single user's transaction history
// ─────────────────────────────────────────────
export const exportUserTransactionsPDF = (transactions, user) => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Transaction History", 14, 18);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(`User: ${user?.name || "N/A"}  |  ${user?.email || ""}`, 14, 26);
    doc.text(
        `Generated: ${new Date().toLocaleString()}   |   Total: ${transactions.length} transactions`,
        14, 32
    );

    autoTable(doc, {
        head: [["#", "Invoice ID", "Date", "Plan", "Amount", "Status"]],
        body: transactions.map((tx, i) => [
            i + 1,
            `#${tx.stripeInvoiceId?.slice(-9).toUpperCase()}`,
            formatDate(tx.billingDate),
            tx.plan ? capitalize(tx.plan) : "N/A",
            formatAmount(tx.amount),
            tx.status ? capitalize(tx.status) : "N/A",
        ]),
        startY: 38,
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: { fillColor: [26, 26, 46], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 245, 250] },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 45 },
            2: { cellWidth: 38 },
            3: { cellWidth: 35 },
            4: { cellWidth: 30 },
            5: { cellWidth: 28 },
        },
    });

    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(160);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() - 30,
            doc.internal.pageSize.getHeight() - 8
        );
    }

    doc.save(`transactions-${user?.name || user?._id}-${Date.now()}.pdf`);
};
