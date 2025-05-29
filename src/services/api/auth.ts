// services/auth.ts
import axios from "axios";
import { V1_AUTH_URL, V1_HUMAN_RESOURCES_URL, V1_ORGANIZATION_URL } from "./config";



const api = axios.create({
  baseURL: V1_AUTH_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor to include access token
api.interceptors.request.use(
  (config) => {
    // Skip authentication for login endpoint
    if (config.url === '/auth/login/' || config.url === '/auth/register/') {
      return config;
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add this after the axios.create() call

export interface RegisterData {
  email: string;
  name: string;
  password: string;
  gender: "M" | "F" | "O";
  age: number;
  role: "A" | "E";
  phone_number: string;
  address: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  phone_number: string;
  // Add other organization properties as needed
}

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post(
      "/auth/login/",
      { email, password },
      { withCredentials: true }
    );
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await api.post(
      "/auth/register/",
      userData,
      { withCredentials: true }
    );
    return response.data;
  },

  getUser: async () => {
    const response = await api.get("/me/", {
      withCredentials: true,
    });
    return response.data;
  },
  checkActiveEmployment: async () => {
    const response = await api.get(`${V1_HUMAN_RESOURCES_URL}/check-active-employment/`, {
      withCredentials: true,
    });
    return response.data;
  },

  checkOwnedOrganization: async () => {
    const response = await api.get(`${V1_ORGANIZATION_URL}/core/check-owned-organization/`, {
      withCredentials: true,
    });
    return response.data;
  }
};


