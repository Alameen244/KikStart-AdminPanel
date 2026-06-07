import React from "react";
import {
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Add, DeleteOutline, RemoveRedEye } from "@mui/icons-material";
import {
  ActionStack,
  AssignIconButton,
  BodyCell,
  BodyRow,
  HeaderCell,
  RoleCellButton,
  StateCard,
  TableCard,
} from "./styled";
import { titleize } from "./utils";

// Props:
//   rows              – filtered row array from parent
//   searchQuery       – string, used only to pick the empty-state message
//   filterRoleId      – string, used only to pick the empty-state message
//   isDeleting        – boolean (deleteSubAdminMutation.isPending)
//   onOpenAssign      – (user) => void
//   onOpenRead        – (user) => void
//   onDelete          – (userId) => void

export default function SubAdminTable({
  rows,
  searchQuery,
  filterRoleId,
  isDeleting,
  onOpenAssign,
  onOpenRead,
  onDelete,
}) {
  return (
    <TableCard elevation={0}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <HeaderCell>S No</HeaderCell>
              <HeaderCell>User Name</HeaderCell>
              <HeaderCell>Email</HeaderCell>
              <HeaderCell>Role</HeaderCell>
              <HeaderCell align="center">Enable</HeaderCell>
              <HeaderCell align="center">Actions</HeaderCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((user, index) => (
                <BodyRow key={user.id}>
                  <BodyCell>{index + 1}</BodyCell>
                  <BodyCell>{user.name}</BodyCell>
                  <BodyCell>{user.email}</BodyCell>

                  <BodyCell>
                    {user.assignedRoleName ? (
                      <RoleCellButton
                        type="button"
                        onClick={() => onOpenAssign(user)}
                      >
                        <Typography sx={{ fontWeight: 700, color: "myRed.main" }}>
                          {titleize(user.assignedRoleName)}
                        </Typography>
                      </RoleCellButton>
                    ) : (
                      <AssignIconButton onClick={() => onOpenAssign(user)}>
                        <Add />
                      </AssignIconButton>
                    )}
                  </BodyCell>

                  <BodyCell align="center">
                    <Checkbox checked={user.enabled} disableRipple />
                  </BodyCell>

                  <BodyCell align="center">
                    <ActionStack>
                      <IconButton onClick={() => onOpenRead(user)}>
                        <RemoveRedEye />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onDelete(user.id)}
                        disabled={isDeleting}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </ActionStack>
                  </BodyCell>
                </BodyRow>
              ))
            ) : (
              <TableRow>
                <BodyCell colSpan={6} align="center">
                  {searchQuery || filterRoleId
                    ? "No subadmins match the current filters."
                    : "No subadmins found."}
                </BodyCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </TableCard>
  );
}
