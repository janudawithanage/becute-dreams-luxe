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
        // Check admin credentials from environment variables
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

        if (email === adminEmail && password === adminPassword) {
          const user: User = {
            id: "admin-1",
            email: adminEmail,
            role: "admin",
            name: "Admin User",
            createdAt: new Date().toISOString(),
          };

          set({ user, isAuthenticated: true });
          return true;
        }

        // Check demo customer credentials from environment variables
        const demoCustomerEmail = import.meta.env.VITE_DEMO_CUSTOMER_EMAIL;
        const demoCustomerPassword = import.meta.env.VITE_DEMO_CUSTOMER_PASSWORD;

        if (email === demoCustomerEmail && password === demoCustomerPassword) {
          const { customers } = get();

          // Check if demo customer exists, create if not
          let demoCustomer = customers.find((c) => c.email === demoCustomerEmail);

          if (!demoCustomer) {
            demoCustomer = {
              id: "demo-customer-1",
              email: demoCustomerEmail,
              role: "customer",
              name: "Demo Customer",
              phone: "+1 (555) 123-4567",
              address: "123 Demo Street, Apt 4B",
              city: "New York",
              postalCode: "10001",
              country: "United States",
              createdAt: new Date().toISOString(),
            };
            set({ customers: [...customers, demoCustomer] });
          }

          set({ user: demoCustomer, isAuthenticated: true });
          return true;
        }

        // Check if customer exists in registered customers
        const { customers } = get();
        const customer = customers.find((c) => c.email === email);

        if (customer) {
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
