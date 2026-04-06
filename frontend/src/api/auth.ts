import { axiosInstance } from "../config/axios";
import type { AxiosRequestConfig } from "axios";

export interface AuthResponse {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  accessToken: string;
}

export interface CurrentUserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const noBearerAuthRequestConfig: AxiosRequestConfig & { skipAuth: true } = {
  skipAuth: true,
};

export const signupAuth = async (data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await axiosInstance.post(
    "/auth/signup",
    data,
    noBearerAuthRequestConfig,
  );
  return response.data.data as AuthResponse;
};

export const loginAuth = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await axiosInstance.post(
    "/auth/login",
    data,
    noBearerAuthRequestConfig,
  );
  return response.data.data as AuthResponse;
};

export const logoutAuth = async (): Promise<void> => {
  await axiosInstance.post("/auth/logout", undefined, noBearerAuthRequestConfig);
};

export const refreshAuth = async (): Promise<{ accessToken: string }> => {
  const response = await axiosInstance.post(
    "/auth/refresh",
    undefined,
    noBearerAuthRequestConfig,
  );
  return response.data.data as { accessToken: string };
};