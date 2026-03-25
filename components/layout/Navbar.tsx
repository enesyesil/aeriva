"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { key: "about", href: "#about" },
  { key: "fragrances", href: "#fragrances" },
  { key: "whyUs", href: "#why-us" },
  { key: "locations", href: "/locations" },
] as const;

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Element not on current page — navigate to homepage with hash
        router.push(`/${locale}/${href}`);
      }
    } else {
      router.push(`/${locale}${href}`);
    }
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-6xl"
    >
      <div
        className={`rounded-[18px] px-7 py-5 flex items-center justify-between transition-all duration-700 ease-out ${
          scrolled
            ? "bg-navy shadow-[0_4px_0_0_rgba(0,0,0,0.15),0_6px_24px_rgba(0,0,0,0.20)] border border-white/10"
            : "bg-navy shadow-[0_4px_0_0_rgba(0,0,0,0.15),0_6px_24px_rgba(0,0,0,0.20)] border border-white/10"
        }`}
      >
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="group flex items-center gap-3"
        >
          <span
            className={`font-serif text-[22px] tracking-[0.04em] transition-colors duration-700 ${
              scrolled ? "text-white" : "text-white"
            }`}
          >
            Aériva
          </span>
          <span
            className={`hidden sm:block w-8 h-[1px] transition-all duration-700 group-hover:w-12 ${
              scrolled ? "bg-white/25" : "bg-white/25"
            }`}
          />
          <span
            className={`hidden sm:block text-[9px] font-sans font-medium tracking-[0.35em] uppercase transition-colors duration-700 ${
              scrolled ? "text-white/45" : "text-white/45"
            }`}
          >
            Belgique
          </span>
        </a>

        {/* Desktop nav links — center */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              onClick={(e) => scrollTo(e, link.href)}
              className={`group relative text-[13px] font-medium tracking-[0.18em] uppercase transition-colors duration-500 ${
                scrolled
                  ? "text-white/60 hover:text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {t(link.key)}
              <span
                className={`absolute -bottom-1 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500 ease-out ${
                  scrolled ? "bg-white/40" : "bg-white/40"
                }`}
              />
            </a>
          ))}
        </div>

        {/* Right side — Language + Contact button */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher scrolled={scrolled} />

          {/* Contact — 3D elevated button */}
          <button
            onClick={(e) => scrollTo(e, "#contact")}
            className={`hidden md:block relative text-[11px] font-medium tracking-[0.2em] uppercase px-5 py-2 rounded-full cursor-pointer transition-all duration-500 active:translate-y-[1px] ${
              scrolled
                ? "text-navy bg-white shadow-[0_3px_0_0_#c0c0c0,0_5px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_2px_0_0_#c0c0c0,0_3px_10px_rgba(0,0,0,0.15)] hover:translate-y-[1px] active:shadow-[0_0px_0_0_#c0c0c0,0_1px_4px_rgba(0,0,0,0.10)]"
                : "text-navy bg-white shadow-[0_3px_0_0_#c0c0c0,0_5px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_2px_0_0_#c0c0c0,0_3px_10px_rgba(0,0,0,0.15)] hover:translate-y-[1px] active:shadow-[0_0px_0_0_#c0c0c0,0_1px_4px_rgba(0,0,0,0.10)]"
            }`}
          >
            {t("contact")}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-[5px] p-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-[1.2px] transition-all duration-400 ${
                scrolled ? "bg-white" : "bg-white"
              } ${mobileOpen ? "rotate-45 translate-y-[6.2px]" : ""}`}
            />
            <span
              className={`block w-3.5 h-[1.2px] transition-all duration-400 ${
                scrolled ? "bg-white" : "bg-white"
              } ${mobileOpen ? "opacity-0 translate-x-2" : ""}`}
            />
            <span
              className={`block w-5 h-[1.2px] transition-all duration-400 ${
                scrolled ? "bg-white" : "bg-white"
              } ${mobileOpen ? "-rotate-45 -translate-y-[6.2px]" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden mt-2.5"
          >
            <div className="bg-white/90 backdrop-blur-2xl rounded-[16px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/40 px-7 py-6 flex flex-col gap-5">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.key}
                  href={link.href}
                  onClick={(e) => scrollTo(e, link.href)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="text-[13px] font-medium tracking-[0.18em] uppercase text-navy/60 hover:text-navy transition-colors duration-400"
                >
                  {t(link.key)}
                </motion.a>
              ))}

              {/* Contact button in mobile menu */}
              <motion.button
                onClick={(e) => scrollTo(e, "#contact")}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.06, duration: 0.3 }}
                className="mt-1 text-[12px] font-medium tracking-[0.2em] uppercase text-white bg-navy px-5 py-2.5 rounded-full shadow-[0_3px_0_0_#0f1a30,0_6px_16px_rgba(27,42,74,0.18)] active:translate-y-[1px] active:shadow-[0_1px_0_0_#0f1a30,0_2px_6px_rgba(27,42,74,0.18)] transition-all duration-300 cursor-pointer self-start"
              >
                {t("contact")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
