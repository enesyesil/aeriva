import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createPageMetadata, getSiteUrl } from "@/lib/metadata";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import nl from "@/messages/nl.json";
import { generateMetadata as homeMetadata } from "@/app/[locale]/page";
import { generateMetadata as brandsMetadata } from "@/app/[locale]/brands/page";
import { generateMetadata as contactMetadata } from "@/app/[locale]/contact/page";
import { generateMetadata as productsMetadata } from "@/app/[locale]/products/page";
import { generateMetadata as productMetadata } from "@/app/[locale]/products/[slug]/page";

const messages = { en, fr, nl };
type Locale = keyof typeof messages;

vi.mock("next-intl/server", () => ({
  getTranslations: async ({ locale, namespace }: { locale: Locale; namespace: string }) => {
    const bundle = messages[locale] as Record<string, unknown>;
    return (key: string) => key.split(".").reduce<unknown>(
      (value, segment) => (value as Record<string, unknown>)[segment],
      bundle[namespace],
    ) as string;
  },
}));

beforeEach(() => {
  vi.stubEnv("SITE_URL", undefined);
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);
});
afterEach(() => vi.unstubAllEnvs());

describe("public metadata origin", () => {
  it("defaults to the production HTTPS origin without configuration", () => {
    expect(getSiteUrl({}).href).toBe("https://dauvena.com/");
  });

  it("prefers the server variable and supports the legacy variable", () => {
    expect(getSiteUrl({ SITE_URL: " https://preview.dauvena.com/ ", NEXT_PUBLIC_SITE_URL: "https://legacy.dauvena.com" }).href)
      .toBe("https://preview.dauvena.com/");
    expect(getSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://legacy.dauvena.com" }).href)
      .toBe("https://legacy.dauvena.com/");
  });

  it.each([
    "not a URL", "http://dauvena.com", "https://localhost", "https://preview.local",
    "https://service.internal", "https://127.0.0.1", "https://10.0.0.1", "https://[::1]",
    "https://user:secret@dauvena.com", "https://dauvena.com:8443",
    "https://dauvena.com/contact", "https://dauvena.com?token=secret", "https://dauvena.com#fragment",
  ])("uses the production fallback for a nonpublic or invalid origin: %s", (configured) => {
    expect(getSiteUrl({ SITE_URL: configured }).href).toBe("https://dauvena.com/");
  });

  it("reads server configuration on each invocation", () => {
    vi.stubEnv("SITE_URL", "https://preview.dauvena.com");
    expect(getSiteUrl().origin).toBe("https://preview.dauvena.com");
    vi.stubEnv("SITE_URL", "https://dauvena.com");
    expect(getSiteUrl().origin).toBe("https://dauvena.com");
  });
});

describe("localized page metadata", () => {
  it.each(["en", "fr", "nl"] as const)("gives %s routes their own copy, canonical URL and sharing metadata", async (locale) => {
    const params = Promise.resolve({ locale });
    const localized = messages[locale];
    const pages = [
      { path: "", value: await homeMetadata({ params }), title: localized.meta.title, description: localized.meta.description },
      { path: "/brands", value: await brandsMetadata({ params }), title: localized.brandsPage.metaTitle, description: localized.brandsPage.metaDescription },
      { path: "/contact", value: await contactMetadata({ params, searchParams: Promise.resolve({ product: "w301" }) }), title: localized.contactPage.metaTitle, description: localized.contactPage.metaDescription },
      { path: "/products", value: await productsMetadata({ params }), title: localized.productsPage.metaTitle, description: localized.productsPage.metaDescription },
    ];
    for (const { path, value, title, description } of pages) {
      const canonical = `https://dauvena.com/${locale}${path}`;
      const image = `https://dauvena.com/social/${locale}`;
      expect(value.title).toBe(title);
      expect(value.description).toBe(description);
      expect(value.alternates).toEqual({
        canonical,
        languages: {
          en: `https://dauvena.com/en${path}`,
          fr: `https://dauvena.com/fr${path}`,
          nl: `https://dauvena.com/nl${path}`,
          "x-default": `https://dauvena.com/en${path}`,
        },
      });
      expect(value.openGraph).toMatchObject({
        title, description, url: canonical, type: "website", siteName: "Dauvena Cosmetics",
        locale: { en: "en_US", fr: "fr_FR", nl: "nl_NL" }[locale],
        images: [{ url: image, width: 1200, height: 630, type: "image/png", alt: title }],
      });
      expect(value.twitter).toEqual({
        card: "summary_large_image", title, description, images: [{ url: image, alt: title }],
      });
    }
  });

  it("keeps product codes and points to the matching product social card", async () => {
    const value = await productMetadata({ params: Promise.resolve({ locale: "fr", slug: "w-301" }) });
    expect(value.title).toBe("W-301 | Dauvena Cosmetics");
    expect(value.description).toBe(fr.products.items.w301.shortDescription);
    expect(value.alternates?.canonical).toBe("https://dauvena.com/fr/products/w-301");
    expect(value.openGraph).toMatchObject({
      url: "https://dauvena.com/fr/products/w-301",
      images: [{ url: "https://dauvena.com/social/fr/w-301", width: 1200, height: 630 }],
    });
    expect(value.twitter).toMatchObject({ images: [{ url: "https://dauvena.com/social/fr/w-301" }] });
  });

  it("keeps Mavigöl product names and avoids metadata for nonexistent products", async () => {
    const value = await productMetadata({ params: Promise.resolve({ locale: "nl", slug: "mavigol-okyanus" }) });
    expect(value.title).toBe("Okyanus | Dauvena Cosmetics");
    expect(value.openGraph).toMatchObject({ images: [{ url: "https://dauvena.com/social/nl/mavigol-okyanus" }] });
    expect(await productMetadata({ params: Promise.resolve({ locale: "en", slug: "missing" }) })).toEqual({});
  });

  it("keeps every generated link on the configured public origin", () => {
    vi.stubEnv("SITE_URL", "https://preview.dauvena.com");
    const value = createPageMetadata({ locale: "nl", title: "Products", description: "Catalogue", path: "/products" });
    expect(value.metadataBase).toEqual(new URL("https://preview.dauvena.com"));
    expect(value.alternates?.canonical).toBe("https://preview.dauvena.com/nl/products");
    expect(value.openGraph).toMatchObject({
      url: "https://preview.dauvena.com/nl/products",
      alternateLocale: ["en_US", "fr_FR"],
      images: [{ url: "https://preview.dauvena.com/social/nl" }],
    });
  });

  it("rejects paths that could change canonical destinations", () => {
    for (const path of ["//elsewhere.com", "/../contact", "/%2e%2e/contact", "/contact?product=w301", "/contact#form"]) {
      expect(() => createPageMetadata({ locale: "en", title: "Contact", description: "Email us", path })).toThrow();
    }
    expect(() => createPageMetadata({ locale: "en", title: "Product", description: "Perfume", productSlug: "../contact" })).toThrow();
    expect(createPageMetadata({ locale: "de", title: "Unsupported", description: "Unsupported locale" })).toEqual({});
  });
});
