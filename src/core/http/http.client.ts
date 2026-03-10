import axios from "axios";
import { authStore } from "../auth/auth.store";

const BASE_URL = "/api";

export const httpClient = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use((config) => {
    const token = authStore.token.peek();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
