import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createFAQ, updateFAQ } from "../../../Apis/FAQs/faqApi";
import { getErrorMessage, getSuccessMessage } from "../../../helper/helper";
import FormCardBlock from "../../FormComponents/FormCardBlock";
import FormColumnLayout from "../../FormComponents/FormColumnLayout";
import NumberFieldBlock from "../../FormComponents/NumberFieldBlock";
import SectionModalShell from "../../FormComponents/SectionModalShell";
import StatusToggleBlock from "../../FormComponents/StatusToggleBlock";
import TextInputBlock from "../../FormComponents/TextInputBlock";
import RichTextBlock from "../../FormComponents/RichTextBlock";

const defaultForm = {
  question: "",
  answer: "",
  order: "0",
  isActive: true,
};

const getNextOrderValue = (faqs = []) => {
  if (!Array.isArray(faqs) || faqs.length === 0) {
    return "1";
  }

  const maxOrder = faqs.reduce((highestOrder, faq) => {
    const currentOrder = Number(faq?.order);
    return Number.isFinite(currentOrder)
      ? Math.max(highestOrder, currentOrder)
      : highestOrder;
  }, 0);

  return String(maxOrder + 1);
};

export default function FAQFormModal({ open, onClose, data, rows = [] }) {
  const [formData, setFormData] = useState(defaultForm);
  const isEdit = Boolean(data);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!open) return;

    if (data) {
      setFormData({
        question: data.question || "",
        answer: data.answer || "",
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
    mutationFn: createFAQ,
  });

  const updateMutation = useMutation({
    mutationFn: updateFAQ,
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const buildPayload = (currentFormData) => {
    const trimmedQuestion = currentFormData.question.trim();
    const trimmedAnswer = currentFormData.answer.trim();

    if (!trimmedQuestion) {
      toast.error("Question is required");
      return null;
    }

    if (!trimmedAnswer) {
      toast.error("Answer is required");
      return null;
    }

    return {
      question: trimmedQuestion,
      answer: trimmedAnswer,
      order: Number(currentFormData.order) || 0,
      isActive: currentFormData.isActive,
    };
  };

  const handleSubmit = async () => {
    const payload = buildPayload(formData);
    if (!payload) return;

    const actionPromise = (async () => {
      const response = isEdit
        ? await updateMutation.mutateAsync({ id: data._id, ...payload })
        : await createMutation.mutateAsync(payload);

      await queryClient.invalidateQueries(["faqSection"]);
      onClose();
      return response;
    })();

    await toast.promise(actionPromise, {
      pending: isEdit ? "Updating FAQ..." : "Creating FAQ...",
      success: {
        render({ data: response }) {
          return getSuccessMessage(
            response,
            isEdit ? "FAQ updated successfully" : "FAQ created successfully",
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

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <SectionModalShell
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit FAQ" : "Create FAQ"}
      submitLabel={isEdit ? "Update" : "Create"}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    >
      <FormColumnLayout
        leftContent={
          <>
            <TextInputBlock
              title="Question"
              placeholder="Enter FAQ question"
              value={formData.question}
              onChange={(value) => handleChange("question", value)}
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
          <RichTextBlock
            title="Answer"
            placeholder="Enter FAQ answer"
            value={formData.answer}
            onChange={(value) => handleChange("answer", value)}
            multiline
            minRows={12}
          />
        }
      />
    </SectionModalShell>
  );
}
