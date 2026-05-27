import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type UserRole = "admin" | "client";

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setRole: (role: UserRole | null) => void;
  signOut: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  loading: true,

  setSession: (session) =>
    set({ session, user: session?.user ?? null }),

  setRole: (role) => set({ role }),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, role: null });
  },
}));

/**
 * Fetch the role for a given user from the profiles table.
 * Falls back to "client" if no profile row exists yet.
 */
export async function fetchUserRole(userId: string): Promise<UserRole> {
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  return (data?.role as UserRole) ?? "client";
}
