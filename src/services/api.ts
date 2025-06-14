'use client';

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/refresh')
    ) {
      originalRequest._retry = true;

      try {
        await axios.post('/api/auth/refresh');
        return api(originalRequest);
      } catch (refreshError: any) {
        console.error('Erro ao atualizar o token:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export { api };
