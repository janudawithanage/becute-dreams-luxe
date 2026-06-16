import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
  role: "admin" | "customer";
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Check admin credentials from environment variables
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
          const user: User = {
            email: adminEmail,
            role: "admin",
            name: "Admin User",
          };

          set({ user, isAuthenticated: true });
          return true;
        }

        // For demo purposes, accept any other email/password as customer
        if (email && password) {
          const user: User = {
            email,
            role: "customer",
            name: email.split("@")[0],
          };

          set({ user, isAuthenticated: true });
          return true;
        }

        return false;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === "admin";
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
