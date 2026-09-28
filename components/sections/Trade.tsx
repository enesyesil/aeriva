"use client";

import { useLocale, useTranslations } from "next-intl";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function Trade() {
  const t = useTranslations("trade");
  const locale = useLocale();

  return (
    <section id="trade" className="section-shell scroll-mt-24 bg-cream">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="trade-panel overflow-hidden rounded-[2rem] bg-ink px-6 py-10 text-white sm:px-10 md:px-14 md:py-16">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow !text-white/55">{t("eyebrow")}</p>
                <h2 className="mt-5 font-serif text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
                  {t("title")}
                </h2>
                <p className="mt-6 max-w-xl text-base leading-7 text-white/62">
                  {t("body")}
                </p>
                <a
                  href={`/${locale}/contact?inquiry=wholesale`}
                  className="button-light mt-8"
                >
                  {t("cta")}
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="min-w-0 break-words rounded-3xl border border-white/10 bg-white/[0.055] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075]">
                  <span className="text-xs text-white/35">01</span>
                  <h3 className="mt-7 font-serif text-2xl">{t("consumerTitle")}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{t("consumerBody")}</p>
                </div>
                <div className="min-w-0 break-words rounded-3xl border border-white/10 bg-white/[0.055] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075]">
                  <span className="text-xs text-white/35">02</span>
                  <h3 className="mt-7 font-serif text-2xl">{t("partnerTitle")}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/55">{t("partnerBody")}</p>
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
