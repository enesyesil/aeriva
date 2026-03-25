"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-20">
        {/* Overline accent */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
          className="flex items-center gap-4 mb-6"
        >
          <span className="block w-8 h-[1px] bg-navy/15" />
          <span
            className="text-[10px] sm:text-[11px] font-sans font-medium tracking-[0.4em] uppercase text-navy/40"
          >
            {t("overline")}
          </span>
          <span className="block w-8 h-[1px] bg-navy/15" />
        </motion.div>

        {/* Headline */}
        <div className="py-1">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] text-navy leading-[1.2] max-w-4xl"
          >
            {t("headlineTop")}
          </motion.h1>
        </div>
        <div className="py-1">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-[2rem] sm:text-4xl md:text-5xl lg:text-[3.5rem] text-navy leading-[1.2] max-w-4xl italic"
          >
            {t("headlineBottom")}
          </motion.h1>
        </div>

        {/* Thin rule */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="w-12 h-[1px] bg-navy/15 my-5"
        />

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
          className="text-[14px] sm:text-base md:text-lg text-navy/55 font-sans tracking-wide max-w-lg leading-relaxed"
        >
          {t("subheadline")}
        </motion.p>

        {/* CTA — 3D Button */}
        <motion.a
          href="#fragrances"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("fragrances")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2, ease: "easeOut" }}
          className="mt-10 group relative px-10 py-4 text-[11px] sm:text-[12px] font-medium tracking-[0.25em] uppercase cursor-pointer select-none"
          style={{
            color: "#ffffff",
            background:
              "linear-gradient(180deg, #1b2a4a 0%, #0f1a30 100%)",
            borderRadius: "9999px",
            border: "1px solid rgba(27,42,74,0.9)",
            boxShadow:
              "0 6px 0 0 #060d1a, 0 10px 30px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.12)",
            transform: "translateY(-2px)",
            transition: "all 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(0px)";
            el.style.boxShadow =
              "0 3px 0 0 #060d1a, 0 5px 18px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)";
            el.style.background =
              "linear-gradient(180deg, #243558 0%, #14203d 100%)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(-2px)";
            el.style.boxShadow =
              "0 6px 0 0 #060d1a, 0 10px 30px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.12)";
            el.style.background =
              "linear-gradient(180deg, #1b2a4a 0%, #0f1a30 100%)";
          }}
          onMouseDown={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(2px)";
            el.style.boxShadow =
              "0 0px 0 0 #060d1a, 0 1px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)";
          }}
          onMouseUp={(e) => {
            const el = e.currentTarget;
            el.style.transform = "translateY(0px)";
            el.style.boxShadow =
              "0 3px 0 0 #060d1a, 0 5px 18px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)";
          }}
        >
          <span className="relative z-10">{t("cta")}</span>
        </motion.a>
      </div>

      {/* Scroll indicator — a gentle breathing line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[9px] font-sans font-medium tracking-[0.35em] uppercase text-navy/20">
          Scroll
        </span>
        <motion.div
          animate={{ scaleY: [1, 1.6, 1] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="w-[1px] h-6 bg-navy/15 origin-top"
        />
      </motion.div>
    </section>
  );
}
