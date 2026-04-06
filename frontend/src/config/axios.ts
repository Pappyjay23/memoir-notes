import axios from "axios";
import type { AxiosRequestConfig } from "axios";

export const BASE_URL = import.meta.env.VITE_MEMOIR_API_URL;

type AuthOptionalAxiosConfig = {
  skipAuth?: boolean;
};

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for refresh/logout
});

const noBearerAuthRequestConfig: AxiosRequestConfig & { skipAuth: true } = {
  skipAuth: true,
};

const isDefinitivelyInvalidRefresh = (err: unknown) => {
  if (!axios.isAxiosError(err)) return false;
  const status = err.response?.status;
  return status === 401 || status === 403;
};

let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.request.use(
  (config) => {
    const skipAuth = Boolean((config as typeof config & AuthOptionalAxiosConfig).skipAuth);
    const token = localStorage.getItem("accessToken");
    if (!skipAuth && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const originalUrl: string | undefined = originalRequest?.url;
    const isAuthLoginOrSignup =
      originalUrl === "/auth/login" || originalUrl === "/auth/signup";

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalUrl !== "/auth/refresh" &&
      !isAuthLoginOrSignup
    ) {
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axiosInstance
            .post("/auth/refresh", undefined, noBearerAuthRequestConfig)
            .then((refreshResponse) => refreshResponse.data.data.accessToken as string)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;
        localStorage.setItem("accessToken", newAccessToken);
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Only log out if refresh is definitively invalid (expired/invalid cookie).
        // For transient failures (network/5xx), keep the current auth state and let the caller decide.
        if (isDefinitivelyInvalidRefresh(refreshError)) {
          localStorage.removeItem("accessToken");
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Helper functions
export const setAuthToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("accessToken");
};