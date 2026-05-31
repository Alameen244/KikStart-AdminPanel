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

// year: number, month: number | null
export const getAnalyticsOverview = async ({ year, month } = {}) => {
    const params = new URLSearchParams();
    if (year)  params.append("year",  year);
    if (month) params.append("month", month);
    const res = await axiosInstance.get(`${subscriptionEndpoints.GET_ANALYTICS_OVERVIEW}?${params}`);
    return res?.data;
};

// view: "monthly" | "yearly", year: number
export const getRevenueChart = async ({ year, view = "monthly" } = {}) => {
    const params = new URLSearchParams();
    if (year) params.append("year", year);
    params.append("view", view);
    const res = await axiosInstance.get(`${subscriptionEndpoints.GET_REVENUE_CHART}?${params}`);
    return res?.data;
};

// year: number, month: number | null
export const getPlanDistribution = async ({ year, month } = {}) => {
    const params = new URLSearchParams();
    if (year)  params.append("year",  year);
    if (month) params.append("month", month);
    const res = await axiosInstance.get(`${subscriptionEndpoints.GET_PLAN_DISTRIBUTION}?${params}`);
    return res?.data;
};
