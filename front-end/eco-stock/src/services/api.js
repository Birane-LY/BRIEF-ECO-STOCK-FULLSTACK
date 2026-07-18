import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/constant";

const baseURL = import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL });

let isRefreshing = false;
let failedQueue = [];

// Intercepteur de requête : Injection simplifiée du Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur de réponse : Gestion du Refresh Token avec file d'attente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Cas 1 : Un rafraîchissement est déjà en cours, on met la requête en attente
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          onSuccess: (token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          onFailure: (err) => reject(err),
        });
      });
    }

    // Cas 2 : Premier échec 401, on lance le rafraîchissement
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await axios.post(`${baseURL}/api/token/refresh/`, { refresh: refreshToken });
      const newToken = res.data.access;

      localStorage.setItem(ACCESS_TOKEN, newToken);
      
      // Libération de la file d'attente en succès
      failedQueue.forEach((cb) => cb.onSuccess(newToken));
      failedQueue = [];

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      // Échec du rafraîchissement (Refresh token expiré ou invalide) -> Déconnexion
      failedQueue.forEach((cb) => cb.onFailure(refreshError));
      failedQueue = [];
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;