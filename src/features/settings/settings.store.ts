import { create } from "zustand";
import { settingsService } from "./settings.service";
import type { StoreSettings, ShippingSettings } from "./settings.types";
import { DEFAULT_SETTINGS } from "./settings.types";

interface SettingsState {
  settings: StoreSettings;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadSettings: () => Promise<void>;
  updateShippingSettings: (shipping: Partial<ShippingSettings>) => Promise<void>;
  calculateShipping: (subtotal: number, method: "standard" | "express") => number;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await settingsService.getSettings();
      set({
        settings: settings || DEFAULT_SETTINGS,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to load settings",
        isLoading: false,
      });
    }
  },

  updateShippingSettings: async (shipping: Partial<ShippingSettings>) => {
    set({ isLoading: true, error: null });
    try {
      const currentSettings = get().settings;
      const updatedSettings: StoreSettings = {
        ...currentSettings,
        shipping: {
          ...currentSettings.shipping,
          ...shipping,
        },
      };

      const saved = await settingsService.saveSettings(updatedSettings);
      set({
        settings: saved,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to save settings",
        isLoading: false,
      });
      throw error;
    }
  },

  calculateShipping: (subtotal: number, method: "standard" | "express") => {
    const { settings } = get();
    return settingsService.calculateShippingCost(subtotal, method, settings);
  },
}));
