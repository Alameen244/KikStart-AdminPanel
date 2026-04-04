import AddIcon from "@mui/icons-material/Add";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteTestimonial } from "../../../Apis/HomeApis/testimonialApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import ActionCell from "../../TableComponents/ActionCell";
import CenteredCell from "../../TableComponents/CenteredCell";
import PreviewImageCell from "../../TableComponents/PreviewImageCell";
import RichTextPreviewCell from "../../TableComponents/RichTextPreviewCell";
import SectionDataGrid from "../../TableComponents/SectionDataGrid";
import SectionHeader from "../../TableComponents/SectionHeader";
import StatusChipCell from "../../TableComponents/StatusChipCell";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";


export default function TestimonialTable({
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
    mutationFn: deleteTestimonial,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["testimonialSection"]);
    },
  });

  const handleDelete = (row) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      toast.promise(deleteMutation.mutateAsync(row.id || row._id), {
        pending: "Deleting testimonial...",
        success: {
          render({ data: response }) {
            return getSuccessMessage(
              response,
              "Testimonial deleted successfully",
            );
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
        `Are you sure you want to delete ${selectedIds.length} selected testimonial(s)?`,
      )
    ) {
      return;
    }

    try {
      const bulkDeletePromise = Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync(id)),
      );

      await toast.promise(bulkDeletePromise, {
        pending: "Deleting selected testimonials...",
        success: "Selected testimonials deleted successfully",
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
      field: "name",
      headerName: "Name",
      width: 230,
      renderCell: (params) => <CenteredCell><ClientName>{params.value}</ClientName></CenteredCell>,
    },
    {
      field: "profession",
      headerName: "Profession",
      width: 170,
      renderCell: (params) => (
        <CenteredCell><ClientProfession>{params.value || "-"}</ClientProfession></CenteredCell>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 290,
      renderCell: (params) => (
        <RichTextPreviewCell
          value={params.value}
        />
      ),
    },
    {
      field: "image",
      headerName: "Image",
      width: 140,
      renderCell: (params) => (
        <PreviewImageCell imageUrl={params.value?.url} alt="testimonial" />
      ),
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
        title="Testimonials"
        createLabel="Add Testimonial"
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
        errorMessage="Failed to load testimonials"
        rows={rows}
        columns={columns}
        rowHeight={96}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
      />
    </Box>
  );
}

const ClientName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.dark.main,
}));
const ClientProfession = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  color: theme.palette.myRed,
}));
