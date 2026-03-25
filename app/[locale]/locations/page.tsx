"use client";

import { useTranslations } from "next-intl";
import NavyCard from "@/components/ui/NavyCard";
import type { StoreLocation } from "@/types";

const stores: StoreLocation[] = [
  { key: "brussels", lat: 50.8503, lng: 4.3517 },
  { key: "antwerp", lat: 51.2194, lng: 4.4025 },
  { key: "ghent", lat: 51.0543, lng: 3.7174 },
  { key: "amsterdam", lat: 52.3676, lng: 4.9041 },
];

export default function LocationsPage() {
  const t = useTranslations("locations");

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-navy">
            {t("title")}
          </h1>
          <p className="mt-4 text-base text-navy/60 max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Store cards with maps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map(({ key, lat, lng }) => {
            const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.008}%2C${lat - 0.005}%2C${lng + 0.008}%2C${lat + 0.005}&layer=mapnik&marker=${lat}%2C${lng}`;

            return (
              <NavyCard key={key} className="flex flex-col overflow-hidden">
                {/* Map */}
                <div className="aspect-[16/9] bg-slate-100 relative">
                  <iframe
                    src={mapSrc}
                    className="w-full h-full border-0"
                    loading="lazy"
                    title={t(`stores.${key}.name`)}
                  />
                </div>

                {/* Store info */}
                <div className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-xl text-white">
                      {t(`stores.${key}.name`)}
                    </h3>
                    <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-white/40 border border-white/15 rounded-full px-2.5 py-0.5">
                      {t(`stores.${key}.type`)}
                    </span>
                  </div>
                  <p className="text-sm text-white/55 flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                    </svg>
                    {t(`stores.${key}.address`)}
                  </p>
                  <p className="text-sm text-white/55 flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 shrink-0 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t(`stores.${key}.hours`)}
                  </p>
                </div>
              </NavyCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
