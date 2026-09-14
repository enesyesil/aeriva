export const INQUIRY_TYPE_KEYS = ["general", "product", "wholesale"] as const;

export type InquiryType = (typeof INQUIRY_TYPE_KEYS)[number];

export interface ContactFormData {
  name: string;
  email: string;
  inquiryType: InquiryType;
  message: string;
  locale: string;
  productId?: string;
}

export type ProductLine = "estila" | "mavigol";
export type ProductKind = "eau-de-parfum" | "reed-diffuser";
export type ProductAudience = "women" | "men" | "unisex" | "home";

export interface Product {
  id: string;
  slug: string;
  line: ProductLine;
  kind: ProductKind;
  code?: string;
  audience: ProductAudience;
  sizeMl?: number;
  images: string[];
  accent: string;
  translationKey: string;
}
