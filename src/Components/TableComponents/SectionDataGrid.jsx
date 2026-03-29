import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export default function SectionDataGrid({
  isLoading,
  isError,
  error,
  errorMessage,
  rows,
  columns,
  rowHeight = 120,
  rowSelectionModel,
  onRowSelectionModelChange,
}) {
  return (
    <SectionPaper>
      {isLoading ? (
        <StatusBox>
          <Typography>Loading...</Typography>
        </StatusBox>
      ) : isError ? (
        <StatusBox>
          <Typography color="error">
            {error?.response?.data?.message || errorMessage}
          </Typography>
        </StatusBox>
      ) : (
        <StyledDataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={onRowSelectionModelChange}
        />
      )}
    </SectionPaper>
  );
}

const SectionPaper = styled(Paper)({
  height: 450,
  width: "100%",
});

const StatusBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
});

const StyledDataGrid = styled(DataGrid)({
  border: 0,
  "& .MuiDataGrid-cell": {
    paddingTop: 8,
    paddingBottom: 8,
  },
});
