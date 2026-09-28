import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Contact from "@/components/sections/Contact";
import { products } from "@/data/products";
import { routing } from "@/i18n/routing";
import { INQUIRY_TYPE_KEYS, type InquiryType } from "@/types";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    product?: string | string[];
    inquiry?: string | string[];
  }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/contact`,
      languages: Object.fromEntries(
        routing.locales.map((language) => [language, `/${language}/contact`]),
      ),
    },
  };
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const query = await searchParams;
  const requestedProduct =
    typeof query.product === "string" &&
    products.some((product) => product.id === query.product)
      ? query.product
      : "";
  const requestedInquiry =
    typeof query.inquiry === "string" &&
    INQUIRY_TYPE_KEYS.includes(query.inquiry as InquiryType)
      ? (query.inquiry as InquiryType)
      : "general";
  const inquiryType = requestedProduct ? "product" : requestedInquiry;

  return (
    <div className="bg-canvas pt-20 sm:pt-24">
      <Contact
        inquiryType={inquiryType}
        productId={requestedProduct}
      />
    </div>
  );
}
