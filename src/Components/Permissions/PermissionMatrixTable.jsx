import React from "react";
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const actionColumns = ["create", "read", "update", "delete"];
const EXCLUDED_PERMISSION_MODULES = new Set(["CMS", "CMS Management"]);

export default function PermissionMatrixTable({
  roleName,
  onRoleNameChange,
  modules,
  editable = false,
  onTogglePermission,
  headerActions,
}) {
  const visibleModules = modules.filter(
    (moduleRow) =>
      moduleRow?.module && !EXCLUDED_PERMISSION_MODULES.has(moduleRow.module),
  );

  return (
    <MatrixCard elevation={0}>
      <MatrixHeader>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "dark.main" }}>
            Role & Access
          </Typography>
          <Typography variant="body2" sx={{ color: "semiDark.main", mt: 0.5 }}>
            Set module-level create, read, update and delete permissions.
          </Typography>
        </Box>
        <HeaderControls>
          <RoleNameField
            label="Name of Role"
            value={roleName}
            onChange={(event) => onRoleNameChange?.(event.target.value)}
            size="small"
            disabled={!editable}
          />
          {headerActions ? (
            <HeaderActions className="permission-matrix-actions">
              {headerActions}
            </HeaderActions>
          ) : null}
        </HeaderControls>
      </MatrixHeader>

      <TableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <HeaderCell>Module</HeaderCell>
              {actionColumns.map((action) => (
                <HeaderCell key={action} align="center">
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </HeaderCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {visibleModules.map((moduleRow) => (
              <StyledTableRow key={moduleRow.module}>
                <ModuleCell>
                  <Typography sx={{ fontWeight: 600, color: "dark.main" }}>
                    {moduleRow.module}
                  </Typography>
                </ModuleCell>

                {actionColumns.map((action) => (
                  <PermissionCell key={`${moduleRow.module}-${action}`} align="center">
                    <Checkbox
                      checked={Boolean(moduleRow.actions?.[action])}
                      disabled={!editable}
                      onChange={() =>
                        onTogglePermission?.(moduleRow.module, action)
                      }
                      sx={{
                        color: "rgba(43, 43, 43, 0.38)",
                        "&.Mui-checked": {
                          color: "myRed.main",
                        },
                      }}
                    />
                  </PermissionCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
    </MatrixCard>
  );
}

const MatrixCard = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  border: "2px solid rgba(43, 43, 43, 0.08)",
  background: "linear-gradient(180deg, #ffffff 0%, #fff8f8 100%)",
  boxShadow: "0 20px 40px rgba(43, 43, 43, 0.08)",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: {
    borderRadius: 16,
  },
}));

const MatrixHeader = styled(Box)(({ theme }) => ({
  padding: "24px 24px 10px",
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: 16,
  position: "relative",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
  "&:hover .permission-matrix-actions": {
    opacity: 1,
    transform: "translateY(0)",
    pointerEvents: "auto",
  },
}));

const HeaderControls = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "flex-end",
  minWidth: 260,
  paddingTop: 14,
  [theme.breakpoints.down("md")]: {
    width: "100%",
    minWidth: 0,
    paddingTop: 0,
  },
}));

const RoleNameField = styled(TextField)(() => ({
  minWidth: 260,
  flex: "0 1 260px",
  "& .MuiOutlinedInput-root": {
    borderRadius: 14,
    backgroundColor: "#ffffff",
  },
}));

const HeaderActions = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: -10,
  right: 12,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  opacity: 1,
  transform: "translateY(0)",
  pointerEvents: "auto",
  transition: "all 0.2s ease",
  [theme.breakpoints.down("md")]: {
    position: "static",
    opacity: 1,
    transform: "none",
    pointerEvents: "auto",
  },
}));

export const HeaderActionButton = styled(IconButton)(({ theme }) => ({
  width: 36,
  height: 36,
  borderRadius: 12,
  backgroundColor: "#ffffff",
  border: "1px solid rgba(43, 43, 43, 0.08)",
  boxShadow: "0 10px 24px rgba(43, 43, 43, 0.08)",
  color: "#2B2B2B",
  "&:hover": {
    backgroundColor: "rgba(237, 28, 36, 0.08)",
  },
  "&.danger": {
    color: theme.palette.error.main,
  },
}));

const StyledTable = styled(Table)(() => ({
  minWidth: 720,
}));

const HeaderCell = styled(TableCell)(() => ({
  fontWeight: 700,
  color: "#2B2B2B",
  backgroundColor: "rgba(237, 28, 36, 0.06)",
  borderBottom: "1px solid rgba(43, 43, 43, 0.08)",
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:last-child td": {
    borderBottom: "none",
  },
}));

const ModuleCell = styled(TableCell)(() => ({
  minWidth: 240,
  borderBottom: "1px solid rgba(43, 43, 43, 0.08)",
}));

const PermissionCell = styled(TableCell)(() => ({
  borderBottom: "1px solid rgba(43, 43, 43, 0.08)",
}));
