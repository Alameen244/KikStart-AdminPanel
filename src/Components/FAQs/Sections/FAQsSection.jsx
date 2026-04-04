import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFAQSection } from "../../../Apis/FAQs/faqApi";
import FAQFormModal from "../Modals/FAQFormModal";
import FAQSectionSettings from "./FAQSectionSettings";
import FAQTable from "./FAQTable";

export default function FAQsSection() {
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
      queryKey: ["faqSection"],
    queryFn: getFAQSection,
  });

  //  const numberOfFaqs = sectionData?.faqs?.length || 0;

  const rows = Array.isArray(sectionData?.faqs)
    ? sectionData.faqs.map((item) => ({ ...item, id: item._id }))
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
        <FAQSectionSettings
          rows={rows}
          heading={sectionData?.heading}
          subheading={sectionData?.subheading}
          image={sectionData?.image}
          homeLimit={sectionData?.homeLimit}
        />

        <FAQTable
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

      <FAQFormModal
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
