import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { products } from "@/data/products";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import nl from "@/messages/nl.json";

const messages = { en, fr, nl };

describe("product catalogue", () => {
  it("contains nine unique products and slugs", () => {
    expect(products).toHaveLength(9);
    expect(new Set(products.map((product) => product.id)).size).toBe(9);
    expect(new Set(products.map((product) => product.slug)).size).toBe(9);
    expect(products.filter((product) => product.line === "estila")).toHaveLength(5);
    expect(products.filter((product) => product.line === "mavigol")).toHaveLength(4);
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
});
