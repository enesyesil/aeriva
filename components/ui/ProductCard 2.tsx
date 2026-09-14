"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations();
  const isPerfume = product.kind === "eau-de-parfum";

  return (
    <article className="product-card group">
      <Link
        href={`/${locale}/products/${product.slug}`}
        className="block rounded-[1.7rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4"
      >
        <div className="product-card__media" style={{ backgroundColor: `${product.accent}18` }}>
          <Image
            src={product.images[0]}
            alt={`${t(`products.items.${product.id}.name`)} — ${t(
              isPerfume ? "catalogue.perfumeLabel" : "catalogue.diffuserLabel",
            )}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white">
            <span className="text-[0.64rem] font-semibold tracking-[0.22em] uppercase text-white/85">
              {isPerfume ? "Estila Exclusive" : "Mavigöl"}
            </span>
            {product.code && (
              <span className="rounded-full border border-white/35 bg-black/10 px-3 py-1 text-[0.62rem] tracking-[0.18em] uppercase backdrop-blur-sm">
                {product.code}
              </span>
            )}
          </div>
        </div>

        <div className="px-1 pb-2 pt-5">
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-ink/45">
            {t(isPerfume ? "catalogue.perfumeLabel" : "catalogue.diffuserLabel")}
            {product.sizeMl ? ` · ${product.sizeMl} ml` : ""}
          </p>
          <h3 className="mt-2 font-serif text-[1.75rem] leading-tight tracking-[-0.02em] text-ink">
            {t(`products.items.${product.id}.name`)}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/60">
            {t(`products.items.${product.id}.shortDescription`)}
          </p>
          <span className="mt-5 inline-flex items-center gap-2 text-[0.68rem] font-semibold tracking-[0.19em] uppercase text-ink">
            {t(isPerfume ? "catalogue.viewProduct" : "catalogue.viewDiffuser")}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
