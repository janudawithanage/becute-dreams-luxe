export interface ShippingSettings {
  freeShippingThreshold: number;
  standardRate: number;
  expressRate: number;
  internationalShipping: boolean;
}

export interface StoreSettings {
  id?: string;
  shipping: ShippingSettings;
  updatedAt?: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  shipping: {
    freeShippingThreshold: 100,
    standardRate: 5.99,
    expressRate: 15.99,
    internationalShipping: false,
  },
};
