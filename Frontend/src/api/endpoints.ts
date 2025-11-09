import api from './axios';
import type { User, Task, ExtractedTask, RecallResult } from '@/types';

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>('/auth/login', { email, password }),
  
  register: (email: string, password: string, name: string) =>
    api.post<{ user: User; token: string }>('/auth/register', { email, password, name }),
  
  getProfile: () => api.get<User>('/auth/profile'),
  
  updateProfile: (data: Partial<User>) =>
    api.put<User>('/auth/profile', data),
};

// Tasks endpoints
export const tasksAPI = {
  getAll: () => api.get<Task[]>('/tasks'),
  
  getById: (id: string) => api.get<Task>(`/tasks/${id}`),
  
  create: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Task>('/tasks', task),
  
  update: (id: string, updates: Partial<Task>) =>
    api.put<Task>(`/tasks/${id}`, updates),
  
  delete: (id: string) => api.delete(`/tasks/${id}`),
  
  addComment: (taskId: string, content: string) =>
    api.post(`/tasks/${taskId}/comments`, { content }),
};

// AI endpoints
export const aiAPI = {
  extract: (text: string) =>
    api.post<{ tasks: ExtractedTask[] }>('/ai/extract', { text }),
  
  recall: (query: string) =>
    api.post<RecallResult>('/ai/recall', { query }),
  
  suggest: (context: string) =>
    api.post<{ suggestions: string[] }>('/ai/suggest', { context }),
};

// Teams endpoints
export const teamsAPI = {
  getStatus: () => api.get('/teams/status'),
  
  connect: (webhookUrl: string) =>
    api.post('/teams/connect', { webhookUrl }),
  
  sendMessage: (message: string, channel?: string) =>
    api.post('/teams/send', { message, channel }),
  
  disconnect: () => api.post('/teams/disconnect'),
};
