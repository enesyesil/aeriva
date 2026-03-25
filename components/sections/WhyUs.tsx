"use client";

import { useTranslations } from "next-intl";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import NavyCard from "@/components/ui/NavyCard";
import Button3D from "@/components/ui/Button3D";

const options = ["retail", "wholesale", "bespoke"] as const;

export default function WhyUs() {
  const t = useTranslations("sales");

  return (
    <section id="why-us" className="py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy">
              {t("title")}
            </h2>
            <p className="mt-4 text-base text-navy/50 max-w-lg mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((option, i) => (
            <RevealOnScroll key={option} delay={i * 0.12}>
              <NavyCard className="p-8 flex flex-col h-full">
                {/* Badge */}
                <span className="inline-block self-start text-[10px] font-medium tracking-[0.25em] uppercase text-white/40 border border-white/15 rounded-full px-3 py-1 mb-5">
                  {t(`options.${option}.badge`)}
                </span>

                <h3 className="font-serif text-2xl text-white mb-3">
                  {t(`options.${option}.title`)}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed mb-6 flex-1">
                  {t(`options.${option}.description`)}
                </p>

                {/* Highlights */}
                <ul className="space-y-2 mb-8">
                  {[0, 1, 2].map((j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/55">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-white/25 shrink-0" />
                      {t(`options.${option}.highlights.${j}`)}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button3D
                  variant="white"
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-auto"
                >
                  {t(`options.${option}.cta`)}
                </Button3D>
              </NavyCard>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
