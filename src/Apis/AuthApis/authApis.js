import { axiosInstance } from "../../helper/helper.js";
import { authEndpoints } from "../EndPoints/AuthEndPoints/auhtEndPoints.js";

export const login = async (payload) => {
    const res = await axiosInstance.post(authEndpoints.LOGIN, payload);
    return res?.data;
}

export const register = async (payload) => {
    const normalizedPayload = {
        ...payload,
        pinCode: payload?.pinCode || payload?.passCode
    };
    delete normalizedPayload.passCode;
    delete normalizedPayload.confirmPassword;

    const res = await axiosInstance.post(authEndpoints.SIGN_UP, normalizedPayload);
    return res?.data;
}

export const forgotPassword = async (payload) => {
    const res = await axiosInstance.post(authEndpoints.FORGOT_PASSWORD, payload);
    return res?.data;
}

export const resetPassword = async (payload) => {
    const res = await axiosInstance.post(authEndpoints.RESET_PASSWORD, payload);
    return res?.data;
}


export const sendOtp = async (payload) => {
    const res = await axiosInstance.post(authEndpoints.SEND_OTP, payload);
    return res?.data;
}

export const verifyForgotOtp = async (payload) => {
    const res = await axiosInstance.post(authEndpoints.VERIFY_FORGOT_OTP, payload);
    return res?.data;
}

export const verifySignUpOtp = async (payload) => {
    const res = await axiosInstance.post(authEndpoints.VERIFY_SIGN_UP_OTP, payload);
    return res?.data;
}

export const resendOTP = async (payload) => {
    const res = await axiosInstance.post(authEndpoints.RESEND_OTP, payload);
    return res?.data;
}

export const getMe = async () => {
    const res = await axiosInstance.get(authEndpoints.ME);
    return res?.data;
}

export const getAllUsers = async () => {
    const res = await axiosInstance.get(authEndpoints.GET_USERS);
    return res?.data;
}

export const getUserById = async (id) => {
    const res = await axiosInstance.get(`${authEndpoints.GET_USERS}${id}`);
    return res?.data;
}

export const deleteUserById = async (id) => {
    const res = await axiosInstance.delete(`${authEndpoints.GET_USERS}${id}`);
    return res?.data;
}

export const getSubAdmins = async () => {
    const res = await axiosInstance.get(authEndpoints.SUBADMINS);
    return res?.data;
}

export const createSubAdmin = async (payload) => {
    const res = await axiosInstance.post(authEndpoints.SUBADMINS, payload);
    return res?.data;
}

export const assignPermissionRoleToSubAdmin = async ({ userId, permissionRoleId }) => {
    const res = await axiosInstance.put(
        `${authEndpoints.SUBADMINS}/${userId}/permission-role`,
        { permissionRoleId },
    );
    return res?.data;
}

export const deleteSubAdminById = async (id) => {
    const res = await axiosInstance.delete(`${authEndpoints.SUBADMINS}/${id}`);
    return res?.data;
}
