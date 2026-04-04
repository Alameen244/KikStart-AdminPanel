import AddIcon from "@mui/icons-material/Add";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteFAQ } from "../../../Apis/FAQs/faqApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import ActionCell from "../../TableComponents/ActionCell";
import CenteredCell from "../../TableComponents/CenteredCell";
import RichTextPreviewCell from "../../TableComponents/RichTextPreviewCell";
import SectionDataGrid from "../../TableComponents/SectionDataGrid";
import SectionHeader from "../../TableComponents/SectionHeader";
import StatusChipCell from "../../TableComponents/StatusChipCell";



export default function FAQTable({
  rows,
  isLoading,
  isError,
  error,
  onCreate,
  onEdit,
  selectedRows,
  setSelectedRows,
}) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteFAQ,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["faqSection"]);
    },
  });

  const handleDelete = (row) => {
    if (window.confirm("Are you sure you want to delete this FAQ?")) {
      toast.promise(deleteMutation.mutateAsync(row.id || row._id), {
        pending: "Deleting FAQ...",
        success: {
          render({ data: response }) {
            return getSuccessMessage(response, "FAQ deleted successfully");
          },
        },
        error: {
          render({ data: errorData }) {
            return getErrorMessage(errorData);
          },
        },
      });
    }
  };

  const handleDeleteSelected = async () => {
    const allRowIds = rows.map((row) => row.id);
    const selectedIds =
      selectedRows.type === "exclude"
        ? allRowIds.filter((id) => !selectedRows.ids.has(id))
        : Array.from(selectedRows.ids);

    if (!selectedIds.length) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} selected FAQ(s)?`,
      )
    ) {
      return;
    }

    try {
      const bulkDeletePromise = Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync(id)),
      );

      await toast.promise(bulkDeletePromise, {
        pending: "Deleting selected FAQs...",
        success: "Selected FAQs deleted successfully",
        error: {
          render({ data: errorData }) {
            return getErrorMessage(errorData);
          },
        },
      });

      setSelectedRows({
        type: "include",
        ids: new Set(),
      });
    } catch (deleteError) {
      console.error("Bulk delete failed:", deleteError);
    }
  };

  const handleView = (row) => {
    console.log("View:", row);
  };

  const columns = [
    {
      field: "order",
      headerName: "Order",
      width: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <CenteredCell sx={{ justifyContent: "center" }}>
          <Typography>{params.value ?? 0}</Typography>
        </CenteredCell>
      ),
    },
    {
      field: "question",
      headerName: "Question",
      width: 300,
      renderCell: (params) => (
        <CenteredCell>
          <FAQQuestion>{params.value}</FAQQuestion>
        </CenteredCell>
      ),
    },
    {
      field: "answer",
      headerName: "Answer",
      width: 360,
      renderCell: (params) => <RichTextPreviewCell value={params.value} />,
    },

    {
      field: "isActive",
      headerName: "Status",
      width: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <StatusChipCell value={params.value} />,
    },
    {
      field: "action",
      headerName: "Action",
      width: 140,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <ActionCell
          row={params.row}
          onView={handleView}
          onEdit={onEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  const selectedCount =
    selectedRows.type === "exclude"
      ? rows.length - selectedRows.ids.size
      : selectedRows.ids.size;

  return (
    <Box>
      <SectionHeader
        title="FAQs"
        createLabel="Add FAQ"
        createIcon={<AddIcon />}
        onCreate={onCreate}
        selectedCount={selectedCount}
        deleteIcon={<DeleteSweepIcon />}
        onDeleteSelected={handleDeleteSelected}
      />

      <SectionDataGrid
        isLoading={isLoading}
        isError={isError}
        error={error}
        errorMessage="Failed to load FAQs"
        rows={rows}
        columns={columns}
        rowHeight={96}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
      />
    </Box>
  );
}

const FAQQuestion = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.dark.main,
}));
