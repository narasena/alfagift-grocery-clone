// zustand/authStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "SuperAdmin" | "Admin" | null;

interface AuthState {
  token: string | null;
  email: string | null;
  id: string | null;
  role: UserRole;
  setAuth: (data: {
    token: string;
    email: string;
    id: string;
    role: UserRole;
  }) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      id: null,
      role: null,
      setAuth: ({ token, email, id, role }) =>
        set(() => ({
          token,
          email,
          id,
          role,
        })),
      clearAuth: () =>
        set(() => ({
          token: null,
          email: null,
          id: null,
          role: null,
        })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        email: state.email,
        id: state.id,
        role: state.role,
      }),
    }
  )
);

export default useAuthStore;
