import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

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
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: CustomerRegistration) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  updateUser: (updates: Partial<User>) => void;
}

// Helper to map a profile row to our User shape
function profileToUser(profile: Record<string, unknown>): User {
  return {
    id: profile.id as string,
    email: profile.email as string,
    role: (profile.role as "admin" | "customer") || "customer",
    name: (profile.full_name as string) || "",
    phone: (profile.phone as string) || undefined,
    address: (profile.address as string) || undefined,
    city: (profile.city as string) || undefined,
    postalCode: (profile.postal_code as string) || undefined,
    country: (profile.country as string) || undefined,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      initialize: async () => {
        try {
          // Get current session
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;

          if (session?.user) {
            // Always re-fetch the profile from DB on session resume so that
            // role changes (e.g. revoking admin) are reflected immediately.
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profile) {
              set({
                user: profileToUser(profile),
                session,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              // Profile doesn't exist yet (trigger may not have fired)
              // Set basic user info from session with safe default role
              set({
                user: {
                  id: session.user.id,
                  email: session.user.email || '',
                  role: 'customer',
                  name: session.user.user_metadata?.full_name || '',
                },
                session,
                isAuthenticated: true,
                isLoading: false,
              });
            }
          } else {
            set({ isLoading: false });
          }

          // Listen for auth state changes and re-validate role from DB each time
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              // Small delay to let the database trigger complete
              await new Promise(resolve => setTimeout(resolve, 500));

              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();

              if (profile) {
                set({
                  user: profileToUser(profile),
                  session,
                  isAuthenticated: true,
                });
              } else {
                // Fallback — role defaults to 'customer', never elevated
                set({
                  user: {
                    id: session.user.id,
                    email: session.user.email || '',
                    role: 'customer',
                    name: session.user.user_metadata?.full_name || '',
                  },
                  session,
                  isAuthenticated: true,
                });
              }
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, session: null, isAuthenticated: false });
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
              // Re-validate role on every token refresh
              const { data: profile } = await supabase
                .from('profiles')
                .select('id, role')
                .eq('id', session.user.id)
                .maybeSingle();

              if (profile) {
                const currentUser = get().user;
                if (currentUser && currentUser.role !== profile.role) {
                  set({ user: { ...currentUser, role: profile.role as 'admin' | 'customer' } });
                }
              }
            }
          });

          // Store subscription for potential cleanup
          // (global singleton — unsubscribe is not strictly needed but prevents
          //  double-registration if initialize() is called more than once in StrictMode)
          return () => subscription.unsubscribe();
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ isLoading: false, error: 'Failed to initialize authentication' });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profile) {
              set({
                user: profileToUser(profile),
                session: data.session,
                isAuthenticated: true,
                isLoading: false,
              });
              return true;
            } else {
              // Profile may not exist - create a basic one
              set({
                user: {
                  id: data.user.id,
                  email: data.user.email || '',
                  role: 'customer',
                  name: data.user.user_metadata?.full_name || '',
                },
                session: data.session,
                isAuthenticated: true,
                isLoading: false,
              });
              return true;
            }
          }

          set({ isLoading: false });
          return false;
        } catch (error: any) {
          set({ 
            error: error.message || 'Login failed',
            isLoading: false 
          });
          return false;
        }
      },

      register: async (data: CustomerRegistration) => {
        set({ isLoading: true, error: null });
        
        try {
          // Step 1: Create auth user with metadata
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                full_name: data.name,
                phone: data.phone,
                address: data.address,
                city: data.city,
                postal_code: data.postalCode,
                country: data.country,
              }
            }
          });

          if (authError) throw authError;
          if (!authData.user) throw new Error('User creation failed');

          // Check if email confirmation is required
          // If session exists, user is auto-confirmed
          const isAutoConfirmed = !!authData.session;

          if (isAutoConfirmed) {
            // Wait a moment for the database trigger to create the profile
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check if profile was created by trigger
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', authData.user.id)
              .maybeSingle();

            if (!existingProfile) {
              // Trigger didn't create profile - insert it manually
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: authData.user.id,
                  email: data.email,
                  full_name: data.name,
                  phone: data.phone,
                  address: data.address,
                  city: data.city,
                  postal_code: data.postalCode,
                  country: data.country,
                  role: 'customer',
                });

              if (profileError) {
                console.error('Profile creation error:', profileError);
                // Don't throw - auth user was created successfully
                // The profile can be created later
              }
            } else {
              // Profile was created by trigger but may be missing metadata fields
              // Update profile with full registration data
              const { error: updateError } = await supabase
                .from('profiles')
                .update({
                  full_name: data.name,
                  phone: data.phone,
                  address: data.address,
                  city: data.city,
                  postal_code: data.postalCode,
                  country: data.country,
                })
                .eq('id', authData.user.id);

              if (updateError) {
                console.error('Profile update error:', updateError);
              }
            }
          }

          set({ isLoading: false });
          return { success: true };
        } catch (error: any) {
          console.error('Registration error:', error);
          set({ 
            error: error.message || 'Registration failed',
            isLoading: false 
          });
          return { 
            success: false, 
            error: error.message || 'Registration failed' 
          };
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await supabase.auth.signOut();
          set({ 
            user: null, 
            session: null, 
            isAuthenticated: false,
            isLoading: false 
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false });
        }
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
