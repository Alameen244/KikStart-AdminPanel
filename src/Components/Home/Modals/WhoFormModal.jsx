import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createWho, updateWho } from "../../../Apis/HomeApis/whoApi";
import { uploadMultipleImages } from "../../../Apis/ImageUploadApi/imageUploadApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import SectionModalShell from "../../FormComponents/SectionModalShell";
import FormColumnLayout from "../../FormComponents/FormColumnLayout";
import TextInputBlock from "../../FormComponents/TextInputBlock";
import StatusToggleBlock from "../../FormComponents/StatusToggleBlock";
import SingleImageUploadBlock from "../../FormComponents/SingleImageUploadBlock";
import RichTextBlock from "../../FormComponents/RichTextBlock";
import FormCardBlock from "../../FormComponents/FormCardBlock";

const defaultForm = {
  subHeading: "",
  heading: "",
  description: "",
  buttonText: "",
  image1: null,
  image2: null,
  isActive: true,
};

const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ header: [1, 2, 3, false] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

export default function WhoFormModal({ open, onClose, data }) {
  const [formData, setFormData] = useState(defaultForm);
  const isEdit = Boolean(data);
  const queryClient = useQueryClient();

  // Populate the form in edit mode, or reset it when opening a fresh create flow.
  useEffect(() => {
    if (!open) return;

    if (data) {
      setFormData({
        subHeading: data.subHeading || "",
        heading: data.heading || "",
        description: data.description || "",
        buttonText: data.buttonText || "",
        image1: data.image1?.url || null,
        image2: data.image2?.url || null,
        isActive: Boolean(data.isActive),
      });
      return;
    }

    setFormData({ ...defaultForm });
  }, [open, data?._id]);

  const createWhoMutation = useMutation({
    mutationFn: createWho,
  });

  const updateWhoMutation = useMutation({
    mutationFn: updateWho,
  });

  const uploadImagesMutation = useMutation({
    mutationFn: uploadMultipleImages,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Prepare a clean payload and stop early if required content is missing.
  const buildPayload = (currentFormData, uploadedImages = {}) => {
    const trimmedSubHeading = currentFormData.subHeading.trim();
    const trimmedHeading = currentFormData.heading.trim();
    const strippedDescription = currentFormData.description
      .replace(/<[^>]*>/g, "")
      .trim();

    if (!trimmedSubHeading) {
      toast.error("Subheading is required");
      return null;
    }

    if (!trimmedHeading) {
      toast.error("Heading is required");
      return null;
    }

    if (!strippedDescription) {
      toast.error("Description is required");
      return null;
    }

    const payload = {
      subHeading: trimmedSubHeading,
      heading: trimmedHeading,
      description: currentFormData.description,
      buttonText: currentFormData.buttonText.trim(),
      isActive: currentFormData.isActive,
    };

    if (uploadedImages.image1) {
      payload.image1Url = uploadedImages.image1.url;
      payload.image1PublicId = uploadedImages.image1.public_id;
    }

    if (uploadedImages.image2) {
      payload.image2Url = uploadedImages.image2.url;
      payload.image2PublicId = uploadedImages.image2.public_id;
    }

    return payload;
  };

  // Upload only the images that were newly selected in the current session.
  const getUploadedImageMap = async (currentFormData) => {
    const uploadQueue = [
      { key: "image1", file: currentFormData.image1 },
      { key: "image2", file: currentFormData.image2 },
    ].filter(({ file }) => file && typeof file !== "string");

    if (!uploadQueue.length) {
      return {};
    }

    const response = await uploadImagesMutation.mutateAsync({
      files: uploadQueue.map(({ file }) => file),
      folderKey: "OTHERS",
    });

    const uploadedImages = response?.images || [];

    return uploadQueue.reduce((accumulator, item, index) => {
      if (uploadedImages[index]) {
        accumulator[item.key] = uploadedImages[index];
      }

      return accumulator;
    }, {});
  };

  // Build the final request body after optional uploads, then create or update the section.
  const handleSubmit = async () => {
    const draftPayload = buildPayload(formData, {});
    if (!draftPayload) return;

    const hasNewImages =
      (formData.image1 && typeof formData.image1 !== "string") ||
      (formData.image2 && typeof formData.image2 !== "string");

    const actionPromise = (async () => {
      const currentFormData = { ...formData };
      const uploadedImages = await getUploadedImageMap(currentFormData);
      const payload = {
        ...draftPayload,
        ...(uploadedImages.image1
          ? {
              image1Url: uploadedImages.image1.url,
              image1PublicId: uploadedImages.image1.public_id,
            }
          : {}),
        ...(uploadedImages.image2
          ? {
              image2Url: uploadedImages.image2.url,
              image2PublicId: uploadedImages.image2.public_id,
            }
          : {}),
      };

      const response = isEdit
        ? await updateWhoMutation.mutateAsync({
          id: data._id,
          ...payload,
        })
        : await createWhoMutation.mutateAsync(payload);

      await queryClient.invalidateQueries(["whoData"]);
      onClose();
      return response;
    })();

    await toast.promise(actionPromise, {
      pending: hasNewImages
        ? isEdit
          ? "Uploading images and updating who section..."
          : "Uploading images and creating who section..."
        : isEdit
          ? "Updating who section..."
          : "Creating who section...",
      success: {
        render({ data: response }) {
          return getSuccessMessage(
            response,
            isEdit
              ? "Who section updated successfully"
              : "Who section created successfully",
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

  const isSubmitting =
    createWhoMutation.isPending ||
    updateWhoMutation.isPending ||
    uploadImagesMutation.isPending;

  return (
    <SectionModalShell
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Who Section" : "Create Who Section"}
      submitLabel={isEdit ? "Update" : "Create"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FormColumnLayout
        leftContent={
          <>
            <TextInputBlock
              title="Subheading"
              placeholder="Enter who subheading"
              value={formData.subHeading}
              onChange={(value) => handleChange("subHeading", value)}
            />

            <TextInputBlock
              title="Heading"
              placeholder="Enter who heading"
              value={formData.heading}
              onChange={(value) => handleChange("heading", value)}
            />

            <FormCardBlock title="Button And Status">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Button Text"
                  placeholder="Enter button text"
                  value={formData.buttonText}
                  onChange={(e) => handleChange("buttonText", e.target.value)}
                />
                <StatusToggleBlock
                  checked={formData.isActive}
                  onChange={(value) => handleChange("isActive", value)}
                />
              </Box>
            </FormCardBlock>

            <SingleImageUploadBlock
              title="Image 1"
              image={formData.image1}
              altText="who image 1 preview"
              onChange={(file) => handleChange("image1", file)}
              disabled={isSubmitting}
              previewHeight="120px"
            />

            <SingleImageUploadBlock
              title="Image 2"
              image={formData.image2}
              altText="who image 2 preview"
              onChange={(file) => handleChange("image2", file)}
              disabled={isSubmitting}
              previewHeight="120px"
            />
          </>
        }
        rightContent={
          <RichTextBlock
            title="Description"
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
            modules={quillModules}
            placeholder="Enter who description..."
          />
        }
      />
    </SectionModalShell>
  );
}
