"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="section-shell bg-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
        <RevealOnScroll>
          <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-peach">
            <Image
              src="/images/products/mavigol/mango-lifestyle.jpeg"
              alt={t("imageAlt")}
              fill
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.025]"
              sizes="(max-width: 1024px) 100vw, 44vw"
            />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.12}>
          <div className="max-w-xl">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="section-title mt-5">{t("title")}</h2>
            <div className="mt-8 space-y-5 text-base leading-8 text-ink/65">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>
            <p className="mt-9 font-serif text-2xl italic text-clay">{t("signature")}</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
