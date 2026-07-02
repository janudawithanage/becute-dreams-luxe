import { supabase } from "@/lib/supabase";

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export const accountService = {
  /**
   * Update user's password
   * Requires current password for verification
   */
  async updatePassword(data: PasswordChangeData): Promise<{ success: boolean; error?: string }> {
    try {
      // First verify current password by trying to sign in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user?.email) {
        return { success: false, error: "No authenticated user found" };
      }

      // Verify current password
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });

      if (verifyError) {
        return { success: false, error: "Current password is incorrect" };
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Password update error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update password",
      };
    }
  },
};
