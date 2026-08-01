import axios, { type AxiosError } from "axios";
import { toast } from "react-toastify";
import { ErrorCodes } from "../utils/errorCodes";

const FALLBACK_ERROR_MESSAGE = ErrorCodes.SYSTEM.INTERNAL_ERROR.message;

type ApiErrorBody = {
  status?: number;
  code?: string;
  message?: string;
};

declare module "axios" {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const isUnauthenticated = error.response?.status === 401;

    if (isUnauthenticated) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (!error.config?.skipErrorToast) {
      const message = error.response?.data?.message || FALLBACK_ERROR_MESSAGE;
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;