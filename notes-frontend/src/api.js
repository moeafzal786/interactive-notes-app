import axios from "axios";

export const API_BASE = "http://192.168.3.183:8000/api";

const api = axios.create({
    baseURL: API_BASE,
});

// Attach token from localStorage
api.interceptors.request.use(
    (config) => {
        const access = localStorage.getItem("access");
        if (access) {
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auto refresh if 401
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem("refresh");
            if (refresh) {
                try {
                    const res = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
                    const newAccess = res.data.access;
                    localStorage.setItem("access", newAccess);
                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;