import { axiosInstance } from "../../helper/helper";
import { endpoints } from "../EndPoints/homeEndpoints";

export const getBannerSections = async () => {
  try {
    const response = await axiosInstance.get(endpoints.getBannerAdmin);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching banner sections:", error);
    throw error;
  }
};

export const createBanner = async (bannerData) => {
  try {
    const payload = {
      subHeading: bannerData.subHeading || "",
      headings: bannerData.headings || [],
      description: bannerData.description || "",
      guestButtonText: bannerData.guestButtonText || "",
      authButtonText: bannerData.authButtonText || "",
      isActive: Boolean(bannerData.isActive),
    };
    if (bannerData.imageUrl && bannerData.imagePublicId) {
      payload.imageUrl = bannerData.imageUrl;
      payload.imagePublicId = bannerData.imagePublicId;
    }


    const response = await axiosInstance.post(endpoints.Banner, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating banner:", error);
    throw error;
  }
};

export const updateBanner = async ({ id, ...bannerData }) => {
  try {
    const response = await axiosInstance.put(`${endpoints.Banner}/${id}`, bannerData);
    return response.data;
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};

export const deleteBanner = async (id) => {
  try {
    const response = await axiosInstance.delete(`${endpoints.Banner}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting banner:", error);
    throw error;
  }
};
