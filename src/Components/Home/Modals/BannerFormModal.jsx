import { Box, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createBanner, updateBanner } from "../../../Apis/HomeApis/bannerApi";
import uploadSingleImage from "../../../Apis/ImageUploadApi/imageUploadApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import SectionModalShell from "../../FormComponents/SectionModalShell";
import FormColumnLayout from "../../FormComponents/FormColumnLayout";
import TextInputBlock from "../../FormComponents/TextInputBlock";
import HeadingListBlock from "../../FormComponents/HeadingListBlock";
import StatusToggleBlock from "../../FormComponents/StatusToggleBlock";
import SingleImageUploadBlock from "../../FormComponents/SingleImageUploadBlock";
import RichTextBlock from "../../FormComponents/RichTextBlock";
import FormCardBlock from "../../FormComponents/FormCardBlock";

const defaultForm = {
  subHeading: "",
  headings: [""],
  description: "",
  image: null,
  guestButtonText: "",
  authButtonText: "",
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

export default function BannerFormModal({ open, onClose, data }) {
  const [formData, setFormData] = useState(defaultForm);
  const isEdit = Boolean(data);
  const queryClient = useQueryClient();

  // Populate the form with existing banner data in edit mode,
  // or reset to defaults whenever the modal opens for create mode.
  useEffect(() => {
    if (!open) return;

    if (data) {
      setFormData({
        subHeading: data.subHeading || "",
        headings: data.headings?.map((h) => h.text || h) || [""],
        description: data.description || "",
        image: data.image?.url || null,
        guestButtonText: data.guestButtonText || "",
        authButtonText: data.authButtonText || "",
        isActive: Boolean(data.isActive),
      });
    } else {
      setFormData({ ...defaultForm });
    }
  }, [open, data?._id]);

  const createBannerMutation = useMutation({
    mutationFn: createBanner,
  });

  const updateBannerMutation = useMutation({
    mutationFn: updateBanner,
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadSingleImage,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Keep the heading list logic isolated so the form stays easy to scan.
  const handleHeadingChange = (index, value) => {
    const updated = [...formData.headings];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, headings: updated }));
  };

  const addHeading = () => {
    setFormData((prev) => ({ ...prev, headings: [...prev.headings, ""] }));
  };

  const removeHeading = (index) => {
    const updated = formData.headings.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, headings: updated }));
  };

  // Normalize and validate values before any upload or API request happens.
  const buildPayload = (currentFormData, imageData = null) => {
    const trimmedSubHeading = currentFormData.subHeading.trim();
    const strippedDescription = currentFormData.description
      .replace(/<[^>]*>/g, "")
      .trim();

    if (!trimmedSubHeading) {
      toast.error("subheading is required");
      return;
    }

    if (!strippedDescription) {
      toast.error("Description is required");
      return;
    }

    const payload = {
      subHeading: trimmedSubHeading,
      headings: currentFormData.headings
        .filter((h) => h.trim())
        .map((h) => ({ text: h })),
      description: currentFormData.description,
      guestButtonText: currentFormData.guestButtonText,
      authButtonText: currentFormData.authButtonText,
      isActive: currentFormData.isActive,
    };

    if (imageData) {
      payload.imageUrl = imageData.url;
      payload.imagePublicId = imageData.public_id;
    }

    return payload;
  };

  // Upload a newly selected image first, then submit either create or update.
  const handleSubmit = async () => {
    const currentFormData = { ...formData };         
    const draftPayload = buildPayload(currentFormData);
    if (!draftPayload) return;

    const hasNewImage =
      currentFormData.image && typeof currentFormData.image !== "string";

    const actionPromise = (async () => {
      let imageData = null;

      if (hasNewImage) {
        imageData = await uploadImageMutation.mutateAsync({
          file: currentFormData.image,
          folderKey: "BANNER",
        });
      }

      const payload = {
        ...draftPayload,
        ...(imageData
          ? {
              imageUrl: imageData.url,
              imagePublicId: imageData.public_id,
            }
          : {}),
      };

      const response = isEdit
        ? await updateBannerMutation.mutateAsync({ id: data._id, ...payload })
        : await createBannerMutation.mutateAsync(payload);

      await queryClient.invalidateQueries(["bannerData"]);
      onClose();
      return response;
    })();

    await toast.promise(actionPromise, {
      pending: hasNewImage
        ? isEdit
          ? "Uploading image and updating banner..."
          : "Uploading image and creating banner..."
        : isEdit
          ? "Updating banner..."
          : "Creating banner...",
      success: {
        render({ data: response }) {
          return getSuccessMessage(
            response,
            isEdit ? "Banner updated successfully" : "Banner created successfully",
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
    createBannerMutation.isPending ||
    updateBannerMutation.isPending ||
    uploadImageMutation.isPending;

  return (
    <SectionModalShell
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Banner" : "Create Banner"}
      submitLabel={isEdit ? "Update" : "Create"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FormColumnLayout
        leftContent={
          <>
            <TextInputBlock
              title="Subheading"
              placeholder="Enter banner subheading"
              value={formData.subHeading}
              onChange={(value) => handleChange("subHeading", value)}
            />

            <HeadingListBlock
              headings={formData.headings}
              onChange={handleHeadingChange}
              onAdd={addHeading}
              onRemove={removeHeading}
            />

            <FormCardBlock title="Button Labels And Status">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", gap: 1.5 }}>
                  <TextField
                    label="Guest Button"
                    fullWidth
                    size="small"
                    value={formData.guestButtonText}
                    onChange={(e) =>
                      handleChange("guestButtonText", e.target.value)
                    }
                  />
                  <TextField
                    label="Auth Button"
                    fullWidth
                    size="small"
                    value={formData.authButtonText}
                    onChange={(e) =>
                      handleChange("authButtonText", e.target.value)
                    }
                  />
                </Box>
                <StatusToggleBlock
                  checked={formData.isActive}
                  onChange={(value) => handleChange("isActive", value)}
                />
              </Box>
            </FormCardBlock>

            <SingleImageUploadBlock
              title="Banner Image"
              image={formData.image}
              altText="preview"
              onChange={(file) => handleChange("image", file)}
              disabled={uploadImageMutation.isPending}
              previewHeight="100px"
            />
          </>
        }
        rightContent={
          <RichTextBlock
            title="Description"
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
            modules={quillModules}
            placeholder="Enter banner description..."
          />
        }
      />
    </SectionModalShell>
  );
}
