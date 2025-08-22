// import axios, { AxiosResponse } from 'axios';
// import Cookies from 'js-cookie';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use((config) => {
//   const token = Cookies.get('auth_token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Response interceptor to handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       Cookies.remove('auth_token');
//       window.location.href = '/auth/login';
//     }
//     return Promise.reject(error);
//   }
// );

// // Auth API
// export const authAPI = {
//   login: (credentials: { email: string; password: string }) =>
//     api.post('/auth/login', credentials),
  
//   register: (userData: { email: string; password: string; username: string }) =>
//     api.post('/auth/register', userData),
  
//   resetPassword: (email: string) =>
//     api.post('/auth/reset-password', { email }),
  
//   getCurrentUser: () => api.get('/auth/me'),
  
//   updateProfile: (data: { username?: string; email?: string; password?: string }) =>
//     api.put('/auth/profile', data),
// };

// // Upload API
// export const uploadAPI = {
//   uploadFile: (file: FormData) =>
//     api.post('/upload', file, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     }),
  
//   getTikTokMusic: () => api.get('/upload/music'),
// };

// // Schedule API
// export const scheduleAPI = {
//   getScheduledPosts: () => api.get('/schedule'),
  
//   createScheduledPost: (data: {
//     file_url: string;
//     title: string;
//     description: string;
//     hashtags: string[];
//     privacy: 'public' | 'private' | 'friends';
//     scheduled_time: string;
//     auto_add_music: boolean;
//     music_id?: string;
//   }) => api.post('/schedule', data),
  
//   updateScheduledPost: (id: string, data: any) =>
//     api.put(`/schedule/${id}`, data),
  
//   deleteScheduledPost: (id: string) => api.delete(`/schedule/${id}`),
  
//   getHistory: () => api.get('/schedule/history'),
// };

// // Settings API
// export const settingsAPI = {
//   connectTikTok: (code: string) => api.post('/settings/tiktok-connect', { code }),
  
//   getSettings: () => api.get('/settings'),
  
//   updateSettings: (settings: {
//     auto_add_music?: boolean;
//     default_privacy?: 'public' | 'private' | 'friends';
//     email_notifications?: boolean;
//   }) => api.put('/settings', settings),
// };

// // Admin API
// export const adminAPI = {
//   getUsers: () => api.get('/admin/users'),
  
//   getUserStats: () => api.get('/admin/stats'),
  
//   getReports: () => api.get('/admin/reports'),
// };

// export type ApiResponse<T> = AxiosResponse<T>;