"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const locales = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "nl", label: "Nederlands" },
] as const;

export default function LanguageSwitcher({ scrolled = false }: { scrolled?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = locales.find((l) => l.code === locale) || locales[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-500 cursor-pointer ${
          scrolled
            ? "text-white/50 hover:text-white"
            : "text-white/50 hover:text-white"
        }`}
      >
        <span>{current.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-3 min-w-[140px] bg-white/95 backdrop-blur-2xl rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] border border-white/60 overflow-hidden"
          >
            {locales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => switchLocale(loc.code)}
                className={`w-full text-left px-4 py-2.5 text-[12px] font-medium tracking-wide transition-colors duration-300 cursor-pointer flex items-center justify-between ${
                  locale === loc.code
                    ? "text-navy bg-navy/[0.04]"
                    : "text-navy/45 hover:text-navy hover:bg-navy/[0.03]"
                }`}
              >
                <span>{loc.label}</span>
                {locale === loc.code && (
                  <span className="w-1 h-1 rounded-full bg-navy/40" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
