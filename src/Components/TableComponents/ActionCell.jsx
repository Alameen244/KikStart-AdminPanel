import { Box, IconButton, Tooltip } from "@mui/material";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ActionCell({ row, onView, onEdit, onDelete, className, ...props }) {
  return (
    <ActionBox className={className} {...props}>
      <Tooltip title="View">
        <IconButton color="info" size="small" onClick={() => onView(row)}>
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Edit">
        <IconButton color="warning" size="small" onClick={() => onEdit(row)}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton color="error" size="small" onClick={() => onDelete(row)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </ActionBox>
  );
}

const ActionBox = styled(Box)({
  display: "flex",
  gap: 8,
  alignItems: "center",
  justifyContent:"center",
  height: "100%",
});
