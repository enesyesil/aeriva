"use client";

import { useLocale, useTranslations } from "next-intl";
import BrandLockup from "@/components/layout/BrandLockup";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();

  const links = [
    { label: t("nav.perfumes"), href: `/${locale}#perfumes` },
    { label: t("nav.homeFragrance"), href: `/${locale}#home-fragrance` },
    { label: t("nav.trade"), href: `/${locale}#trade` },
  ];

  return (
    <footer className="bg-ink px-5 pb-8 pt-16 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 pb-14 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <BrandLockup href={`/${locale}`} inverse />
            <p className="mt-6 max-w-md text-sm leading-7 text-white/48">
              {t("footer.description")}
            </p>
            <p className="mt-4 font-serif text-lg italic text-white/38">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h2 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/35">
              {t("footer.explore")}
            </h2>
            <ul className="mt-5 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/58 transition hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/35">
              {t("footer.company")}
            </h2>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={`/${locale}#about`} className="text-sm text-white/58 transition hover:text-white">
                  {t("nav.about")}
                </a>
              </li>
              <li>
                <a href={`/${locale}#contact`} className="text-sm text-white/58 transition hover:text-white">
                  {t("footer.contact")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Dauvena Cosmetics. {t("footer.rights")}</p>
          <p>{t("footer.descriptor")}</p>
        </div>
      </div>
    </footer>
  );
}
