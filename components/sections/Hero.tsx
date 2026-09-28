"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    void video
      .play()
      .then(() => setIsPlaying(!video.paused))
      .catch(() => {
        // Visitors can start the film with the visible playback control.
      });
  }, [reduceMotion]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) void video.play();
    else video.pause();
  };
  const enter = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay: reduceMotion ? 0 : delay, ease: "easeOut" as const },
  });

  return (
    <section className="hero-stage relative flex items-center justify-center overflow-hidden bg-ink px-5 pb-20 pt-28 text-white sm:px-8 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full scale-[1.01] object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/hero/dauvena-nature-poster.jpeg"
        aria-hidden="true"
        onCanPlay={(event) => setIsPlaying(!event.currentTarget.paused)}
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="/videos/dauvena-hero-nature.mp4" type="video/mp4" />
      </video>
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,26,27,0.28)_0%,rgba(18,26,27,0.5)_58%,rgba(13,19,20,0.76)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,16,0.42)_0%,rgba(10,15,16,0.06)_38%,rgba(10,15,16,0.5)_100%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <motion.p {...enter(0.05)} className="eyebrow !text-white/65">
          {t("eyebrow")}
        </motion.p>
        <motion.h1
          {...enter(0.16)}
          className="mt-5 max-w-[12ch] font-serif text-[clamp(3rem,8vw,7.8rem)] leading-[0.94] tracking-[-0.055em] text-white"
        >
          {t("titleLead")}
          <span className="mt-2 block italic text-peach">{t("titleAccent")}</span>
        </motion.h1>
        <motion.p
          {...enter(0.27)}
          className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8"
        >
          {t("body")}
        </motion.p>
        <motion.div
          {...enter(0.38)}
          className="mt-7 flex flex-wrap justify-center gap-3"
        >
          <a href={`/${locale}/products`} className="button-light">
            {t("primaryCta")}
          </a>
          <a
            href={`/${locale}/brands`}
            className="button-secondary !border-white/35 !text-white hover:!border-white"
          >
            {t("secondaryCta")}
          </a>
        </motion.div>
        <motion.div
          {...enter(0.5)}
          className="mt-8 flex max-w-full items-center gap-2 text-[0.58rem] font-semibold tracking-[0.18em] uppercase text-white/62 sm:gap-4 sm:tracking-[0.24em]"
        >
          <span className="h-px w-5 shrink-0 bg-white/35 sm:w-10" aria-hidden="true" />
          Estila Exclusive · Mavigöl
          <span className="h-px w-5 shrink-0 bg-white/35 sm:w-10" aria-hidden="true" />
        </motion.div>
      </div>

      <button
        type="button"
        onClick={toggleVideo}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? t("pauseVideo") : t("playVideo")}
        className="absolute bottom-5 right-5 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-ink/40 text-white backdrop-blur-md transition hover:bg-white hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:bottom-7 sm:right-7"
      >
        <span aria-hidden="true" className="text-sm">
          {isPlaying ? "Ⅱ" : "▶"}
        </span>
      </button>
    </section>
  );
}
