import { axiosInstance } from "@/config/axios";
import type { CurrentUserResponse } from "./auth";

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
    const response = await axiosInstance.get("/user");
    return response.data.data as CurrentUserResponse;
  };