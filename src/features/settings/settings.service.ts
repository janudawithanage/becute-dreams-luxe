import { supabase } from "@/lib/supabase";
import type { StoreSettings } from "./settings.types";

const SETTINGS_KEY = "store_settings";

export const settingsService = {
  /**
   * Get store settings from localStorage (for demo purposes)
   * In production, this would fetch from Supabase
   */
  async getSettings(): Promise<StoreSettings | null> {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    } catch (error) {
      console.error("Error loading settings:", error);
      return null;
    }
  },

  /**
   * Save store settings to localStorage (for demo purposes)
   * In production, this would save to Supabase
   */
  async saveSettings(settings: StoreSettings): Promise<StoreSettings> {
    try {
      const settingsWithTimestamp = {
        ...settings,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsWithTimestamp));
      return settingsWithTimestamp;
    } catch (error) {
      console.error("Error saving settings:", error);
      throw error;
    }
  },

  /**
   * Calculate shipping cost based on cart subtotal and settings
   */
  calculateShippingCost(
    subtotal: number,
    shippingMethod: "standard" | "express",
    settings: StoreSettings
  ): number {
    const { freeShippingThreshold, standardRate, expressRate } = settings.shipping;

    // Free shipping if subtotal meets threshold
    if (subtotal >= freeShippingThreshold) {
      return 0;
    }

    // Return rate based on shipping method
    return shippingMethod === "express" ? expressRate : standardRate;
  },
};
