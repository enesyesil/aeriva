"use client";

import { useTranslations } from "next-intl";
import { fragrances } from "@/data/fragrances";
import FragranceCard from "@/components/ui/FragranceCard";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function Fragrances() {
  const t = useTranslations("fragrances");

  return (
    <section id="fragrances" className="py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy">
              {t("title")}
            </h2>
            <p className="mt-4 text-base text-navy/60 max-w-lg mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fragrances.map((frag, i) => (
            <RevealOnScroll key={frag.id} delay={i * 0.15}>
              <FragranceCard
                name={t(`items.${frag.id}.name`)}
                description={t(`items.${frag.id}.description`)}
                notes={t(`items.${frag.id}.notes`)}
                gradient={frag.color}
                image={frag.image}
              />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
