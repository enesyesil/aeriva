"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function About() {
  const t = useTranslations("about");

  return (
    <section id="about" className="py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <RevealOnScroll>
          <div className="aspect-[4/5] rounded-2xl overflow-hidden relative">
            <Image
              src="/images/philosophy.png"
              alt="Our Philosophy — artisanal perfumery atelier"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </RevealOnScroll>

        {/* Text */}
        <RevealOnScroll delay={0.15}>
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy leading-tight">
              {t("title")}
            </h2>
            <p className="text-base text-navy/70 leading-relaxed">
              {t("paragraph1")}
            </p>
            <p className="text-base text-navy/70 leading-relaxed">
              {t("paragraph2")}
            </p>
            <p className="font-serif text-lg text-navy/50 italic mt-2">
              {t("tagline")}
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
