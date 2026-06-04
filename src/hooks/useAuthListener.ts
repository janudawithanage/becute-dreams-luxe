import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, fetchUserRole } from "@/lib/auth";

/**
 * Bootstraps the Supabase auth listener once at the app root.
 * Keeps the Zustand auth store in sync with the Supabase session.
 */
export function useAuthListener() {
  const setSession = useAuth((s) => s.setSession);
  const setRole = useAuth((s) => s.setRole);

  useEffect(() => {
    // Hydrate from existing session on mount
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setRole(role);
        }
        useAuth.setState({ loading: false });
      })
      .catch((err) => {
        console.error("[auth] getSession failed:", err);
        useAuth.setState({ loading: false });
      });

    // Subscribe to future auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        setSession(session);
        if (session?.user) {
          const role = await fetchUserRole(session.user.id);
          setRole(role);
        } else {
          setRole(null);
        }
      } catch (err) {
        console.error("[auth] onAuthStateChange handler failed:", err);
      } finally {
        useAuth.setState({ loading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [setSession, setRole]);
}
