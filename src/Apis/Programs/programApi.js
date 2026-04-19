import { axiosInstance } from "../../helper/helper";
import { programEndpoints } from "../EndPoints/programEndpoints";

export const getProgramSection = async () => {
  try {
    const response = await axiosInstance.get(programEndpoints.ProgramsAdmin);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching program section:", error);
    throw error;
  }
};

export const createProgram = async (programData) => {
  try {
    const payload = {
      title: programData.title || "",
      description: programData.description || "",
      ProgramDetails: programData.ProgramDetails || "",
      isActive: Boolean(programData.isActive),
      order: Number(programData.order) || 0,
      ...(Array.isArray(programData.images) ? { images: programData.images } : {}),
    };

    const response = await axiosInstance.post(programEndpoints.Programs, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating program:", error);
    throw error;
  }
};

export const updateProgram = async ({ id, ...programData }) => {
  try {
    const payload = {
      ...programData,
      ...(programData.order !== undefined
        ? { order: Number(programData.order) || 0 }
        : {}),
    };

    const response = await axiosInstance.put(
      `${programEndpoints.Programs}/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating program:", error);
    throw error;
  }
};

export const deleteProgram = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `${programEndpoints.Programs}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting program:", error);
    throw error;
  }
};

export const updateProgramSection = async (sectionData) => {
  try {
    const response = await axiosInstance.put(
      programEndpoints.ProgramSection,
      sectionData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating program section:", error);
    throw error;
  }
};
