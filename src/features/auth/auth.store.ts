import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  role: "admin" | "customer";
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
}

export interface CustomerRegistration {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  customers: User[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: CustomerRegistration) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
  getCustomerById: (id: string) => User | undefined;
  getAllCustomers: () => User[];
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      customers: [],

      login: async (email: string, password: string) => {
        // TODO: Implement real backend authentication here
        // For now, check if customer exists in registered customers
        const { customers } = get();
        const customer = customers.find((c) => c.email === email);

        if (customer) {
          // In a real backend, verify password here
          set({ user: customer, isAuthenticated: true });
          return true;
        }

        return false;
      },

      register: async (data: CustomerRegistration) => {
        const { customers } = get();

        // Check if email already exists
        const exists = customers.some((c) => c.email === data.email);
        if (exists) {
          return { success: false, error: "Email already registered" };
        }

        // Create new customer
        const newCustomer: User = {
          id: `customer-${Date.now()}`,
          email: data.email,
          role: "customer",
          name: data.name,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
          createdAt: new Date().toISOString(),
        };

        set({ customers: [...customers, newCustomer] });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === "admin";
      },

      getCustomerById: (id: string) => {
        const { customers } = get();
        return customers.find((c) => c.id === id);
      },

      getAllCustomers: () => {
        return get().customers;
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);
