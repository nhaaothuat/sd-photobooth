import { create } from "zustand";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== "undefined" ? sessionStorage.getItem("AccessToken") : null,

  setToken: (token) => {
    sessionStorage.setItem("AccessToken", token);
    set({ token });
  },

  clearToken: () => {
    sessionStorage.removeItem("AccessToken");
    set({ token: null });
  },
}));
