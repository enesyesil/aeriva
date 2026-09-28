import { isIP } from "node:net";
import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

const productionOrigin = "https://dauvena.com";
const openGraphLocales = { en: "en_US", fr: "fr_FR", nl: "nl_NL" } as const;

export function getSiteUrl(environment: Record<string, string | undefined> = process.env): URL {
  // Access the environment through the argument so the legacy NEXT_PUBLIC value
  // is not replaced by Next.js's build-time public-variable substitution.
  const configured = environment.SITE_URL?.trim() || environment.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return new URL(productionOrigin);

  try {
    const url = new URL(configured);
    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
    const privateHostname = hostname === "localhost" ||
      /\.(localhost|local|internal|localdomain)$/.test(hostname) ||
      isIP(hostname.replace(/^\[|\]$/g, "")) !== 0 ||
      !hostname.includes(".");
    if (
      url.protocol !== "https:" || privateHostname || url.username || url.password ||
      url.port || url.pathname !== "/" || url.search || url.hash
    ) {
      return new URL(productionOrigin);
    }
    return new URL(url.origin);
  } catch {
    return new URL(productionOrigin);
  }
}

interface PageMetadataOptions {
  locale: string;
  title: string;
  description: string;
  /** Path after the locale, without a query string or hash. */
  path?: string;
  /** Use the product social card instead of the shared brand card. */
  productSlug?: string;
}

export function createPageMetadata({
  locale,
  title,
  description,
  path = "",
  productSlug,
}: PageMetadataOptions): Metadata {
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) return {};
  if (path && !/^(?:\/[a-z0-9-]+)+$/.test(path)) {
    throw new Error("Metadata paths must be local paths without query strings or fragments.");
  }
  if (productSlug !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(productSlug)) {
    throw new Error("Product metadata requires a valid product slug.");
  }

  const language = locale as keyof typeof openGraphLocales;
  const base = getSiteUrl();
  const localizedUrl = (value: string) => new URL(`/${value}${path}`, base).href;
  const canonical = localizedUrl(locale);
  const imageUrl = new URL(`/social/${locale}${productSlug ? `/${productSlug}` : ""}`, base).href;
  const image = { url: imageUrl, width: 1200, height: 630, type: "image/png", alt: title };

  return {
    metadataBase: base,
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...Object.fromEntries(routing.locales.map((value) => [value, localizedUrl(value)])),
        "x-default": localizedUrl(routing.defaultLocale),
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Dauvena Cosmetics",
      url: canonical,
      locale: openGraphLocales[language],
      alternateLocale: routing.locales.filter((value) => value !== locale).map((value) => openGraphLocales[value]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
  };
}
