import React, { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { PersonAddAlt1, Search, HowToReg } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  assignProgramsToCoach,
  createCoach,
  deleteCoachById,
  getCoaches,
  updateCoach,
} from "../Apis/coatchApis/coatchApi"; 

import { getProgramSection } from "../Apis/Programs/programApi"; 

import CoachTable from "../Components/CoatchManagementComponents/CoachTable";
import AssignProgramsDialog from "../Components/CoatchManagementComponents/AssignProgramsDialog";
import CreateCoachDialog from "../Components/CoatchManagementComponents/CreateCoachDialog";
import ViewCoachDialog from "../Components/CoatchManagementComponents/ViewCoachDialog";
import { PageShell, HeaderRow, FilterRow, StateCard } from "../Components/RoleManagementPageComponents/styled";

export default function CoachManagement() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Dialog / selection state ─────────────────────────────────────────
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [selectedProgramIds, setSelectedProgramIds] = useState([]);
  const [createForm, setCreateForm] = useState({ name: "", email: "", experience: "", bio: "" });

  // ── Filter state ──────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" | "active" | "inactive"

  // ── Queries ───────────────────────────────────────────────────────────
  const coachesQuery = useQuery({
    queryKey: ["coaches", searchQuery, statusFilter],
    queryFn: () => getCoaches({ search: searchQuery, status: statusFilter || undefined }),
  });

  const programsQuery = useQuery({
    queryKey: ["active-programs"],
    queryFn: getProgramSection,
  });

  const coaches = Array.isArray(coachesQuery.data?.data) ? coachesQuery.data.data : [];
  const programs = Array.isArray(programsQuery.data?.data?.programs)
    ? programsQuery.data.data.programs
    : [];

  // ── Mutations ─────────────────────────────────────────────────────────
  const createCoachMutation = useMutation({
    mutationFn: createCoach,
    onSuccess: async (res) => {
      toast.success(res?.message || "Coach created successfully.");
      await queryClient.invalidateQueries({ queryKey: ["coaches"] });
      setCreateDialogOpen(false);
      setCreateForm({ name: "", email: "", experience: "", bio: "" });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create coach."),
  });

  const assignProgramsMutation = useMutation({
    mutationFn: ({ id, programIds }) => assignProgramsToCoach(id, programIds),
    onSuccess: async (res) => {
      toast.success(res?.message || "Programs assigned successfully.");
      await queryClient.invalidateQueries({ queryKey: ["coaches"] });
      handleCloseAssignDialog();
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to assign programs."),
  });

  const updateCoachMutation = useMutation({
    mutationFn: ({ id, payload }) => updateCoach(id, payload),
    onSuccess: async (res) => {
      toast.success(res?.message || "Coach updated successfully.");
      await queryClient.invalidateQueries({ queryKey: ["coaches"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update coach."),
  });

  const deleteCoachMutation = useMutation({
    mutationFn: deleteCoachById,
    onSuccess: async (res) => {
      toast.success(res?.message || "Coach deleted successfully.");
      await queryClient.invalidateQueries({ queryKey: ["coaches"] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete coach."),
  });

  // ── Derived rows ──────────────────────────────────────────────────────
  const rows = useMemo(
    () =>
      coaches.map((coach, index) => ({
        id: coach?._id,
        serial: index + 1,
        name: coach?.name || "N/A",
        email: coach?.email || "N/A",
        isActive: Boolean(coach?.coachProfile?.isActive),
        maxStudents: coach?.coachProfile?.maxStudents ?? 0,
        assignedPrograms: Array.isArray(coach?.coachProfile?.assingedPrograms)
          ? coach.coachProfile.assingedPrograms.map((entry) => entry?.program).filter(Boolean)
          : [],
      })),
    [coaches],
  );

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleOpenAssignDialog = (row) => {
    setSelectedCoach(row);
    setSelectedProgramIds(row.assignedPrograms.map((p) => p._id));
    setAssignDialogOpen(true);
  };

  const handleCloseAssignDialog = () => {
    setAssignDialogOpen(false);
    setSelectedCoach(null);
    setSelectedProgramIds([]);
  };

  const handleOpenViewDialog = (row) => {
    setSelectedCoach(row);
    setViewDialogOpen(true);
  };

  const handleFormChange = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAssignPrograms = () => {
    if (!selectedCoach?.id || selectedProgramIds.length === 0) return;
    assignProgramsMutation.mutate({ id: selectedCoach.id, programIds: selectedProgramIds });
  };

  const handleToggleActive = (row) => {
    updateCoachMutation.mutate({ id: row.id, payload: { isActive: !row.isActive } });
  };

  const handleSubmitCreate = () => {
    createCoachMutation.mutate({
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      experience: createForm.experience.trim(),
      bio: createForm.bio.trim(),
    });
  };

  return (
    <PageShell>
      <HeaderRow>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "dark.main", mb: 1 }}>
            Coach Management
          </Typography>
          <Typography sx={{ color: "semiDark.main" }}>
            Create coaches, assign programs, and manage coach access.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          {/* Future feature: review who applied to become a coach. UI only for now. */}
          <Button
            variant="outlined"
            startIcon={<HowToReg />}
            onClick={() => navigate("/coach-applications")}
            sx={{ borderRadius: 999, px: 2.5, py: 1.2, textTransform: "none", fontWeight: 700 }}
          >
            Coach Applications
          </Button>

          <Button
            variant="contained"
            startIcon={<PersonAddAlt1 />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              backgroundColor: "myRed.main",
              borderRadius: 999,
              px: 2.5,
              py: 1.2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Create Coach
          </Button>
        </Box>
      </HeaderRow>

      <FilterRow>
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or email…"
          size="small"
          sx={{ flex: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "semiDark.main", fontSize: 20 }} />
              </InputAdornment>
            ),
            sx: { borderRadius: 3 },
          }}
        />

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel id="coach-status-filter-label">Status</InputLabel>
          <Select
            labelId="coach-status-filter-label"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ borderRadius: 3 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </FilterRow>

      {(coachesQuery.isError || programsQuery.isError) && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {coachesQuery.error?.response?.data?.message ||
            programsQuery.error?.response?.data?.message ||
            "Failed to load coach management data."}
        </Alert>
      )}

      {coachesQuery.isLoading ? (
        <StateCard>
          <Typography>Loading coaches...</Typography>
        </StateCard>
      ) : (
        <CoachTable
          rows={rows}
          isDeleting={deleteCoachMutation.isPending}
          isUpdating={updateCoachMutation.isPending}
          onOpenAssign={handleOpenAssignDialog}
          onOpenView={handleOpenViewDialog}
          onDelete={(id) => deleteCoachMutation.mutate(id)}
          onToggleActive={handleToggleActive}
        />
      )}

      <AssignProgramsDialog
        open={assignDialogOpen}
        onClose={handleCloseAssignDialog}
        selectedCoach={selectedCoach}
        selectedProgramIds={selectedProgramIds}
        onProgramIdsChange={setSelectedProgramIds}
        programs={programs}
        isAssigning={assignProgramsMutation.isPending}
        onAssign={handleAssignPrograms}
      />

      <CreateCoachDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        form={createForm}
        onFormChange={handleFormChange}
        isCreating={createCoachMutation.isPending}
        onSubmit={handleSubmitCreate}
      />

      <ViewCoachDialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} coach={selectedCoach} />
    </PageShell>
  );
}