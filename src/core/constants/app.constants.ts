/**
 * Application-wide constants
 */

export const APP_NAME = "Becute Dreams";
export const APP_TAGLINE = "Stickers, softly reimagined";
export const APP_DESCRIPTION =
  "A luxury boutique of premium designer stickers and creative accessories. Designed in calm, made with care.";

export const CONTACT = {
  email: "hello@becutedreams.com",
  phone: "+1 (555) 123-4567",
  whatsapp: "https://wa.me/", // Add your WhatsApp link
} as const;

export const SOCIAL_MEDIA = {
  instagram: "https://instagram.com/becutedreams",
  twitter: "https://twitter.com/becutedreams",
  pinterest: "https://pinterest.com/becutedreams",
} as const;

export const ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  COLLECTIONS: "/collections",
  ABOUT: "/about",
  CONTACT: "/contact",
  CHECKOUT: "/checkout",
  PRODUCT: (slug: string) => `/product/${slug}`,
} as const;

export const CART_STORAGE_KEY = "becute-cart";

export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
} as const;
