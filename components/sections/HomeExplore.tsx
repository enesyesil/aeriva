"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function HomeExplore() {
  const locale = useLocale();
  const t = useTranslations("homeExplore");

  const paths = [
    {
      key: "brands",
      href: `/${locale}/brands`,
      image: "/images/products/mavigol/collection.jpeg",
    },
    {
      key: "products",
      href: `/${locale}/products`,
      image: "/images/products/estila/g302-dark-front.jpeg",
    },
  ] as const;

  return (
    <section id="discover" className="section-shell bg-cream">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="grid gap-7 border-b border-ink/10 pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="eyebrow">{t("eyebrow")}</p>
              <h2 className="section-title mt-5">{t("title")}</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-ink/62 lg:justify-self-end">
              {t("intro")}
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {paths.map((path, index) => (
            <RevealOnScroll key={path.key} delay={index * 0.1}>
              <Link
                href={path.href}
                className="group block rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-ink">
                  <Image
                    src={path.image}
                    alt={t(`${path.key}ImageAlt`)}
                    fill
                    className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.035]"
                    sizes="(max-width: 767px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/5 to-transparent" />
                  <p className="absolute bottom-6 left-6 text-[0.62rem] font-semibold tracking-[0.22em] uppercase text-white/75 sm:bottom-8 sm:left-8">
                    {index === 0 ? "Estila Exclusive · Mavigöl" : t("productCount")}
                  </p>
                </div>
                <div className="px-1 pt-6">
                  <h3 className="font-serif text-3xl tracking-[-0.035em] text-ink sm:text-4xl">
                    {t(`${path.key}Title`)}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-ink/62">
                    {t(`${path.key}Body`)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-[0.67rem] font-semibold tracking-[0.18em] uppercase text-ink">
                    {t(`${path.key}Cta`)}
                    <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
