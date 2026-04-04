import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createGymCard,
  updateGymCard,
} from "../../../Apis/WhyUs/gymCardApi";
import uploadSingleImage from "../../../Apis/ImageUploadApi/imageUploadApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import ColorPickerBlock from "../../FormComponents/ColorPickerBlock";
import FormCardBlock from "../../FormComponents/FormCardBlock";
import FormColumnLayout from "../../FormComponents/FormColumnLayout";
import NumberFieldBlock from "../../FormComponents/NumberFieldBlock";
import RichTextBlock from "../../FormComponents/RichTextBlock";
import SectionModalShell from "../../FormComponents/SectionModalShell";
import SingleImageUploadBlock from "../../FormComponents/SingleImageUploadBlock";
import StatusToggleBlock from "../../FormComponents/StatusToggleBlock";
import TextInputBlock from "../../FormComponents/TextInputBlock";

const defaultForm = {
  title: "",
  description: "",
  icon: null,
  iconUrl: "",
  iconBgColor: "#91d0db",
  order: "0",
  isActive: true,
};

const getNextOrderValue = (cards = []) => {
  if (!Array.isArray(cards) || cards.length === 0) {
    return "1";
  }

  const maxOrder = cards.reduce((highestOrder, card) => {
    const currentOrder = Number(card?.order);
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

export default function WhyUsFormModal({ open, onClose, data, rows = [] }) {
  const [formData, setFormData] = useState(defaultForm);
  const isEdit = Boolean(data);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) return;

    if (data) {
      setFormData({
        title: data.title || "",
        description: data.description || "",
        icon: data.icon || null,
        iconUrl: "",
        iconBgColor: data.iconBgColor,
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
    mutationFn: createGymCard,
  });

  const updateMutation = useMutation({
    mutationFn: updateGymCard,
  });

  const uploadImageMutation = useMutation({
    mutationFn: uploadSingleImage,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleIconFileChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      icon: file || null,
      iconUrl: "",
    }));
  };

  const handleIconUrlChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      iconUrl: value,
      icon: value.trim() ? null : prev.icon,
    }));
  };

  const clearIconSelection = () => {
    setFormData((prev) => ({
      ...prev,
      icon: typeof prev.icon === "string" ? prev.icon : null,
      iconUrl: "",
    }));
  };

  const buildPayload = (currentFormData) => {
    const trimmedTitle = currentFormData.title.trim();
    const strippedDescription = currentFormData.description
      .replace(/<[^>]*>/g, "")
      .trim();
    const trimmedIconColor = currentFormData.iconBgColor.trim();

    if (!trimmedTitle) {
      toast.error("Title is required");
      return null;
    }

    if (!strippedDescription) {
      toast.error("Description is required");
      return null;
    }

    if (!trimmedIconColor) {
      toast.error("Icon background color is required");
      return null;
    }

    return {
      title: trimmedTitle,
      description: currentFormData.description,
      iconBgColor: trimmedIconColor,
      order: Number(currentFormData.order) || 0,
      isActive: currentFormData.isActive,
    };
  };

  const handleSubmit = async () => {
    const draftPayload = buildPayload(formData);
    if (!draftPayload) return;

    const trimmedIconUrl = formData.iconUrl.trim();
    const hasNewIcon = formData.icon && typeof formData.icon !== "string";

    const actionPromise = (async () => {
      let uploadedIcon = null;

      if (trimmedIconUrl) {
        uploadedIcon = await uploadImageMutation.mutateAsync({
          imageUrl: trimmedIconUrl,
          folderKey: "OTHERS",
        });
      } else if (hasNewIcon) {
        uploadedIcon = await uploadImageMutation.mutateAsync({
          file: formData.icon,
          folderKey: "OTHERS",
        });
      }

      const payload = {
        ...draftPayload,
        icon:
          uploadedIcon?.url ||
          (typeof formData.icon === "string" ? formData.icon.trim() : ""),
      };

      if (!payload.icon) {
        toast.error("Icon is required");
        return null;
      }

      const response = isEdit
        ? await updateMutation.mutateAsync({ id: data._id, ...payload })
        : await createMutation.mutateAsync(payload);

      await queryClient.invalidateQueries(["gymCardSection"]);
      onClose();
      return response;
    })();

    await toast.promise(actionPromise, {
      pending: hasNewIcon
        ? isEdit
          ? "Uploading icon and updating Why Us card..."
          : "Uploading icon and creating Why Us card..."
        : isEdit
          ? "Updating Why Us card..."
          : "Creating Why Us card...",
      success: {
        render({ data: response }) {
          if (!response) return "Why Us card saved";
          return getSuccessMessage(
            response,
            isEdit
              ? "Why Us card updated successfully"
              : "Why Us card created successfully",
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
      title={isEdit ? "Edit Why Us Card" : "Create Why Us Card"}
      submitLabel={isEdit ? "Update" : "Create"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FormColumnLayout
        leftContent={
          <>
            <TextInputBlock
              title="Title"
              placeholder="Enter Why Us card title"
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

            <ColorPickerBlock
              title="Icon Background Color"
              value={formData.iconBgColor}
              onChange={(value) => handleChange("iconBgColor", value)}
            />

            <FormCardBlock title="Status">
              <StatusToggleBlock
                checked={formData.isActive}
                onChange={(value) => handleChange("isActive", value)}
              />
            </FormCardBlock>

            <SingleImageUploadBlock
              title="Icon"
              image={formData.icon}
              imageUrl={formData.iconUrl}
              altText="why us icon preview"
              onChange={handleIconFileChange}
              onUrlChange={handleIconUrlChange}
              onClear={clearIconSelection}
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
            placeholder="Enter Why Us card description..."
          />
        }
      />
    </SectionModalShell>
  );
}
