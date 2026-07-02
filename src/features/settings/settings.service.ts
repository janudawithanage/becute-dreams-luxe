import { supabase } from "@/lib/supabase";
import type { StoreSettings } from "./settings.types";
import { DEFAULT_SETTINGS } from "./settings.types";

/**
 * Map database row to StoreSettings interface
 */
function mapDbToSettings(data: any): StoreSettings {
  return {
    id: data.id,
    shipping: {
      freeShippingThreshold: data.free_shipping_threshold,
      standardRate: data.standard_shipping_rate,
      expressRate: data.express_shipping_rate,
      internationalShipping: data.international_shipping_enabled,
    },
    hero: {
      tagLabel: data.hero_tag_label || DEFAULT_SETTINGS.hero.tagLabel,
      tagTitle: data.hero_tag_title || DEFAULT_SETTINGS.hero.tagTitle,
      priceLabel: data.hero_price_label || DEFAULT_SETTINGS.hero.priceLabel,
      priceValue: data.hero_price_value || DEFAULT_SETTINGS.hero.priceValue,
      imageUrl: data.hero_image_url,
    },
    updatedAt: data.updated_at,
  };
}

export const settingsService = {
  /**
   * Get store settings from Supabase
   */
  async getSettings(): Promise<StoreSettings | null> {
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1);

      if (error) {
        console.error("Error fetching settings:", error);
        return DEFAULT_SETTINGS;
      }

      // If no data exists, return defaults
      // Note: The migration should create a default row
      if (!data || data.length === 0) {
        console.warn("No settings found in database. Using defaults. Please run migration 004.");
        return DEFAULT_SETTINGS;
      }

      // Map the first row to our interface
      return mapDbToSettings(data[0]);
    } catch (error) {
      console.error("Error loading settings:", error);
      return DEFAULT_SETTINGS;
    }
  },

  /**
   * Save store settings to Supabase
   */
  async saveSettings(settings: StoreSettings): Promise<StoreSettings> {
    try {
      // If no ID, get the first row or create one
      if (!settings.id) {
        const existing = await this.getSettings();
        if (existing?.id) {
          settings.id = existing.id;
        }
      }

      const { data, error } = await supabase
        .from('store_settings')
        .update({
          free_shipping_threshold: settings.shipping.freeShippingThreshold,
          standard_shipping_rate: settings.shipping.standardRate,
          express_shipping_rate: settings.shipping.expressRate,
          international_shipping_enabled: settings.shipping.internationalShipping,
          hero_tag_label: settings.hero.tagLabel,
          hero_tag_title: settings.hero.tagTitle,
          hero_price_label: settings.hero.priceLabel,
          hero_price_value: settings.hero.priceValue,
          hero_image_url: settings.hero.imageUrl,
        })
        .eq('id', settings.id!)
        .select()
        .single();

      if (error) {
        console.error("Error saving settings:", error);
        throw error;
      }

      return mapDbToSettings(data);
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
