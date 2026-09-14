"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const t = useTranslations();
  const isPerfume = product.kind === "eau-de-parfum";
  const productName = t(`products.items.${product.id}.name`);

  return (
    <article className="product-card group h-full">
      <Link
        href={`/${locale}/products/${product.slug}`}
        aria-label={`${productName} — ${t(
          isPerfume ? "catalogue.viewProduct" : "catalogue.viewDiffuser",
        )}`}
        className="grid h-full min-h-[17.5rem] grid-cols-[minmax(8.5rem,38%)_1fr] overflow-hidden rounded-[1.5rem] border border-ink/10 bg-white shadow-[0_18px_55px_rgba(28,34,36,0.06)] transition duration-500 ease-out hover:-translate-y-1 hover:border-ink/20 hover:shadow-[0_24px_65px_rgba(28,34,36,0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4 sm:grid-cols-[minmax(11rem,42%)_1fr]"
      >
        <div className="relative min-h-full overflow-hidden" style={{ backgroundColor: `${product.accent}18` }}>
          <Image
            src={product.images[0]}
            alt={`${productName} — ${t(
              isPerfume ? "catalogue.perfumeLabel" : "catalogue.diffuserLabel",
            )}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            sizes="(max-width: 767px) 38vw, (max-width: 1199px) 42vw, 21vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
        </div>

        <div className="flex min-w-0 flex-col p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 text-[0.58rem] font-semibold tracking-[0.18em] uppercase text-ink/48">
            <span>{isPerfume ? "Estila Exclusive" : "Mavigöl"}</span>
            {product.code && (
              <span className="rounded-full border border-ink/12 px-2.5 py-1 text-ink/65">
                {product.code}
              </span>
            )}
          </div>

          <h3 className="mt-4 font-serif text-[1.65rem] leading-[1.02] tracking-[-0.03em] text-ink sm:text-[1.9rem]">
            {productName}
          </h3>
          <p className="mt-3 line-clamp-4 text-[0.82rem] leading-6 text-ink/60 sm:text-sm">
            {t(`products.items.${product.id}.shortDescription`)}
          </p>

          <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-5 text-[0.62rem] font-medium tracking-[0.1em] uppercase text-ink/48">
            <span>{t(isPerfume ? "catalogue.perfumeLabel" : "catalogue.diffuserLabel")}</span>
            <span aria-hidden="true">·</span>
            <span>
              {isPerfume
                ? t(`productPage.audiences.${product.audience}`)
                : `${product.sizeMl} ml`}
            </span>
          </div>

          <span className="mt-4 inline-flex items-center gap-2 border-t border-ink/10 pt-4 text-[0.64rem] font-semibold tracking-[0.17em] uppercase text-ink">
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
