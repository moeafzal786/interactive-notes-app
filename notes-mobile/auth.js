import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_BASE } from "./api";

export const refreshAccessToken = async () => {
    try {
        const refresh = await AsyncStorage.getItem("refresh");
        if (!refresh) return null;

        const response = await axios.post(`${API_BASE}/token/refresh/`, { refresh });
        const newAccess = response.data.access;
        await AsyncStorage.setItem("access", newAccess);
        return newAccess;
    } catch (error) {
        console.error("Failed to refresh token:", error.response?.data || error);
        return null;
    }
};