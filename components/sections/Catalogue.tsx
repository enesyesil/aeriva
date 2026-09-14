"use client";

import { useTranslations } from "next-intl";
import { homeFragranceProducts, perfumeProducts } from "@/data/products";
import ProductCard from "@/components/ui/ProductCard";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function Catalogue() {
  const t = useTranslations("catalogue");

  return (
    <section id="products" className="section-shell bg-canvas">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="grid gap-7 border-b border-ink/10 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="eyebrow">{t("eyebrow")}</p>
              <h2 className="section-title mt-5">{t("title")}</h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-ink/60 sm:text-lg">
                {t("subtitle")}
              </p>
            </div>
            <nav className="flex flex-wrap gap-2" aria-label={t("eyebrow")}>
              <a href="#perfumes" className="rounded-full border border-ink/12 bg-white px-4 py-2.5 text-[0.62rem] font-semibold tracking-[0.17em] uppercase text-ink/65 transition hover:border-ink/30 hover:text-ink">
                {t("perfumesTitle")}
              </a>
              <a href="#home-fragrance" className="rounded-full border border-ink/12 bg-white px-4 py-2.5 text-[0.62rem] font-semibold tracking-[0.17em] uppercase text-ink/65 transition hover:border-ink/30 hover:text-ink">
                {t("homeTitle")}
              </a>
            </nav>
          </div>
        </RevealOnScroll>

        <div id="perfumes" className="scroll-mt-32 pt-14 md:pt-18">
          <RevealOnScroll>
            <div className="mb-7 grid gap-3 md:grid-cols-[1fr_1fr] md:items-end">
              <div className="flex items-baseline gap-4">
                <h3 className="font-serif text-3xl tracking-[-0.03em] text-ink sm:text-4xl">
                  {t("perfumesTitle")}
                </h3>
                <span className="text-xs tabular-nums text-ink/35">05</span>
              </div>
              <p className="max-w-xl text-sm leading-6 text-ink/55 md:justify-self-end md:text-right">
                {t("perfumesSubtitle")}
              </p>
            </div>
          </RevealOnScroll>
          <div className="grid gap-4 lg:grid-cols-2">
            {perfumeProducts.map((product, index) => (
              <RevealOnScroll key={product.id} delay={(index % 2) * 0.07}>
                <ProductCard product={product} />
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <div id="home-fragrance" className="scroll-mt-32 pt-20 md:pt-24">
          <RevealOnScroll>
            <div className="mb-7 grid gap-3 md:grid-cols-[1fr_1fr] md:items-end">
              <div className="flex items-baseline gap-4">
                <h3 className="font-serif text-3xl tracking-[-0.03em] text-ink sm:text-4xl">
                  {t("homeTitle")}
                </h3>
                <span className="text-xs tabular-nums text-ink/35">04</span>
              </div>
              <p className="max-w-xl text-sm leading-6 text-ink/55 md:justify-self-end md:text-right">
                {t("homeSubtitle")}
              </p>
            </div>
          </RevealOnScroll>
          <div className="grid gap-4 lg:grid-cols-2">
            {homeFragranceProducts.map((product, index) => (
              <RevealOnScroll key={product.id} delay={(index % 2) * 0.07}>
                <ProductCard product={product} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
