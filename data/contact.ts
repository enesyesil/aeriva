import { getProductById } from "@/data/products";
import { routing } from "@/i18n/routing";
import { INQUIRY_TYPE_KEYS, type InquiryType } from "@/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: string) {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim();
}

export function validateContactBody(body: Record<string, unknown>) {
  const { name, email, inquiryType, productId, locale, message, website } = body;

  if (typeof website === "string" && website.trim()) {
    return { valid: false as const, error: "Invalid submission." };
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof inquiryType !== "string" ||
    typeof locale !== "string" ||
    typeof message !== "string"
  ) {
    return {
      valid: false as const,
      error: "All required fields must be provided.",
    };
  }

  const cleanName = cleanText(name);
  const cleanEmail = cleanText(email).toLowerCase();
  const cleanMessage = cleanText(message);

  if (!cleanName || cleanName.length > 100) {
    return { valid: false as const, error: "Invalid name." };
  }
  if (!EMAIL_RE.test(cleanEmail) || cleanEmail.length > 254) {
    return { valid: false as const, error: "Invalid email." };
  }
  if (!cleanMessage || cleanMessage.length > 2000) {
    return { valid: false as const, error: "Invalid message." };
  }
  if (!INQUIRY_TYPE_KEYS.includes(inquiryType as InquiryType)) {
    return { valid: false as const, error: "Invalid inquiry type." };
  }
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return { valid: false as const, error: "Invalid locale." };
  }

  const product =
    typeof productId === "string" && productId
      ? getProductById(productId)
      : undefined;
  if (productId && !product) {
    return { valid: false as const, error: "Invalid product." };
  }

  return {
    valid: true as const,
    data: {
      name: cleanName,
      email: cleanEmail,
      inquiryType: inquiryType as InquiryType,
      locale: locale as (typeof routing.locales)[number],
      message: cleanMessage,
      product,
    },
  };
}
