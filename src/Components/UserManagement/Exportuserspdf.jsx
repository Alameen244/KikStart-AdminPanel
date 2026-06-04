import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates and downloads a PDF table of users.
 * @param {Array} users  - raw user objects from the API
 * @param {Object} activeFilters - displayed in the PDF subtitle so admin knows what was filtered
 */
export const exportUsersPDF = (users, activeFilters = {}) => {
    const doc = new jsPDF({ orientation: "landscape" });

    // ── Title ──────────────────────────────────────────────────────────────────
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("User Management Report", 14, 18);

    // ── Subtitle: active filters ───────────────────────────────────────────────
    const filterParts = [];
    if (activeFilters.search)             filterParts.push(`Search: "${activeFilters.search}"`);
    if (activeFilters.role)               filterParts.push(`Role: ${activeFilters.role}`);
    if (activeFilters.subscriptionStatus) filterParts.push(`Subscription: ${activeFilters.subscriptionStatus}`);
    if (activeFilters.plan)               filterParts.push(`Plan: ${activeFilters.plan}`);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(
        filterParts.length ? `Filters applied: ${filterParts.join("  |  ")}` : "All users",
        14,
        26,
    );
    doc.text(
        `Generated: ${new Date().toLocaleString()}   |   Total: ${users.length} users`,
        14,
        32,
    );

    // ── Table ──────────────────────────────────────────────────────────────────
    const head = [["#", "Name", "Email", "Phone", "Role", "Status", "Subscription", "Plan", "Joined"]];

    const body = users.map((user, idx) => [
        idx + 1,
        user?.name || "N/A",
        user?.email || "N/A",
        user?.phone || "N/A",
        user?.role || "user",
        user?.isVerified ? "Active" : "Inactive",
        user?.subscription?.status || "inactive",
        user?.subscription?.plan || "N/A",
        user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
    ]);

    autoTable(doc, {
        head,
        body,
        startY: 38,
        styles: {
            fontSize: 8,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [30, 30, 30],
            textColor: 255,
            fontStyle: "bold",
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
        columnStyles: {
            0: { cellWidth: 10 },  // #
            1: { cellWidth: 35 },  // Name
            2: { cellWidth: 55 },  // Email
            3: { cellWidth: 28 },  // Phone
            4: { cellWidth: 22 },  // Role
            5: { cellWidth: 22 },  // Status
            6: { cellWidth: 28 },  // Subscription
            7: { cellWidth: 25 },  // Plan
            8: { cellWidth: 28 },  // Joined
        },
    });

    // ── Footer ─────────────────────────────────────────────────────────────────
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(160);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.getWidth() - 30,
            doc.internal.pageSize.getHeight() - 8,
        );
    }

    doc.save(`users-export-${Date.now()}.pdf`);
};
