// utils/axiosAdminInstance.ts
import axios from "axios";

const adminInstance = axios.create({
  baseURL: "http://localhost:8000/api/admin",
});

adminInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default adminInstance;
