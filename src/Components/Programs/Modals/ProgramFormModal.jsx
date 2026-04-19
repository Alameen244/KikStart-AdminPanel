import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createProgram, updateProgram } from "../../../Apis/Programs/programApi";
import { uploadMultipleImages } from "../../../Apis/ImageUploadApi/imageUploadApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import FormCardBlock from "../../FormComponents/FormCardBlock";
import FormColumnLayout from "../../FormComponents/FormColumnLayout";
import MultipleImageUploadBlock from "../../FormComponents/MultipleImageUploadBlock";
import NumberFieldBlock from "../../FormComponents/NumberFieldBlock";
import RichTextBlock from "../../FormComponents/RichTextBlock";
import SectionModalShell from "../../FormComponents/SectionModalShell";
import StatusToggleBlock from "../../FormComponents/StatusToggleBlock";
import TextInputBlock from "../../FormComponents/TextInputBlock";

const defaultForm = {
  title: "",
  description: "",
  ProgramDetails: "",
  images: [],
  order: "0",
  isActive: true,
};

const getNextOrderValue = (programs = []) => {
  if (!Array.isArray(programs) || programs.length === 0) {
    return "1";
  }

  const maxOrder = programs.reduce((highestOrder, program) => {
    const currentOrder = Number(program?.order);
    return Number.isFinite(currentOrder)
      ? Math.max(highestOrder, currentOrder)
      : highestOrder;
  }, 0);

  return String(maxOrder + 1);
};

export default function ProgramFormModal({ open, onClose, data, rows = [] }) {
  const [formData, setFormData] = useState(defaultForm);
  const isEdit = Boolean(data);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) return;

    if (data) {
      setFormData({
        title: data.title || "",
        description: data.description || "",
        ProgramDetails: data.ProgramDetails || "",
        images: Array.isArray(data.images) ? data.images.map((image) => image?.url) : [],
        order: String(data.order ?? 0),
        isActive: Boolean(data.isActive),
      });
      return;
    }

    setFormData({
      ...defaultForm,
      order: getNextOrderValue(rows),
    });
  }, [open, data?._id, rows]);

  const createMutation = useMutation({
    mutationFn: createProgram,
  });

  const updateMutation = useMutation({
    mutationFn: updateProgram,
  });

  const uploadImagesMutation = useMutation({
    mutationFn: uploadMultipleImages,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = (currentFormData) => {
    const trimmedTitle = currentFormData.title.trim();
    const strippedDescription = currentFormData.description
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const strippedProgramDetails = currentFormData.ProgramDetails
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!trimmedTitle) {
      toast.error("Title is required");
      return null;
    }

    if (!strippedDescription) {
      toast.error("Description is required");
      return null;
    }

    if (!strippedProgramDetails) {
      toast.error("Program details are required");
      return null;
    }

    if (currentFormData.images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return null;
    }

    return {
      title: trimmedTitle,
      description: currentFormData.description,
      ProgramDetails: currentFormData.ProgramDetails,
      order: Number(currentFormData.order) || 0,
      isActive: currentFormData.isActive,
    };
  };

  const getPreparedImages = async (currentImages) => {
    const existingImages = Array.isArray(data?.images) ? data.images : [];
    const newFiles = currentImages.filter((image) => image instanceof File);

    let uploadedImages = [];

    if (newFiles.length) {
      const response = await uploadImagesMutation.mutateAsync({
        files: newFiles,
        folderKey: "OTHERS",
      });
      uploadedImages = response?.images || [];
    }

    let uploadedImageIndex = 0;

    return currentImages
      .map((image) => {
        if (image instanceof File) {
          const uploadedImage = uploadedImages[uploadedImageIndex];
          uploadedImageIndex += 1;

          return uploadedImage
            ? {
                url: uploadedImage.url,
                publicId: uploadedImage.public_id,
              }
            : null;
        }

        if (typeof image === "string" && image.trim() !== "") {
          const existingImage = existingImages.find(
            (item) => item?.url === image.trim()
          );

          return existingImage
            ? {
                url: existingImage.url,
                publicId: existingImage.public_id,
              }
            : null;
        }

        return null;
      })
      .filter(Boolean);
  };

  const handleSubmit = async () => {
    const payload = buildPayload(formData);
    if (!payload) return;

    const hasNewImages = formData.images.some((image) => image instanceof File);

    const actionPromise = (async () => {
      const preparedImages = await getPreparedImages(formData.images);
      const finalPayload = {
        ...payload,
        ...(formData.images.length || isEdit ? { images: preparedImages } : {}),
      };

      const response = isEdit
        ? await updateMutation.mutateAsync({ id: data._id, ...finalPayload })
        : await createMutation.mutateAsync(finalPayload);

      await queryClient.invalidateQueries(["programSection"]);
      onClose();
      return response;
    })();

    await toast.promise(actionPromise, {
      pending: hasNewImages
        ? isEdit
          ? "Uploading images and updating program..."
          : "Uploading images and creating program..."
        : isEdit
        ? "Updating program..."
        : "Creating program...",
      success: {
        render({ data: response }) {
          return getSuccessMessage(
            response,
            isEdit ? "Program updated successfully" : "Program created successfully"
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
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadImagesMutation.isPending;

  return (
    <SectionModalShell
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Program" : "Create Program"}
      submitLabel={isEdit ? "Update" : "Create"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FormColumnLayout
        leftContent={
          <>
            <MultipleImageUploadBlock
              title="Images"
              images={formData.images}
              onChange={(images) => handleChange("images", images)}
              onClear={() => handleChange("images", [])}
              disabled={isSubmitting}
              previewHeight="260px"
              altText="program preview"
              helperText="Upload up to 5 program images"
            />

            <TextInputBlock
              title="Title"
              placeholder="Enter program title"
              value={formData.title}
              onChange={(value) => handleChange("title", value)}
            />

            <NumberFieldBlock
              title="Order"
              placeholder="Enter display order"
              value={formData.order}
              onChange={(value) => handleChange("order", value)}
              min={0}
              step={1}
            />

            <FormCardBlock title="Status">
              <StatusToggleBlock
                checked={formData.isActive}
                onChange={(value) => handleChange("isActive", value)}
              />
            </FormCardBlock>
          </>
        }
        rightContent={
          <>
            <RichTextBlock
              title="Description"
              placeholder="Enter program description..."
              value={formData.description}
              onChange={(value) => handleChange("description", value)}
            />

            <RichTextBlock
              title="Program Details"
              placeholder="Enter detailed program information..."
              value={formData.ProgramDetails}
              onChange={(value) => handleChange("ProgramDetails", value)}
            />
          </>
        }
      />
    </SectionModalShell>
  );
}
