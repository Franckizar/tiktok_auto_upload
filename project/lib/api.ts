import { AxiosResponse } from 'axios';

// Mock AxiosResponse type for static responses
interface MockAxiosResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
}

export const authAPI = {
  login: () =>
    Promise.resolve({
      data: { token: 'mock-token', user: { id: '1', email: 'test@example.com', username: 'testuser', role: 'user', tiktok_connected: false } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse),
  register: () =>
    Promise.resolve({
      data: { token: 'mock-token', user: { id: '1', email: 'test@example.com', username: 'testuser', role: 'user', tiktok_connected: false } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse),
  resetPassword: () => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
  getCurrentUser: () =>
    Promise.resolve({
      data: { id: '1', email: 'test@example.com', username: 'testuser', role: 'user', tiktok_connected: false },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    } as AxiosResponse),
  updateProfile: () => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
};

export const scheduleAPI = {
  getScheduledPosts: () => Promise.resolve({ data: [], status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
  createScheduledPost: () => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
  updateScheduledPost: () => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
  deleteScheduledPost: () => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
  getHistory: () => Promise.resolve({ data: [], status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
};

export const uploadAPI = {
  uploadFile: () => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
  getTikTokMusic: () => Promise.resolve({ data: [], status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
};

export const settingsAPI = {
  connectTikTok: () => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
  getSettings: () => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
  updateSettings: () => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
};

export const adminAPI = {
  getUsers: () => Promise.resolve({ data: [], status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
  getUserStats: () => Promise.resolve({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
  getReports: () => Promise.resolve({ data: [], status: 200, statusText: 'OK', headers: {}, config: {} } as AxiosResponse),
};

export type ApiResponse<T> = AxiosResponse<T>;