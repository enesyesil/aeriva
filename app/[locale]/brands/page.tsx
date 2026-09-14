import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { routing } from "@/i18n/routing";

interface BrandsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BrandsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brandsPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/brands`,
      languages: Object.fromEntries(
        routing.locales.map((language) => [language, `/${language}/brands`]),
      ),
    },
  };
}

export default async function BrandsPage({ params }: BrandsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "brandsPage" });

  return (
    <div className="bg-canvas pt-28 sm:pt-32">
      <section className="px-5 pb-16 pt-12 sm:px-8 sm:pb-20 lg:pt-16">
        <RevealOnScroll>
          <div className="mx-auto max-w-5xl text-center">
            <p className="eyebrow">{t("eyebrow")}</p>
            <h1 className="mx-auto mt-6 max-w-[12ch] font-serif text-[clamp(3.6rem,8vw,7.4rem)] leading-[0.9] tracking-[-0.055em] text-ink">
              {t("title")}
            </h1>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-ink/62 sm:text-lg">
              {t("intro")}
            </p>
          </div>
        </RevealOnScroll>
      </section>

      <section className="section-shell bg-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <RevealOnScroll>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink">
              <Image
                src="/images/products/estila/g302-dark-front.jpeg"
                alt={t("estilaImageAlt")}
                fill
                priority
                className="object-cover transition-transform duration-[1200ms] hover:scale-[1.025]"
                sizes="(max-width: 1024px) 100vw, 52vw"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="max-w-xl">
              <p className="eyebrow">{t("estilaKicker")}</p>
              <h2 className="mt-5 font-serif text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[-0.045em]">
                {t("estilaTitle")}
              </h2>
              <div className="mt-7 space-y-5 text-base leading-8 text-ink/64">
                <p>{t("estilaBody1")}</p>
                <p>{t("estilaBody2")}</p>
              </div>
              <ul className="mt-8 space-y-3 border-y border-ink/10 py-6 text-sm text-ink/70">
                <li>01 · {t("estilaFeature1")}</li>
                <li>02 · {t("estilaFeature2")}</li>
              </ul>
              <Link href={`/${locale}/products#perfumes`} className="button-primary mt-8">
                {t("estilaCta")}
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-shell bg-canvas">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <RevealOnScroll delay={0.1} className="lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sage">
              <Image
                src="/images/products/mavigol/collection.jpeg"
                alt={t("mavigolImageAlt")}
                fill
                className="object-cover transition-transform duration-[1200ms] hover:scale-[1.025]"
                sizes="(max-width: 1024px) 100vw, 52vw"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div className="max-w-xl">
              <p className="eyebrow">{t("mavigolKicker")}</p>
              <h2 className="mt-5 font-serif text-[clamp(3rem,5vw,5rem)] leading-[0.95] tracking-[-0.045em]">
                {t("mavigolTitle")}
              </h2>
              <div className="mt-7 space-y-5 text-base leading-8 text-ink/64">
                <p>{t("mavigolBody1")}</p>
                <p>{t("mavigolBody2")}</p>
              </div>
              <ul className="mt-8 space-y-3 border-y border-ink/10 py-6 text-sm text-ink/70">
                <li>01 · {t("mavigolFeature1")}</li>
                <li>02 · {t("mavigolFeature2")}</li>
              </ul>
              <Link href={`/${locale}/products#home-fragrance`} className="button-primary mt-8">
                {t("mavigolCta")}
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section-shell bg-ink text-white">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="eyebrow !text-white/45">{t("philosophyEyebrow")}</p>
                <h2 className="mt-5 max-w-[13ch] font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[0.98] tracking-[-0.045em]">
                  {t("philosophyTitle")}
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-8 text-white/60 lg:justify-self-end">
                {t("philosophyBody")}
              </p>
            </div>
          </RevealOnScroll>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {["skin", "space"].map((item, index) => (
              <RevealOnScroll key={item} delay={index * 0.1}>
                <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.055] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075] sm:p-9">
                  <span className="text-xs text-white/30">0{index + 1}</span>
                  <h3 className="mt-8 font-serif text-3xl">{t(`${item}Title`)}</h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">
                    {t(`${item}Body`)}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
