import {
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { styled } from "@mui/material/styles";
import { deleteWho, getWhoSections } from "../../../Apis/HomeApis/whoApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import WhoFormModal from "../Modals/WhoFormModal";
import SectionHeader from "../../TableComponents/SectionHeader";
import SectionDataGrid from "../../TableComponents/SectionDataGrid";
import ActionCell from "../../TableComponents/ActionCell";
import PreviewImageCell from "../../TableComponents/PreviewImageCell";
import PreviewButtonCell from "../../TableComponents/PreviewButtonCell";
import StatusChipCell from "../../TableComponents/StatusChipCell";
import RichTextPreviewCell from "../../TableComponents/RichTextPreviewCell";
import CenteredCell from "../../TableComponents/CenteredCell";

const getDescriptionPreviewHtml = (html = "") => {
  if (!html) return "";

  return html
    .replace(/<(\/?)(p|div|h1|h2|h3|h4|h5|h6|blockquote|li)>/gi, "<$1span>")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/&nbsp;/gi, " ");
};

export default function WhoSection() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState({
    type: "include",
    ids: new Set(),
  });
  const queryClient = useQueryClient();

  const {
    data: whoSections,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["whoData"],
    queryFn: getWhoSections,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWho,
    onSuccess: () => {
      queryClient.invalidateQueries(["whoData"]);
    },
    onError: (deleteError) => {
      console.error("Delete failed:", deleteError);
    },
  });

  const handleEdit = (row) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  const handleCreate = () => {
    setSelectedRow(null);
    setOpenForm(true);
  };

  const handleDelete = (row) => {
    if (window.confirm("Are you sure you want to delete this who section?")) {
      toast.promise(deleteMutation.mutateAsync(row.id || row._id), {
        pending: "Deleting who section...",
        success: {
          render({ data: response }) {
            return getSuccessMessage(response, "Who section deleted successfully");
          },
        },
        error: {
          render({ data: error }) {
            return getErrorMessage(error);
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
        `Are you sure you want to delete ${selectedIds.length} selected who section(s)?`,
      )
    ) {
      return;
    }

    try {
      const bulkDeletePromise = Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync(id)),
      );

      await toast.promise(bulkDeletePromise, {
        pending: "Deleting selected who sections...",
        success: "Selected who sections deleted successfully",
        error: {
          render({ data: error }) {
            return getErrorMessage(error);
          },
        },
      });

      setSelectedRows({
        type: "include",
        ids: new Set(),
      });
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  };

  const handleView = (row) => {
    console.log("View:", row);
  };

  const columns = [
    {
      field: "subHeading",
      headerName: "Subheading",
      width: 140,
      renderCell: (params) => (
        <CenteredCell>
          {params.value}
        </CenteredCell>
      ),
    },
    {
      field: "heading",
      headerName: "Heading",
      width: 180,
      renderCell: (params) => (
        <CenteredCell>
          <HeadingTypography>
            {params.value}
          </HeadingTypography>
        </CenteredCell>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 240,
      renderCell: (params) => (
        <RichTextPreviewCell
          value={params.value}
          formatter={getDescriptionPreviewHtml}
        />
      ),
    },
    {
      field: "image1",
      headerName: "Image 1",
      width: 140,
      renderCell: (params) =>
        <PreviewImageCell imageUrl={params.value?.url} alt="who image 1" />,
    },
    {
      field: "image2",
      headerName: "Image 2",
      width: 140,
      renderCell: (params) =>
        <PreviewImageCell imageUrl={params.value?.url} alt="who image 2" />,
    },
    {
      field: "buttonText",
      headerName: "Button Text",
      width: 160,
      renderCell: (params) =>
        <PreviewButtonCell text={params.value} />,
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
      renderCell: (params) => <StatusChipCell value={params.value} />,
    },
    {
      field: "action",
      headerName: "Action",
      width: 140,
      sortable: false,
      renderCell: (params) => (
        <ActionCell
          row={params.row}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  const rows = Array.isArray(whoSections)
    ? whoSections.map((item) => ({ ...item, id: item._id }))
    : [];
  const selectedCount =
    selectedRows.type === "exclude"
      ? rows.length - selectedRows.ids.size
      : selectedRows.ids.size;

  return (
    <Box>
      <SectionHeader
        title="Who Section Management"
        createLabel="Create Who Section"
        createIcon={<AddIcon />}
        onCreate={handleCreate}
        selectedCount={selectedCount}
        deleteIcon={<DeleteSweepIcon />}
        onDeleteSelected={handleDeleteSelected}
      />

      <SectionDataGrid
        isLoading={isLoading}
        isError={isError}
        error={error}
        errorMessage="Failed to load who sections"
        rows={rows}
        columns={columns}
        rowHeight={120}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
      />

      <WhoFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        data={selectedRow}
      />
    </Box>
  );
}

const HeadingTypography = styled(Typography)({
  fontSize: "14px",
  fontWeight: 600,
});
