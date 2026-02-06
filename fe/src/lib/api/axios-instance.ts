import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data, config } = error.response;

      if (status === 401) {
        const isAuthEndpoint =
          config.url?.includes("/auth/signup") ||
          config.url?.includes("/auth/signin");
        if (!isAuthEndpoint) {
          localStorage.removeItem("token");
          if (typeof window !== "undefined") {
            window.location.href = "/auth";
          }
        }
      } else {
        switch (status) {
          case 400:
            console.error("Bad request:", data);
            break;
          case 403:
            console.error("Access denied:", data);
            break;
          case 404:
            console.error("Resource not found:", data);
            break;
          case 500:
            console.error("Server error:", data);
            break;
          case 502:
            console.error("Bad gateway:", data);
            break;
          case 503:
            console.error("Service unavailable:", data);
            break;
          default:
            console.error("Request failed:", data);
        }
      }
      return Promise.reject(error);
    }

    if (error.request) {
      console.error("No response from server");
      return Promise.reject(new Error("Network error"));
    }

    return Promise.reject(error);
  },
);
