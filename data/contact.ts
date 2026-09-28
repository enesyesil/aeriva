export const CONTACT_EMAIL = "info@dauvena.com";

export function getContactEmailHref(subject?: string) {
  return `mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}
