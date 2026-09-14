import type { Product, ProductKind, ProductLine } from "@/types";

export const products: Product[] = [
  {
    id: "w301",
    translationKey: "w301",
    slug: "w-301-vanille-harmony",
    line: "estila",
    kind: "eau-de-parfum",
    code: "W-301",
    audience: "unisex",
    images: ["/images/products/estila/w301-woody.jpeg"],
    accent: "#b8a178",
  },
  {
    id: "g302",
    translationKey: "g302",
    slug: "g302-velvet-storm",
    line: "estila",
    kind: "eau-de-parfum",
    code: "G302",
    audience: "women",
    images: [
      "/images/products/estila/g302-dark-front.jpeg",
      "/images/products/estila/g302-dark-warm.jpeg",
    ],
    accent: "#a94b76",
  },
  {
    id: "f201",
    translationKey: "f201",
    slug: "f201-latafa-yara",
    line: "estila",
    kind: "eau-de-parfum",
    code: "F201",
    audience: "women",
    images: ["/images/products/estila/f201-fruit.jpeg"],
    accent: "#d58f64",
  },
  {
    id: "c101",
    translationKey: "c101",
    slug: "c101-sauvage",
    line: "estila",
    kind: "eau-de-parfum",
    code: "C101",
    audience: "men",
    images: ["/images/products/estila/c101-citrus.jpeg"],
    accent: "#a8bc9a",
  },
  {
    id: "f167",
    translationKey: "f167",
    slug: "f167-ysl-libre",
    line: "estila",
    kind: "eau-de-parfum",
    code: "F167",
    audience: "women",
    images: ["/images/products/estila/f167-floral.jpeg"],
    accent: "#d2a2a8",
  },
  {
    id: "okyanus",
    translationKey: "okyanus",
    slug: "mavigol-okyanus",
    line: "mavigol",
    kind: "reed-diffuser",
    audience: "home",
    sizeMl: 100,
    images: [
      "/images/products/mavigol/okyanus-setting.jpeg",
      "/images/products/mavigol/okyanus-product.jpeg",
      "/images/products/mavigol/okyanus-lifestyle.jpeg",
    ],
    accent: "#2f8da7",
  },
  {
    id: "lavanta",
    translationKey: "lavanta",
    slug: "mavigol-lavanta",
    line: "mavigol",
    kind: "reed-diffuser",
    audience: "home",
    sizeMl: 100,
    images: [
      "/images/products/mavigol/lavanta-setting.jpeg",
      "/images/products/mavigol/lavanta-product.jpeg",
    ],
    accent: "#7771ae",
  },
  {
    id: "sandal",
    translationKey: "sandal",
    slug: "mavigol-sandal-agaci",
    line: "mavigol",
    kind: "reed-diffuser",
    audience: "home",
    sizeMl: 100,
    images: [
      "/images/products/mavigol/sandal-setting.jpeg",
      "/images/products/mavigol/sandal-product.jpeg",
      "/images/products/mavigol/sandal-lifestyle.jpeg",
    ],
    accent: "#a9473d",
  },
  {
    id: "mango",
    translationKey: "mango",
    slug: "mavigol-mango",
    line: "mavigol",
    kind: "reed-diffuser",
    audience: "home",
    sizeMl: 100,
    images: [
      "/images/products/mavigol/mango-setting.jpeg",
      "/images/products/mavigol/mango-product.jpeg",
      "/images/products/mavigol/mango-lifestyle.jpeg",
    ],
    accent: "#e98a2e",
  },
];

export const perfumeProducts = products.filter(
  (product) => product.kind === "eau-de-parfum",
);

export const homeFragranceProducts = products.filter(
  (product) => product.kind === "reed-diffuser",
);

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductsByLine(line: ProductLine) {
  return products.filter((product) => product.line === line);
}

export function isProductKind(value: string): value is ProductKind {
  return value === "eau-de-parfum" || value === "reed-diffuser";
}
