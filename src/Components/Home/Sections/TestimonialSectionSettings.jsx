import { useEffect, useState } from "react";
import { Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateTestimonialSection } from "../../../Apis/HomeApis/testimonialApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";

export default function TestimonialSectionSettings({ heading, subheading }) {
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    setFormData({
      heading: heading || "",
      subheading: subheading || "",
    });
  }, [heading, subheading]);

  const updateMutation = useMutation({
    mutationFn: updateTestimonialSection,
    onSuccess: async () => {
      await queryClient.invalidateQueries(["testimonialSection"]);
    },
  });

  const handleSubmit = async () => {
    const trimmedHeading = formData.heading.trim();
    const trimmedSubheading = formData.subheading.trim();
    const useDefaultSection = !trimmedHeading && !trimmedSubheading;

    if (useDefaultSection) {
      try {
        const response = await updateMutation.mutateAsync({ defaultSection: true });
        setFormData({
          heading: response?.data?.heading || "",
          subheading: response?.data?.subheading || "",
        });
        toast.error(
          response?.message ||
            "No value was given. Default values have been applied to the testimonial section.",
        );
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
      return;
    }

    const payload = {
      heading: trimmedHeading,
      subheading: trimmedSubheading,
    };

    await toast.promise(updateMutation.mutateAsync(payload), {
      pending: "Updating testimonial section...",
      success: {
        render({ data: response }) {
          return getSuccessMessage(
            response,
            "Testimonial section updated successfully",
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

  return (
    <SettingsCard elevation={0}>
      <HeaderRow direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={600}>
          Testimonial Section Settings
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
          <HeadingRowContent>
            <FieldInput
              fullWidth
              size="small"
              value={formData.heading}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, heading: e.target.value }))
              }
            />
            <ButtonSlot>
              <UpdateButton
                variant="contained"
                onClick={handleSubmit}
                disabled={updateMutation.isPending}
              >
                Update
              </UpdateButton>
            </ButtonSlot>
          </HeadingRowContent>
        </FieldRow>
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

const HeadingRowContent = styled(Box)({
  flex: 1,
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "16px",
});

const ButtonSlot = styled(Box)({
  width: "120px",
  flexShrink: 0,
  display: "flex",
  justifyContent: "flex-end",
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
