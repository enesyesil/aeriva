"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import BrandLockup from "@/components/layout/BrandLockup";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navLinks = [
    { key: "brands", href: `/${locale}/brands` },
    { key: "products", href: `/${locale}/products` },
    { key: "trade", href: `/${locale}#trade` },
  ] as const;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) {
        setMobileOpen(false);
      }
    };
    const desktopQuery = window.matchMedia("(min-width: 1280px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePress);
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      desktopQuery.removeEventListener("change", closeOnDesktop);
    };
  }, [mobileOpen]);

  return (
    <motion.nav
      ref={navRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setMobileOpen(false);
      }}
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65 }}
      className="fixed inset-x-0 top-0 z-50 px-2.5 pt-2.5 sm:px-5 sm:pt-4"
      aria-label="Primary navigation"
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition-all duration-500 sm:px-7 sm:py-4 ${
          scrolled
            ? "border-white/10 bg-ink/95 shadow-[0_12px_45px_rgba(24,28,31,0.2)] backdrop-blur-xl"
            : "border-white/10 bg-ink/92 shadow-[0_12px_45px_rgba(24,28,31,0.14)] backdrop-blur-xl"
        }`}
      >
        <BrandLockup href={`/${locale}`} inverse />

        <div className="hidden items-center gap-6 xl:flex xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="inline-flex min-h-11 items-center rounded-sm py-2 text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-white/58 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55"
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-4">
          <LanguageSwitcher className="hidden md:flex" />
          <a
            href={`/${locale}/contact`}
            className="hidden min-h-11 items-center justify-center rounded-full bg-white px-6 py-3 text-[0.7rem] font-semibold tracking-[0.17em] uppercase text-ink transition hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 sm:inline-flex"
          >
            {t("contact")}
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/35 hover:bg-white/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/55 xl:hidden"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
          >
            <span aria-hidden="true" className="text-lg leading-none">
              {mobileOpen ? "×" : "≡"}
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            id="mobile-navigation"
            className="mx-auto mt-2 max-h-[calc(100dvh-7.5rem)] max-w-7xl overflow-y-auto overscroll-contain rounded-2xl border border-ink/10 bg-white p-3 shadow-[0_24px_70px_rgba(24,28,31,0.18)] xl:hidden"
          >
            <div className="grid">
              {navLinks.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="min-h-11 rounded-xl px-4 py-3.5 text-xs font-semibold leading-6 tracking-[0.16em] uppercase text-ink/65 transition hover:bg-cream hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50"
                >
                  {t(link.key)}
                </a>
              ))}
              <a
                href={`/${locale}/contact`}
                onClick={() => setMobileOpen(false)}
                className="mt-2 rounded-xl bg-ink px-4 py-3.5 text-left text-xs font-semibold tracking-[0.16em] uppercase text-white transition hover:bg-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 sm:hidden"
              >
                {t("contact")}
              </a>

              <div className="mt-3 border-t border-ink/10 px-2 pt-3 md:hidden">
                <LanguageSwitcher theme="light" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
