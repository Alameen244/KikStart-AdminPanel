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
import {
  getBannerSections,
  deleteBanner,
} from "../../../Apis/HomeApis/bannerApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import BannerFormModal from "../Modals/BannerFormModal";
import SectionHeader from "../../TableComponents/SectionHeader";
import SectionDataGrid from "../../TableComponents/SectionDataGrid";
import ActionCell from "../../TableComponents/ActionCell";
import PreviewImageCell from "../../TableComponents/PreviewImageCell";
import PreviewButtonCell from "../../TableComponents/PreviewButtonCell";
import StatusChipCell from "../../TableComponents/StatusChipCell";
import RichTextPreviewCell from "../../TableComponents/RichTextPreviewCell";
import CenteredCell from "../../TableComponents/CenteredCell";


export default function BannerSection() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState({
    type: "include",
    ids: new Set(),
  });
  const queryClient = useQueryClient();

  const {
    data: banners,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bannerData"],
    queryFn: getBannerSections,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(["bannerData"]);
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
    if (window.confirm("Are you sure you want to delete this banner?")) {
      toast.promise(deleteMutation.mutateAsync(row.id || row._id), {
        pending: "Deleting banner...",
        success: {
          render({ data: response }) {
            return getSuccessMessage(response, "Banner deleted successfully");
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
        `Are you sure you want to delete ${selectedIds.length} selected banner(s)?`,
      )
    ) {
      return;
    }

    try {
      const bulkDeletePromise = Promise.all(
        selectedIds.map((id) => deleteMutation.mutateAsync(id)),
      );

      await toast.promise(bulkDeletePromise, {
        pending: "Deleting selected banners...",
        success: "Selected banners deleted successfully",
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
      width: 150,
      renderCell: (params) => (
        <CenteredCell>
          {params.value}
        </CenteredCell>
      ),
    },
    {
      field: "headings",
      headerName: "Headings",
      width: 170,
      renderCell: (params) => (
        <HeadingListBox>
          {params.value?.map((heading, index) => (
            <HeadingItemTypography
              key={index}
              component="p"
              color={index % 2 === 0 ? "secondary.main" : "primary.main"}
            >
              - {heading.text}
            </HeadingItemTypography>
          ))}
        </HeadingListBox>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 220,
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
      renderCell: (params) =>
        <PreviewImageCell imageUrl={params.value?.url} alt="banner" />,
    },
    {
      field: "guestButtonText",
      headerName: "Guest Button",
      width: 170,
      renderCell: (params) =>
        <PreviewButtonCell text={params.value} />,
    },
    {
      field: "authButtonText",
      headerName: "Auth Button",
      width: 170,
      renderCell: (params) =>
        <PreviewButtonCell text={params.value} />,
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 120,
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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ),
    },
  ];

  const rows = Array.isArray(banners)
    ? banners.map((item) => ({ ...item, id: item._id }))
    : [];
  const selectedCount =
    selectedRows.type === "exclude"
      ? rows.length - selectedRows.ids.size
      : selectedRows.ids.size;

  return (
    <Box>
      <SectionHeader
        title="Banner Management"
        createLabel="Create Banner"
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
        errorMessage="Failed to load banner sections"
        rows={rows}
        columns={columns}
        rowHeight={120}
        rowSelectionModel={selectedRows}
        onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
      />

      <BannerFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        data={selectedRow}
      />
    </Box>
  );
}

const HeadingListBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  alignItems: "flex-start",
  justifyContent: "center",
  height: "100%",
});

const HeadingItemTypography = styled(Typography)({
  fontSize: "14px",
});
