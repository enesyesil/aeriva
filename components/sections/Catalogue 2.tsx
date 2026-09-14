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
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="section-title mt-5">{t("title")}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-ink/60 sm:text-lg">
              {t("subtitle")}
            </p>
          </div>
        </RevealOnScroll>

        <div id="perfumes" className="scroll-mt-28 pt-20 md:pt-28">
          <RevealOnScroll>
            <div className="mb-10 grid gap-4 border-b border-ink/10 pb-7 md:grid-cols-[1fr_1fr] md:items-end">
              <h3 className="font-serif text-3xl tracking-[-0.03em] text-ink sm:text-4xl">
                {t("perfumesTitle")}
              </h3>
              <p className="max-w-xl text-sm leading-6 text-ink/55 md:justify-self-end md:text-right">
                {t("perfumesSubtitle")}
              </p>
            </div>
          </RevealOnScroll>
          <div className="grid gap-x-7 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {perfumeProducts.map((product, index) => (
              <RevealOnScroll key={product.id} delay={(index % 3) * 0.08}>
                <ProductCard product={product} />
              </RevealOnScroll>
            ))}
          </div>
        </div>

        <div id="home-fragrance" className="scroll-mt-28 pt-24 md:pt-32">
          <RevealOnScroll>
            <div className="mb-10 grid gap-4 border-b border-ink/10 pb-7 md:grid-cols-[1fr_1fr] md:items-end">
              <h3 className="font-serif text-3xl tracking-[-0.03em] text-ink sm:text-4xl">
                {t("homeTitle")}
              </h3>
              <p className="max-w-xl text-sm leading-6 text-ink/55 md:justify-self-end md:text-right">
                {t("homeSubtitle")}
              </p>
            </div>
          </RevealOnScroll>
          <div className="grid gap-x-7 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
            {homeFragranceProducts.map((product, index) => (
              <RevealOnScroll key={product.id} delay={(index % 4) * 0.08}>
                <ProductCard product={product} />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
