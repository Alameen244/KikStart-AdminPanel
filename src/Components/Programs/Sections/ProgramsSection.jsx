import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProgramSection } from "../../../Apis/Programs/programApi";
import ProgramFormModal from "../Modals/ProgramFormModal";
import ProgramSectionSettings from "./ProgramSectionSettings";
import ProgramTable from "./ProgramTable";

export default function ProgramsSection() {
  const [openForm, setOpenForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState({
    type: "include",
    ids: new Set(),
  });

  const {
    data: sectionData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["programSection"],
    queryFn: getProgramSection,
  });

  const rows = Array.isArray(sectionData?.programs)
    ? sectionData.programs.map((item) => ({ ...item, id: item._id }))
    : [];

  const handleCreate = () => {
    setSelectedRow(null);
    setOpenForm(true);
  };

  const handleEdit = (row) => {
    setSelectedRow(row);
    setOpenForm(true);
  };

  return (
    <SectionWrapper>
      <ContentStack>
        <ProgramSectionSettings
          rows={rows}
          heading={sectionData?.heading}
          subheading={sectionData?.subheading}
          homeLimit={sectionData?.homeLimit}
        />

        <ProgramTable
          rows={rows}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onCreate={handleCreate}
          onEdit={handleEdit}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
      </ContentStack>

      <ProgramFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        data={selectedRow}
        rows={rows}
      />
    </SectionWrapper>
  );
}

const SectionWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

const ContentStack = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "28px",
});
