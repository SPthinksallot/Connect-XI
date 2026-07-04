import { create } from "zustand";

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, type = "info", duration = 3000) => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const toast = {
  success: (msg, duration) => useToastStore.getState().addToast(msg, "success", duration),
  error: (msg, duration) => useToastStore.getState().addToast(msg, "error", duration),
  info: (msg, duration) => useToastStore.getState().addToast(msg, "info", duration),
};

export default useToastStore;
