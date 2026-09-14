"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");
  const reduceMotion = useReducedMotion();
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay: reduceMotion ? 0 : delay, ease: "easeOut" as const },
  });

  return (
    <section className="relative min-h-[760px] overflow-hidden bg-canvas px-5 pb-16 pt-32 sm:px-8 lg:min-h-screen lg:pb-20 lg:pt-36">
      <div className="hero-orb hero-orb--one" aria-hidden="true" />
      <div className="hero-orb hero-orb--two" aria-hidden="true" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16">
        <div className="max-w-2xl lg:pb-10">
          <motion.p {...enter(0.05)} className="eyebrow">
            {t("eyebrow")}
          </motion.p>
          <motion.h1
            {...enter(0.16)}
            className="mt-6 font-serif text-[clamp(3.1rem,7vw,6.8rem)] leading-[0.9] tracking-[-0.055em] text-ink"
          >
            {t("titleLead")}
            <span className="mt-2 block italic text-clay">{t("titleAccent")}</span>
          </motion.h1>
          <motion.p
            {...enter(0.27)}
            className="mt-8 max-w-xl text-base leading-7 text-ink/65 sm:text-lg sm:leading-8"
          >
            {t("body")}
          </motion.p>
          <motion.div {...enter(0.38)} className="mt-9 flex flex-wrap gap-3">
            <a href="#products" className="button-primary">
              {t("primaryCta")}
            </a>
            <a href="#about" className="button-secondary">
              {t("secondaryCta")}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
          className="relative mx-auto h-[510px] w-full max-w-[680px] sm:h-[650px] lg:h-[720px]"
        >
          <div className="absolute left-0 top-0 h-[78%] w-[59%] overflow-hidden rounded-[2rem] bg-sage shadow-[0_30px_90px_rgba(28,34,39,0.14)]">
            <Image
              src="/images/products/estila/w301-woody.jpeg"
              alt={t("perfumeAlt")}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 55vw, 34vw"
            />
          </div>
          <div className="absolute bottom-0 right-0 h-[65%] w-[56%] overflow-hidden rounded-[2rem] border-[10px] border-canvas bg-peach shadow-[0_30px_90px_rgba(28,34,39,0.18)] sm:border-[14px]">
            <Image
              src="/images/products/mavigol/collection.jpeg"
              alt={t("homeAlt")}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 50vw, 32vw"
            />
          </div>
          <div className="absolute right-[7%] top-[8%] rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-[0.6rem] font-semibold tracking-[0.22em] uppercase text-ink/70 backdrop-blur-md">
            Estila · Mavigöl
          </div>
        </motion.div>
      </div>
    </section>
  );
}
