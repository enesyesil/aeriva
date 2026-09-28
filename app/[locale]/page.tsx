import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import HomeExplore from "@/components/sections/HomeExplore";
import Trade from "@/components/sections/Trade";
import { createPageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return createPageMetadata({ locale, title: t("title"), description: t("description") });
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeExplore />
      <Trade />
    </>
  );
}
