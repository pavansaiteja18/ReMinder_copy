import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import api from '@/api/axios';
import type { AuthState, User } from '@/types';
import { useTasksStore } from './tasksStore';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // 🔐 Login
      login: async (email: string, password: string) => {
        try {
          const res = await api.post('/auth/login', { email, password });
          const { token, _id, name, email: userEmail } = res.data;

          const user: User = {
            id: _id,
            name,
            email: userEmail,
            role: 'member',
            createdAt: new Date().toISOString(),
          };

          set({ user, token, isAuthenticated: true });
          localStorage.setItem('token', token);
          toast.success(`Welcome back, ${name}!`);

          await useTasksStore.getState().fetchTasks();
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Login failed');
          throw err;
        }
      },

      // 🧾 Register
      register: async (email: string, password: string, name: string) => {
        try {
          const res = await api.post('/auth/register', { name, email, password });
          const { token, _id, email: userEmail } = res.data;

          const user: User = {
            id: _id,
            name,
            email: userEmail,
            role: 'member',
            createdAt: new Date().toISOString(),
          };

          set({ user, token, isAuthenticated: true });
          localStorage.setItem('token', token);
          toast.success('Account created successfully');

          await useTasksStore.getState().fetchTasks();
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Registration failed');
          throw err;
        }
      },

      // 🚪 Logout
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
        toast.info('Logged out successfully');
        useTasksStore.getState().clearTasks();
      },

      // ✅ ✏️ Update Profile (Frontend only)
      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
        toast.success('Profile updated');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
