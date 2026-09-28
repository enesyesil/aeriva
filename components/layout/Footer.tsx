"use client";

import { useLocale, useTranslations } from "next-intl";
import BrandLockup from "@/components/layout/BrandLockup";
import { CONTACT_EMAIL, getContactEmailHref } from "@/data/contact";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const year = new Date().getFullYear();
  const linkClassName = "inline-flex min-h-11 max-w-full items-center rounded-sm py-2 text-sm leading-6 text-white/58 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55";

  const links = [
    { label: t("nav.brands"), href: `/${locale}/brands` },
    { label: t("nav.products"), href: `/${locale}/products` },
    { label: t("nav.trade"), href: `/${locale}#trade` },
  ];

  return (
    <footer className="bg-ink px-5 pb-8 pt-16 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-x-8 gap-y-10 pb-14 md:grid-cols-[1.3fr_0.7fr_0.7fr] lg:gap-x-12">
          <div className="min-w-0">
            <BrandLockup href={`/${locale}`} inverse />
            <p className="mt-6 max-w-md text-sm leading-7 text-white/48">
              {t("footer.description")}
            </p>
            <p className="mt-4 font-serif text-lg italic text-white/38">
              {t("footer.tagline")}
            </p>
          </div>

          <div className="min-w-0">
            <h2 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/35">
              {t("footer.explore")}
            </h2>
            <ul className="mt-3 space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={linkClassName}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h2 className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-white/35">
              {t("footer.company")}
            </h2>
            <ul className="mt-3 space-y-1">
              <li>
                <a href={`/${locale}`} className={linkClassName}>
                  {t("nav.home")}
                </a>
              </li>
              <li>
                <a href={`/${locale}/contact`} className={linkClassName}>
                  {t("footer.contact")}
                </a>
              </li>
              <li>
                <a href={getContactEmailHref()} className={`${linkClassName} break-all`}>
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-xs leading-6 text-white/30 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>© {year} Dauvena Cosmetics. {t("footer.rights")}</p>
          <p>{t("footer.descriptor")}</p>
        </div>
      </div>
    </footer>
  );
}
