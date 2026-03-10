import axios from "axios";
import { clearAuthStorage, setAuthToStorage } from "../service/auth/storage";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, 
});

// 1. Chặn request gửi đi để nhét Token vào
instance.interceptors.request.use(
  function (config) {
    if (config.url.includes('/login') || config.url.includes('/register')) {
      return config;
    }

    // ĐÃ SỬA: Chỉ lấy duy nhất 'access_token' từ localStorage
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

// 2. Chặn response trả về để xử lý 401
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
        // Lưu ý: Biến này phụ thuộc vào backend trả về (nếu backend trả camelCase thì giữ nguyên)
        const newAccessToken = payload?.accessToken; 
        const user = payload?.user;
        
        if (!newAccessToken) throw new Error("Refresh failed: missing accessToken");
        
        // Đã đồng nhất lưu dưới dạng 'access_token'
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