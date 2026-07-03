import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/authApi";
import { STORAGE_KEYS } from "../utils/constants";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      // Initialize from storage
      hydrate: () => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          set({ accessToken: token, isAuthenticated: true });
        }
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAccessToken: (token) => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
        set({ accessToken: token });
      },
      clearAccessToken: () => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        set({ accessToken: null });
      },

      register: async (formData) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authApi.register(formData);
          const { user, accessToken } = data.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          set({ user, accessToken, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (err) {
          const error = err.response?.data?.message || "Registration failed";
          set({ loading: false, error });
          return { success: false, error };
        }
      },

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authApi.login(credentials);
          const { user, accessToken } = data.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          set({ user, accessToken, isAuthenticated: true, loading: false });
          return { success: true };
        } catch (err) {
          const error = err.response?.data?.message || "Login failed";
          set({ loading: false, error });
          return { success: false, error };
        }
      },

      requestOtp: async (phone) => {
        set({ loading: true, error: null });
        try {
          await authApi.requestOtp(phone);
          set({ loading: false });
          return { success: true };
        } catch (err) {
          const error = err.response?.data?.message || "Failed to send OTP";
          set({ loading: false, error });
          return { success: false, error };
        }
      },

      verifyOtp: async (phone, otp, name) => {
        set({ loading: true, error: null });
        try {
          const { data } = await authApi.verifyOtp(phone, otp, name);
          const { user, accessToken } = data.data;
          localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          set({ user, accessToken, isAuthenticated: true, loading: false });
          console.log('✅ Login successful! Token saved:', {
            hasToken: !!accessToken,
            user: user.username,
            stored: localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)?.substring(0, 20) + '...'
          });
          return { success: true };
        } catch (err) {
          const error = err.response?.data?.message || "Invalid OTP";
          set({ loading: false, error });
          return { success: false, error };
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (_) {}
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        try {
          const { data } = await authApi.getMe();
          set({ user: data.data.user, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false, accessToken: null });
          localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        }
      },

      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
      clearError: () => set({ error: null }),
    }),
    {
      name: "connectx-auth",
      partialize: (state) => ({ 
        accessToken: state.accessToken, 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

export default useAuthStore;
