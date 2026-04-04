import { axiosInstance } from "../../helper/helper";
import { endpoints } from "../EndPoints/homeEndpoints";

export const getTestimonialSection = async () => {
  try {
    const response = await axiosInstance.get(endpoints.TestimonialsActive);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching testimonial section:", error);
    throw error;
  }
};

export const createTestimonial = async (testimonialData) => {
  try {
    const payload = {
      name: testimonialData.name || "",
      profession: testimonialData.profession || "",
      description: testimonialData.description || "",
      order: Number(testimonialData.order) || 0,
      isActive: Boolean(testimonialData.isActive),
    };

    if (testimonialData.imageUrl && testimonialData.imagePublicId) {
      payload.imageUrl = testimonialData.imageUrl;
      payload.imagePublicId = testimonialData.imagePublicId;
    }

    const response = await axiosInstance.post(endpoints.Testimonials, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating testimonial:", error);
    throw error;
  }
};

export const updateTestimonial = async ({ id, ...testimonialData }) => {
  try {
    const response = await axiosInstance.put(
      `${endpoints.Testimonials}/${id}`,
      testimonialData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating testimonial:", error);
    throw error;
  }
};

export const deleteTestimonial = async (id) => {
  try {
    const response = await axiosInstance.delete(`${endpoints.Testimonials}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
};

export const updateTestimonialSection = async (sectionData) => {
  try {
    const response = await axiosInstance.put(endpoints.TestimonialSection, sectionData);
    return response.data;
  } catch (error) {
    console.error("Error updating testimonial section:", error);
    throw error;
  }
};
