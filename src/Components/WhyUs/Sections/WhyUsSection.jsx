import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGymCardSection } from "../../../Apis/WhyUs/gymCardApi";
import WhyUsFormModal from "../Modals/WhyUsFormModal";
import WhyUsSectionSettings from "./WhyUsSectionSettings";
import WhyUsTable from "./WhyUsTable";

export default function WhyUsSection() {
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
    queryKey: ["gymCardSection"],
    queryFn: getGymCardSection,
  });

  const rows = Array.isArray(sectionData?.cards)
    ? sectionData.cards.map((item) => ({ ...item, id: item._id }))
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
        <WhyUsSectionSettings
          rows={rows}
          heading={sectionData?.heading}
          subheading={sectionData?.subheading}
          sectionDescription={sectionData?.sectionDescription}
          homeLimit={sectionData?.homeLimit}
        />

        <WhyUsTable
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

      <WhyUsFormModal
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
