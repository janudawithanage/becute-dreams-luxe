import { supabase } from "@/lib/supabase";

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileUpdateData {
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export const accountService = {
  /**
   * Update user's profile (name, phone, address fields)
   */
  async updateProfile(
    userId: string,
    data: ProfileUpdateData,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.name,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postal_code: data.postalCode,
          country: data.country,
        })
        .eq("id", userId);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update profile",
      };
    }
  },

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
