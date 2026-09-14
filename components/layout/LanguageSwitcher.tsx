"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

interface LanguageSwitcherProps {
  className?: string;
  theme?: "dark" | "light";
}

export default function LanguageSwitcher({
  className = "",
  theme = "dark",
}: LanguageSwitcherProps) {
  const locale = useLocale();
  const pathname = usePathname();

  const localizedPath = (nextLocale: string) => {
    const suffix = pathname.replace(/^\/(en|fr|nl)(?=\/|$)/, "");
    return `/${nextLocale}${suffix || ""}`;
  };

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label="Language selection">
      {routing.locales.map((language) => (
        <Link
          key={language}
          href={localizedPath(language)}
          hrefLang={language}
          aria-current={language === locale ? "page" : undefined}
          className={`rounded-full px-2.5 py-2 text-[0.62rem] font-semibold tracking-[0.12em] uppercase transition focus-visible:outline-none focus-visible:ring-2 ${
            theme === "dark"
              ? language === locale
                ? "bg-white text-ink focus-visible:ring-white/55"
                : "text-white/50 hover:text-white focus-visible:ring-white/55"
              : language === locale
                ? "bg-ink text-white focus-visible:ring-ink/35"
                : "text-ink/45 hover:bg-cream hover:text-ink focus-visible:ring-ink/35"
          }`}
        >
          {language}
        </Link>
      ))}
    </div>
  );
}
