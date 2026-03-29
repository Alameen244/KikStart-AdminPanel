import { axiosInstance } from "../../helper/helper";
import { endpoints } from "../EndPoints/endpoints";

const multipartHeaders = {
  headers: {
    "Content-Type": "multipart/form-data",
  },
};

const uploadSingleImage = async ({ file, folderKey }) => {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("folder", folderKey);

  const response = await axiosInstance.post(
    endpoints.imageUpload,
    formData,
    multipartHeaders
  );

  return response.data;
};

export const uploadMultipleImages = async ({ files, folderKey }) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("images", file);
  });
  formData.append("folder", folderKey);

  const response = await axiosInstance.post(
    endpoints.multipleImageUpload,
    formData,
    multipartHeaders
  );

  return response.data;
};

export default uploadSingleImage;
