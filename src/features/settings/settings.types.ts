export interface ShippingSettings {
  freeShippingThreshold: number;
  standardRate: number;
  expressRate: number;
  internationalShipping: boolean;
}

export interface HeroSettings {
  tagLabel: string;
  tagTitle: string;
  priceLabel: string;
  priceValue: string;
  imageUrl: string | null;
}

export interface StoreSettings {
  id?: string;
  shipping: ShippingSettings;
  hero: HeroSettings;
  updatedAt?: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  shipping: {
    freeShippingThreshold: 100,
    standardRate: 5.99,
    expressRate: 15.99,
    internationalShipping: false,
  },
  hero: {
    tagLabel: 'New drop',
    tagTitle: 'Lavender Series',
    priceLabel: 'From',
    priceValue: 'Rs. 500',
    imageUrl: null,
  },
};
