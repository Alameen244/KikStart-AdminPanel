import { axiosInstance } from "../../helper/helper";
import { faqsEndpoints } from "../EndPoints/faqsEndpoints";

export const getFAQSection = async () => {
  try {
    const response = await axiosInstance.get(faqsEndpoints.FAQsAdmin);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching FAQ section:", error);
    throw error;
  }
};

export const createFAQ = async (faqData) => {
  try {
    const payload = {
      question: faqData.question || "",
      answer: faqData.answer || "",
      isActive: Boolean(faqData.isActive),
      order: Number(faqData.order) || 0,
    };

    const response = await axiosInstance.post(faqsEndpoints.FAQs, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating FAQ:", error);
    throw error;
  }
};

export const updateFAQ = async ({ id, ...faqData }) => {
  try {
    const payload = {
      ...faqData,
      ...(faqData.order !== undefined ? { order: Number(faqData.order) || 0 } : {}),
    };

    const response = await axiosInstance.put(`${faqsEndpoints.FAQs}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating FAQ:", error);
    throw error;
  }
};

export const deleteFAQ = async (id) => {
  try {
    const response = await axiosInstance.delete(`${faqsEndpoints.FAQs}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    throw error;
  }
};

export const updateFAQSection = async (sectionData) => {
  try {
    const response = await axiosInstance.put(faqsEndpoints.FAQSection, sectionData);
    return response.data;
  } catch (error) {
    console.error("Error updating FAQ section:", error);
    throw error;
  }
};
