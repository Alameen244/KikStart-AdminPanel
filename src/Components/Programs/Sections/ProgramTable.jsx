import AddIcon from "@mui/icons-material/Add";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteProgram } from "../../../Apis/Programs/programApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import ActionCell from "../../TableComponents/ActionCell";
import CenteredCell from "../../TableComponents/CenteredCell";
import ImageCardsTable from "../../TableComponents/ImageCardsTable";
import RichTextPreviewCell from "../../TableComponents/RichTextPreviewCell";
import SectionDataGrid from "../../TableComponents/SectionDataGrid";
import SectionHeader from "../../TableComponents/SectionHeader";
import StatusChipCell from "../../TableComponents/StatusChipCell";

export default function ProgramTable({
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
    mutationFn: deleteProgram,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["programSection"]);
    },
  });

  const handleDelete = (row) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      toast.promise(deleteMutation.mutateAsync(row.id || row._id), {
        pending: "Deleting program...",
        success: {
          render({ data: response }) {
            return getSuccessMessage(response, "Program deleted successfully");
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
        `Are you sure you want to delete ${selectedIds.length} selected program(s)?`
      )
    ) {
      return;
    }

    try {
      const bulkDeletePromise = Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync(id))
      );

      await toast.promise(bulkDeletePromise, {
        pending: "Deleting selected programs...",
        success: "Selected programs deleted successfully",
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
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <CenteredCell sx={{ justifyContent: "center" }}>
          <Typography>{params.value ?? 0}</Typography>
        </CenteredCell>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      width: 240,
      renderCell: (params) => (
        <CenteredCell>
          <ProgramTitle>{params.value}</ProgramTitle>
        </CenteredCell>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 360,
      renderCell: (params) => (
        <CenteredCell>
          <RichTextPreviewCell value={params.value} />
        </CenteredCell>
      ),
    },
    {
      field: "ProgramDetails",
      headerName: "Details",
      width: 360,
      renderCell: (params) => (
        <CenteredCell>
          <RichTextPreviewCell value={params.value} />
        </CenteredCell>
      ),
    },
    {
      field: "images",
      headerName: "Image",
      width: 200,
      sortable: false,
      renderCell: (params) => <ImageCardsTable items={params.value} />,
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 130,
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
        title="Programs"
        createLabel="Add Program"
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
        errorMessage="Failed to load programs"
        rows={rows}
        columns={columns}
        rowHeight={250}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
      />
    </Box>
  );
}

const ProgramTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.dark.main,
}));
