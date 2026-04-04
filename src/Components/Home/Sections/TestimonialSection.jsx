import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTestimonialSection } from "../../../Apis/HomeApis/testimonialApi";
import TestimonialFormModal from "../Modals/TestimonialFormModal";
import TestimonialSectionSettings from "./TestimonialSectionSettings";
import TestimonialTable from "./TestimonialTable";

export default function TestimonialSection() {
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
    queryKey: ["testimonialSection"],
    queryFn: getTestimonialSection,
  });

  const rows = Array.isArray(sectionData?.testimonials)
    ? sectionData.testimonials.map((item) => ({ ...item, id: item._id }))
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
        <TestimonialSectionSettings
          heading={sectionData?.heading}
          subheading={sectionData?.subheading}
        />

        <TestimonialTable
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

      <TestimonialFormModal
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
