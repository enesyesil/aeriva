// ─── Sales Options ───
export const SALES_OPTION_KEYS = ["general", "retail", "wholesale", "enterprise"] as const;
export type SalesOptionKey = (typeof SALES_OPTION_KEYS)[number];

// ─── Contact Form ───
export interface ContactFormData {
  name: string;
  email: string;
  salesOption: SalesOptionKey;
  message: string;
}

// ─── Fragrance ───
export interface Fragrance {
  id: string;
  color: string;
  image: string;
}

// ─── Store Location ───
export interface StoreLocation {
  key: string;
  lat: number;
  lng: number;
}
