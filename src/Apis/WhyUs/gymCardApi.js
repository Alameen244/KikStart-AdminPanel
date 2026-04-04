import { axiosInstance } from "../../helper/helper";
import { whyUsEndpoints } from "../EndPoints/whyUsEndpoints";

export const getGymCardSection = async () => {
  try {
    const response = await axiosInstance.get(whyUsEndpoints.GymCardsAdmin);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching gym card section:", error);
    throw error;
  }
};

export const createGymCard = async (cardData) => {
  try {
    const payload = {
      title: cardData.title || "",
      icon: cardData.icon || "",
      description: cardData.description || "",
      iconBgColor: cardData.iconBgColor || "",
      order: Number(cardData.order) || 0,
      isActive: Boolean(cardData.isActive),
    };

    const response = await axiosInstance.post(whyUsEndpoints.GymCards, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating gym card:", error);
    throw error;
  }
};

export const updateGymCard = async ({ id, ...cardData }) => {
  try {
    const response = await axiosInstance.put(
      `${whyUsEndpoints.GymCards}/${id}`,
      cardData,
    );
    return response.data;
  } catch (error) {
    console.error("Error updating gym card:", error);
    throw error;
  }
};

export const deleteGymCard = async (id) => {
  try {
    const response = await axiosInstance.delete(`${whyUsEndpoints.GymCards}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting gym card:", error);
    throw error;
  }
};

export const updateGymCardSection = async (sectionData) => {
  try {
    const response = await axiosInstance.put(whyUsEndpoints.GymCardSection, sectionData);
    return response.data;
  } catch (error) {
    console.error("Error updating gym card section:", error);
    throw error;
  }
};
