// Apis/subscriptionApi.js

import { axiosInstance } from "../../helper/helper.js";
import { subscriptionEndpoints } from "../EndPoints/subsciptionEndpoints.js";


export const getAdminUsersSummary = async ({
    page = 1,
    plan = "",
    subscriptionStatus = "",
    transactionStatus = "",
    sortBy = "totalPaid",
    sortOrder = "desc",
    exportAll = false,
} = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    if (plan)                params.append("plan", plan);
    if (subscriptionStatus)  params.append("subscriptionStatus", subscriptionStatus);
    if (transactionStatus)   params.append("transactionStatus", transactionStatus);
    if (sortBy)              params.append("sortBy", sortBy);
    if (sortOrder)           params.append("sortOrder", sortOrder);
    if (exportAll)           params.append("exportAll", "true");

    const res = await axiosInstance.get(
        `${subscriptionEndpoints.GET_USERS_SUMMARY}?${params.toString()}`
    );
    return res?.data;
};

export const getAdminUserTransactions = async ({
    userId,
    page = 1,
    exportAll = false,
} = {}) => {
    const params = new URLSearchParams();
    params.append("page", page);
    if (exportAll) params.append("exportAll", "true");

    const res = await axiosInstance.get(
        `${subscriptionEndpoints.GET_USER_TRANSACTIONS(userId)}?${params.toString()}`
    );
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

export const getRevenueBreakdown = async ({ year, status = "paid" } = {}) => {
    const params = new URLSearchParams();
    if (year)  params.append("year",   year);
    if (status) params.append("status", status);
    const res = await axiosInstance.get(`${subscriptionEndpoints.GET_REVENUE_BREAKDOWN}?${params}`);
    return res?.data;
};
