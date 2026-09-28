"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  accent: string;
}

export default function ProductGallery({
  images,
  productName,
  accent,
}: ProductGalleryProps) {
  const t = useTranslations("productPage");
  const [activeImage, setActiveImage] = useState(0);
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="product-gallery mx-auto w-full min-w-0 max-w-xl lg:max-w-none"
      style={{ "--product-accent": accent } as CSSProperties}
    >
      <div
        className="product-gallery__frame relative aspect-[4/5] overflow-hidden rounded-[1.7rem] sm:rounded-[2rem]"
        style={{ backgroundColor: `${accent}20` }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={images[activeImage]}
            initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeImage]}
              alt={`${productName} — ${t("imageLabel", {
                number: activeImage + 1,
                total: images.length,
              })}`}
              fill
              priority
              loading="eager"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </motion.div>
        </AnimatePresence>

        <span className="absolute bottom-5 right-5 z-10 rounded-full border border-white/25 bg-black/25 px-3 py-1.5 text-[0.58rem] font-semibold tracking-[0.18em] text-white backdrop-blur-md">
          {String(activeImage + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3" role="group" aria-label={productName}>
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={t("imageLabel", { number: index + 1, total: images.length })}
              aria-pressed={activeImage === index}
              className={`relative aspect-[4/3] min-h-11 touch-manipulation overflow-hidden rounded-xl border-2 transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 ${
                activeImage === index ? "opacity-100" : "border-transparent opacity-55 hover:opacity-100"
              }`}
              style={activeImage === index ? { borderColor: accent } : undefined}
            >
              <Image
                src={image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 30vw, 16vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
