// admin/src/helper/axios.js
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const axiosInstance = axios.create({ baseURL });

export const getSuccessMessage = (response, fallbackMessage) =>
    response?.message || response?.data?.message || fallbackMessage;

export const getErrorMessage = (error, fallbackMessage = "Something went wrong.") =>
    error?.response?.data?.message || error?.message || fallbackMessage;

// 🚧 after Login implement uncomment this
axiosInstance.interceptors.request.use((config) => {
    const token = Cookies.get("adminToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosInstance.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            Cookies.remove("adminToken");
            window.dispatchEvent(new CustomEvent("auth:session-expired"));
        }
        if (status === 500) toast.error("Server error. Please try again.");
        if (status === 403) toast.error("You are not authorized.");
        return Promise.reject(error);
    }
);
