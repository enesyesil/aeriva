import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import { routing } from "@/i18n/routing";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import nl from "@/messages/nl.json";

const messages = { en, fr, nl };

describe("product catalogue", () => {
  const expectedSlugs = [
    "w-301-vanille-harmony",
    "g302-velvet-storm",
    "f201-latafa-yara",
    "c101-sauvage",
    "f167-ysl-libre",
    "mavigol-okyanus",
    "mavigol-lavanta",
    "mavigol-sandal-agaci",
    "mavigol-mango",
  ];

  it("contains nine unique products and slugs", () => {
    expect(products).toHaveLength(9);
    expect(new Set(products.map((product) => product.id)).size).toBe(9);
    expect(new Set(products.map((product) => product.slug)).size).toBe(9);
    expect(products.filter((product) => product.line === "estila")).toHaveLength(5);
    expect(products.filter((product) => product.line === "mavigol")).toHaveLength(4);
    expect(products.map((product) => product.slug)).toEqual(expectedSlugs);
    expect(products.every((product) => product.translationKey === product.id)).toBe(true);
  });

  it("produces the same 27 localized product URLs", () => {
    const localizedUrls = routing.locales.flatMap((locale) =>
      products.map((product) => `/${locale}/products/${product.slug}`),
    );

    expect(localizedUrls).toHaveLength(27);
    expect(new Set(localizedUrls).size).toBe(27);
  });

  it("references image files that exist", () => {
    for (const product of products) {
      expect(product.images.length).toBeGreaterThan(0);
      for (const image of product.images) {
        expect(existsSync(join(process.cwd(), "public", image))).toBe(true);
      }
    }
  });

  it("has the complete product contract in every locale", () => {
    const ids = products.map((product) => product.id).sort();

    for (const locale of Object.keys(messages) as Array<keyof typeof messages>) {
      const items = messages[locale].products.items;
      expect(Object.keys(items).sort()).toEqual(ids);

      for (const product of products) {
        const item = items[product.id as keyof typeof items];
        expect(item.name).toBeTruthy();
        expect(item.headline).toBeTruthy();
        expect(item.shortDescription).toBeTruthy();
        expect(Array.isArray(item.story)).toBe(true);
        expect(item.story.length).toBeGreaterThan(0);

        if (product.kind === "eau-de-parfum") {
          expect("family" in item && item.family).toBeTruthy();
          expect("topNotes" in item && item.topNotes).toBeTruthy();
          expect("heartNotes" in item && item.heartNotes).toBeTruthy();
          expect("baseNotes" in item && item.baseNotes).toBeTruthy();
          expect(product.sizeMl).toBeUndefined();
        } else {
          expect(product.sizeMl).toBe(100);
        }
      }
    }
  });

  it("provides localized navigation and content for the brands and products pages", () => {
    for (const locale of Object.keys(messages) as Array<keyof typeof messages>) {
      const localized = messages[locale];

      expect(localized.nav.brands).toBeTruthy();
      expect(localized.homeExplore.title).toBeTruthy();
      expect(localized.brandsPage.metaTitle).toContain("Dauvena Cosmetics");
      expect(localized.brandsPage.estilaBody1).toBeTruthy();
      expect(localized.brandsPage.mavigolBody1).toBeTruthy();
      expect(localized.productsPage.metaTitle).toContain("Dauvena Cosmetics");
      expect(localized.productsPage.perfumeGuideBody).toBeTruthy();
      expect(localized.productsPage.homeGuideBody).toBeTruthy();
    }
  });
});
