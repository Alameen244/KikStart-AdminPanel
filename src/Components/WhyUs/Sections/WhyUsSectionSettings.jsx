import { useEffect, useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateGymCardSection } from "../../../Apis/WhyUs/gymCardApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import NumberFieldBlock from "../../FormComponents/NumberFieldBlock";

export default function WhyUsSectionSettings({
  rows,
  heading,
  subheading,
  sectionDescription,
  homeLimit,
}) {
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    sectionDescription: "",
    homeLimit: "4",
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData({
      heading: heading || "",
      subheading: subheading || "",
      sectionDescription: sectionDescription || "",
      homeLimit: String(homeLimit ?? 4),
    });
  }, [heading, subheading, sectionDescription, homeLimit]);

  const updateMutation = useMutation({
    mutationFn: updateGymCardSection,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["gymCardSection"]);
    },
  });

  const handleSubmit = async () => {
    const trimmedHeading = formData.heading.trim();
    const trimmedSubheading = formData.subheading.trim();
    const trimmedDescription = formData.sectionDescription.trim();
    const normalizedHomeLimit =
      formData.homeLimit === "" ? "" : Number(formData.homeLimit);
    const useDefaultSection =
      !trimmedHeading &&
      !trimmedSubheading &&
      !trimmedDescription &&
      formData.homeLimit === "";

    if (useDefaultSection) {
      try {
        const response = await updateMutation.mutateAsync({ defaultSection: true });
        setFormData({
          heading: response?.data?.heading || "",
          subheading: response?.data?.subheading || "",
          sectionDescription: response?.data?.sectionDescription || "",
          homeLimit: String(response?.data?.homeLimit ?? 4),
        });
        toast.error(
          response?.message ||
            "No value was given. Default values have been applied to the Why Us section.",
        );
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
      return;
    }

    if (formData.homeLimit !== "" && Number.isNaN(normalizedHomeLimit)) {
      toast.error("Home limit must be a valid number");
      return;
    }
    if (formData.homeLimit && rows.length < normalizedHomeLimit) {
      toast.error("Home limit cannot be greater than the number of Why Us cards");
      return;
    }

    const actionPromise = updateMutation.mutateAsync({
      heading: trimmedHeading,
      subheading: trimmedSubheading,
      sectionDescription: trimmedDescription,
      ...(formData.homeLimit !== "" ? { homeLimit: normalizedHomeLimit } : {}),
    });

    await toast.promise(actionPromise, {
      pending: "Updating Why Us section...",
      success: {
        render({ data: response }) {
          return getSuccessMessage(
            response,
            "Why Us section updated successfully",
          );
        },
      },
      error: {
        render({ data: error }) {
          return getErrorMessage(error);
        },
      },
    });
  };

  const isSubmitting = updateMutation.isPending;

  return (
    <SettingsCard elevation={0}>
      <HeaderRow direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={600}>
          Why Us Section Settings
        </Typography>
      </HeaderRow>

      <FieldsWrapper>
        <FieldRow direction={{ xs: "column", md: "row" }} spacing={2}>
          <FieldLabel>Subheading</FieldLabel>
          <FieldInput
            fullWidth
            size="small"
            value={formData.subheading}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, subheading: e.target.value }))
            }
          />
        </FieldRow>

        <FieldRow direction={{ xs: "column", md: "row" }} spacing={2}>
          <FieldLabel>Heading</FieldLabel>
          <FieldInput
            fullWidth
            size="small"
            value={formData.heading}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, heading: e.target.value }))
            }
          />
        </FieldRow>

        <FieldRow direction={{ xs: "column", md: "row" }} spacing={2}>
          <FieldLabel>Description</FieldLabel>
          <FieldInput
            fullWidth
            size="small"
            multiline
            minRows={5}
            value={formData.sectionDescription}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                sectionDescription: e.target.value,
              }))
            }
          />
        </FieldRow>

        <BlockRow>
          <NumberFieldBlock
            title="Home Limit"
            placeholder="Enter home limit"
            value={formData.homeLimit}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, homeLimit: value }))
            }
            min={0}
            step={1}
          />
        </BlockRow>

        <FooterActions>
          <UpdateButton
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Update
          </UpdateButton>
        </FooterActions>
      </FieldsWrapper>
    </SettingsCard>
  );
}

const SettingsCard = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.08)",
  overflow: "hidden",
  boxShadow: theme.shadows[1],
}));

const HeaderRow = styled(Stack)({
  padding: "20px 24px",
  borderBottom: "1px solid rgba(0,0,0,0.08)",
});

const FieldsWrapper = styled(Stack)({
  padding: "20px 24px 24px",
  gap: "16px",
});

const FieldRow = styled(Stack)({
  alignItems: "flex-start",
});

const FieldLabel = styled(Typography)({
  width: "120px",
  flexShrink: 0,
  fontSize: "14px",
  fontWeight: 500,
  lineHeight: "40px",
  color: "rgba(0,0,0,0.8)",
});

const FieldInput = styled(TextField)({
  flex: 1,
});

const BlockRow = styled(Box)({
  width: "100%",
});

const FooterActions = styled(Box)({
  display: "flex",
  justifyContent: "flex-end",
  paddingTop: "4px",
});

const UpdateButton = styled(Button)(({ theme }) => ({
  minWidth: "120px",
  height: "40px",
  textTransform: "none",
  backgroundColor: theme.palette.warning.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.warning.dark,
  },
}));
