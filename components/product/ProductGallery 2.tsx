"use client";

import { useState } from "react";
import Image from "next/image";
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

  return (
    <div>
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-[2rem]"
        style={{ backgroundColor: `${accent}18` }}
      >
        <Image
          key={images[activeImage]}
          src={images[activeImage]}
          alt={`${productName} — ${t("imageLabel", {
            number: activeImage + 1,
            total: images.length,
          })}`}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-3" aria-label={`${productName} gallery`}>
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={t("imageLabel", { number: index + 1, total: images.length })}
              aria-pressed={activeImage === index}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl border-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay ${
                activeImage === index ? "border-ink" : "border-transparent opacity-65 hover:opacity-100"
              }`}
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
