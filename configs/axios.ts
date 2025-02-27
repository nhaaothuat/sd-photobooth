import axios from "axios";
import Cookies from "js-cookie";

interface AxiosResponse<T> {
  data: T | null;
  status: number;
  statusText: string;
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(async (config) => {
  const token = Cookies.get("AccessToken");
  if (token !== undefined) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AxiosAPI = {
  get: async <T>(url: string): Promise<AxiosResponse<T>> => {
    try {
      const response = await instance.get<T>(url);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        statusText: "Internal Server Error",
      };
    }
  },
  post: async <T>(url: string, data: T): Promise<AxiosResponse<T>> => {
    try {
      const response = await instance.post<T>(url, data);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        statusText: "Internal Server Error",
      };
    }
  },
  put: async <T>(url: string, data: T): Promise<AxiosResponse<T>> => {
    try {
      const response = await instance.put<T>(url, data);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        statusText: "Internal Server Error",
      };
    }
  },
  delete: async <T>(url: string): Promise<AxiosResponse<T>> => {
    try {
      const response = await instance.delete<T>(url);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
        statusText: "Internal Server Error",
      };
    }
  },
};

export default AxiosAPI;
