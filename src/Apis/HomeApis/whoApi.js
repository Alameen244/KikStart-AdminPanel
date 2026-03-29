  import { axiosInstance } from "../../helper/helper";
import { endpoints } from "../EndPoints/endpoints";

export const getWhoSections = async () => {
  try {
    const response = await axiosInstance.get(endpoints.getWhoAdmin);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching who sections:", error);
    throw error;
  }
};

export const createWho = async (whoData) => {
  try {
    const payload = {
      subHeading: whoData.subHeading || "",
      heading: whoData.heading || "",
      description: whoData.description || "",
      buttonText: whoData.buttonText || "",
      isActive: Boolean(whoData.isActive),
    };

    if (whoData.image1Url && whoData.image1PublicId) {
      payload.image1Url = whoData.image1Url;
      payload.image1PublicId = whoData.image1PublicId;
    }

    if (whoData.image2Url && whoData.image2PublicId) {
      payload.image2Url = whoData.image2Url;
      payload.image2PublicId = whoData.image2PublicId;
    }

    const response = await axiosInstance.post(endpoints.Who, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating who section:", error);
    throw error;
  }
};

export const updateWho = async ({ id, ...whoData }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.Who}/${id}`, whoData);
    return response.data;
  } catch (error) {
    console.error("Error updating who section:", error);
    throw error;
  }
};

export const deleteWho = async (id) => {
  try {
    const response = await axiosInstance.delete(`${endpoints.Who}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting who section:", error);
    throw error;
  }
};
