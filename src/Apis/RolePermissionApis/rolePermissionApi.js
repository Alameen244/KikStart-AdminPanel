import { axiosInstance } from "../../helper/helper.js";
import { rolePermissionEndpoints } from "../EndPoints/rolePermissionEndpoints.js";

export const getRoles = async () => {
  const res = await axiosInstance.get(rolePermissionEndpoints.ROLES);
  return res?.data;
};

export const getRoleById = async (id) => {
  const res = await axiosInstance.get(`${rolePermissionEndpoints.ROLES}/${id}`);
  return res?.data;
};

export const createRole = async (payload) => {
  const res = await axiosInstance.post(rolePermissionEndpoints.ROLES, payload);
  return res?.data;
};

export const updateRole = async ({ id, payload }) => {
  const res = await axiosInstance.put(`${rolePermissionEndpoints.ROLES}/${id}`, payload);
  return res?.data;
};

export const deleteRole = async (id) => {
  const res = await axiosInstance.delete(`${rolePermissionEndpoints.ROLES}/${id}`);
  return res?.data;
};
