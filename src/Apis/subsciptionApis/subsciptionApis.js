// Apis/subscriptionApi.js

import { axiosInstance } from "../../helper/helper.js";
import { subscriptionEndpoints } from "../EndPoints/subsciptionEndpoints.js";

export const getAdminUsersSummary = async (page = 1) => {
    const res = await axiosInstance.get(`${subscriptionEndpoints.GET_USERS_SUMMARY}?page=${page}`);
    return res?.data;
};

export const getAdminUserTransactions = async ({ userId, page = 1 }) => {
    const res = await axiosInstance.get(`${subscriptionEndpoints.GET_USER_TRANSACTIONS(userId)}?page=${page}`);
    return res?.data;
};
