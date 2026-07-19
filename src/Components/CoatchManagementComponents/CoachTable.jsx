import React from "react";
import {
  Chip,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { AssignmentInd, Delete, Visibility } from "@mui/icons-material";
import { StateCard } from "../RoleManagementPageComponents/styled";

export default function CoachTable({
  rows,
  isDeleting,
  isUpdating,
  onOpenAssign,
  onOpenView,
  onDelete,
  onToggleActive,
}) {
  if (rows.length === 0) {
    return (
      <StateCard>
        <Typography>No coaches found.</Typography>
      </StateCard>
    );
  }

  return (
    <TableContainer sx={{ borderRadius: 3, boxShadow: "none", border: "1px solid", borderColor: "divider" }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "background.default" }}>
            <TableCell sx={{ fontWeight: 700 }}>S No</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Coach Name</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Assigned Programs</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Max Students</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Active</TableCell>
            <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} hover>
              <TableCell>{row.serial}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>
                {row.assignedPrograms.length === 0 ? (
                  <Typography variant="body2" sx={{ color: "semiDark.main" }}>
                    Not assigned
                  </Typography>
                ) : (
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {row.assignedPrograms.slice(0, 2).map((program) => (
                      <Chip key={program._id} label={program.title} size="small" />
                    ))}
                    {row.assignedPrograms.length > 2 && (
                      <Chip label={`+${row.assignedPrograms.length - 2} more`} size="small" variant="outlined" />
                    )}
                  </Stack>
                )}
              </TableCell>
              <TableCell>{row.maxStudents}</TableCell>
              <TableCell>
                <Switch
                  checked={row.isActive}
                  disabled={isUpdating}
                  onChange={() => onToggleActive(row)}
                  size="small"
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="Assign programs">
                  <IconButton onClick={() => onOpenAssign(row)}>
                    <AssignmentInd fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View coach">
                  <IconButton onClick={() => onOpenView(row)}>
                    <Visibility fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete coach">
                  <span>
                    <IconButton onClick={() => onDelete(row.id)} disabled={isDeleting} sx={{ color: "error.main" }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}