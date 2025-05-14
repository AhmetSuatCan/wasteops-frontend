// services/auth.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/users";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

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

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await api.post(
      "/auth/web-login/",
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
    const response = await api.get("auth/check-token/", {
      withCredentials: true,
    });
    return response.data;
  },
};

