import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createTestimonial,
  updateTestimonial,
} from "../../../Apis/HomeApis/testimonialApi";
import uploadSingleImage from "../../../Apis/ImageUploadApi/imageUploadApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import SectionModalShell from "../../FormComponents/SectionModalShell";
import FormColumnLayout from "../../FormComponents/FormColumnLayout";
import TextInputBlock from "../../FormComponents/TextInputBlock";
import StatusToggleBlock from "../../FormComponents/StatusToggleBlock";
import SingleImageUploadBlock from "../../FormComponents/SingleImageUploadBlock";
import RichTextBlock from "../../FormComponents/RichTextBlock";
import FormCardBlock from "../../FormComponents/FormCardBlock";
import NumberFieldBlock from "../../FormComponents/NumberFieldBlock";

const defaultForm = {
  name: "",
  profession: "",
  description: "",
  image: null,
  imageUrl: "",
  order: "0",
  isActive: true,
};

const getNextOrderValue = (testimonials = []) => {
  if (!Array.isArray(testimonials) || testimonials.length === 0) {
    return "1";
  }

  const maxOrder = testimonials.reduce((highestOrder, testimonial) => {
    const currentOrder = Number(testimonial?.order);
    return Number.isFinite(currentOrder)
      ? Math.max(highestOrder, currentOrder)
      : highestOrder;
  }, 0);

  return String(maxOrder + 1);
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

export default function TestimonialFormModal({ open, onClose, data, rows = [] }) {
  const [formData, setFormData] = useState(defaultForm);
  const isEdit = Boolean(data);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) return;

    if (data) {
      setFormData({
        name: data.name || "",
        profession: data.profession || "",
        description: data.description || "",
        image: data.image?.url || null,
        imageUrl: "",
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
    mutationFn: createTestimonial,
  });

  const updateMutation = useMutation({
    mutationFn: updateTestimonial,
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadSingleImage,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageFileChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      image: file || null,
      imageUrl: "",
    }));
  };

  const handleImageUrlChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: value,
      image: value.trim() ? null : prev.image,
    }));
  };

  const clearImageSelection = () => {
    setFormData((prev) => ({
      ...prev,
      image: typeof prev.image === "string" ? prev.image : null,
      imageUrl: "",
    }));
  };

  const buildPayload = (currentFormData) => {
    const trimmedName = currentFormData.name.trim();
    const strippedDescription = currentFormData.description
      .replace(/<[^>]*>/g, "")
      .trim();

    if (!trimmedName) {
      toast.error("Name is required");
      return null;
    }

    if (!strippedDescription) {
      toast.error("Description is required");
      return null;
    }

    return {
      name: trimmedName,
      profession: currentFormData.profession.trim(),
      description: currentFormData.description,
      order: Number(currentFormData.order) || 0,
      isActive: currentFormData.isActive,
    };
  };

  const handleSubmit = async () => {
    const draftPayload = buildPayload(formData);
    if (!draftPayload) return;

    const trimmedImageUrl = formData.imageUrl.trim();
    const hasNewImage = formData.image && typeof formData.image !== "string";

    const actionPromise = (async () => {
      let imageData = null;

      if (trimmedImageUrl) {
        imageData = await uploadImageMutation.mutateAsync({
          imageUrl: trimmedImageUrl,
          folderKey: "TESTIMONIAL",
        });
      } else if (hasNewImage) {
        imageData = await uploadImageMutation.mutateAsync({
          file: formData.image,
          folderKey: "TESTIMONIAL",
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
        ? await updateMutation.mutateAsync({ id: data._id, ...payload })
        : await createMutation.mutateAsync(payload);

      await queryClient.invalidateQueries(["testimonialSection"]);
      onClose();
      return response;
    })();

    await toast.promise(actionPromise, {
      pending: hasNewImage
        ? isEdit
          ? "Uploading image and updating testimonial..."
          : "Uploading image and creating testimonial..."
        : isEdit
          ? "Updating testimonial..."
          : "Creating testimonial...",
      success: {
        render({ data: response }) {
          return getSuccessMessage(
            response,
            isEdit
              ? "Testimonial updated successfully"
              : "Testimonial created successfully",
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
    uploadImageMutation.isPending;

  return (
    <SectionModalShell
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Testimonial" : "Create Testimonial"}
      submitLabel={isEdit ? "Update" : "Create"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FormColumnLayout
        leftContent={
          <>
            <TextInputBlock
              title="Name"
              placeholder="Enter client name"
              value={formData.name}
              onChange={(value) => handleChange("name", value)}
            />

            <TextInputBlock
              title="Profession"
              placeholder="Enter profession"
              value={formData.profession}
              onChange={(value) => handleChange("profession", value)}
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

            <SingleImageUploadBlock
              title="Image"
              image={formData.image}
              imageUrl={formData.imageUrl}
              altText="testimonial preview"
              onChange={handleImageFileChange}
              onUrlChange={handleImageUrlChange}
              onClear={clearImageSelection}
              disabled={isSubmitting}
              previewHeight="160px"
            />
          </>
        }
        rightContent={
          <RichTextBlock
            title="Description"
            value={formData.description}
            onChange={(value) => handleChange("description", value)}
            modules={quillModules}
            placeholder="Enter testimonial description..."
          />
        }
      />
    </SectionModalShell>
  );
}
