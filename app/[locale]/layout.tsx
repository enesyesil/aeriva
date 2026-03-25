import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Playfair_Display, Barlow } from "next/font/google";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "@/app/globals.css";

const metaByLocale: Record<string, { title: string; description: string }> = {
  en: {
    title: "Aériva — European Luxury Fragrances",
    description:
      "Discover Aériva, a premium European perfume house crafting fragrances with poetic restraint and intentional elegance. Born in Belgium.",
  },
  fr: {
    title: "Aériva — Parfums de luxe européens",
    description:
      "Découvrez Aériva, une maison de parfum européenne d'exception. Des créations empreintes de retenue poétique et d'élégance intentionnelle. Née en Belgique.",
  },
  nl: {
    title: "Aériva — Europese luxe geuren",
    description:
      "Ontdek Aériva, een premium Europees parfumhuis dat geuren creëert met poëtische ingetogenheid en doordachte elegantie. Geboren in België.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = metaByLocale[locale] || metaByLocale.en;
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "website",
      siteName: "Aériva",
    },
  };
}

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className={`${playfair.variable} ${barlow.variable}`}>
      <body className="font-sans text-navy bg-ivory-light antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
