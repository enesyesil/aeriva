import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "@/app/globals.css";

const metaByLocale: Record<string, { title: string; description: string }> = {
  en: {
    title: "Dauvéna — European Luxury Fragrances",
    description:
      "Discover Dauvéna, a premium European perfume house crafting fragrances with poetic restraint and intentional elegance. Born in Belgium.",
  },
  fr: {
    title: "Dauvéna — Parfums de luxe européens",
    description:
      "Découvrez Dauvéna, une maison de parfum européenne d'exception. Des créations empreintes de retenue poétique et d'élégance intentionnelle. Née en Belgique.",
  },
  nl: {
    title: "Dauvéna — Europese luxe geuren",
    description:
      "Ontdek Dauvéna, een premium Europees parfumhuis dat geuren creëert met poëtische ingetogenheid en doordachte elegantie. Geboren in België.",
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
      siteName: "Dauvéna",
    },
  };
}

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
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Playfair+Display&display=swap"
          rel="stylesheet"
        />
      </head>
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
