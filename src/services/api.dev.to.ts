'use client';

import axios, { AxiosError } from 'axios';

const api_dev = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL_DEV_TO,
});

api_dev.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

export { api_dev };
