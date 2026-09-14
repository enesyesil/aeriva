import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import Catalogue from "@/components/sections/Catalogue";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { routing } from "@/i18n/routing";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productsPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/products`,
      languages: Object.fromEntries(
        routing.locales.map((language) => [language, `/${language}/products`]),
      ),
    },
  };
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productsPage" });

  return (
    <div className="bg-canvas pt-28 sm:pt-32">
      <section className="px-5 pb-10 pt-8 sm:px-8 sm:pb-14 lg:pt-12">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-cream px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-clay/20" />
          <div className="pointer-events-none absolute -bottom-40 right-20 h-72 w-72 rounded-full bg-white/45 blur-2xl" />
          <RevealOnScroll>
            <div className="relative max-w-4xl">
              <p className="eyebrow">{t("eyebrow")}</p>
              <h1 className="mt-6 max-w-4xl font-serif text-[clamp(3.4rem,7vw,6.7rem)] leading-[0.9] tracking-[-0.055em] text-ink">
                {t("title")}
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-ink/62 sm:text-lg">
                {t("intro")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#perfumes" className="rounded-full border border-ink/12 bg-white/65 px-4 py-2.5 text-[0.62rem] font-semibold tracking-[0.17em] uppercase text-ink/60 transition hover:border-ink/30 hover:text-ink">
                  {t("perfumeCount")}
                </a>
                <a href="#home-fragrance" className="rounded-full border border-ink/12 bg-white/65 px-4 py-2.5 text-[0.62rem] font-semibold tracking-[0.17em] uppercase text-ink/60 transition hover:border-ink/30 hover:text-ink">
                  {t("diffuserCount")}
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <Catalogue />

      <section className="section-shell bg-cream">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll delay={0.1}>
            <div className="flex flex-col gap-6 rounded-[1.7rem] bg-ink p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <div>
                <h3 className="font-serif text-3xl">{t("helpTitle")}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-white/58">{t("helpBody")}</p>
              </div>
              <Link href={`/${locale}/contact`} className="button-light shrink-0">
                {t("helpCta")}
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
