import axios from "axios";
import { clearAuthStorage, setAuthToStorage } from "../service/auth/storage";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, 
});

instance.interceptors.request.use(
  function (config) {
    if (config.url.includes('/login') || config.url.includes('/register')) {
      return config;
    }

    const token = localStorage.getItem('access_token'); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    if (response.data && response.data.data) {
        return response.data;
    }
    return response.data ? response.data : response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/api/auth/login') &&
      !originalRequest.url.includes('/api/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const res = await instance.post('/api/auth/refresh');
        
        const payload = res?.data ?? res;
        const newAccessToken = payload?.accessToken; 
        const user = payload?.user;
        
        if (!newAccessToken) throw new Error("Refresh failed: missing accessToken");
        
        setAuthToStorage({ access_token: newAccessToken, user });

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);

      } catch (refreshError) {
        clearAuthStorage();
        window.location.href = '/login'; 
        return Promise.reject(refreshError.response?.data || refreshError);
      }
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default instance;