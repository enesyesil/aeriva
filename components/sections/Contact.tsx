"use client";

import { useTranslations } from "next-intl";
import { CONTACT_EMAIL, getContactEmailHref } from "@/data/contact";
import { getProductById } from "@/data/products";
import { INQUIRY_TYPE_KEYS, type InquiryType } from "@/types";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

interface ContactProps {
  inquiryType?: InquiryType;
  productId?: string;
}

export default function Contact({
  inquiryType = "general",
  productId = "",
}: ContactProps) {
  const t = useTranslations();
  const product = getProductById(productId);
  const productName = product ? t(`products.items.${product.id}.name`) : undefined;
  const subject = productName
    ? t("contact.productSubject", { product: productName })
    : t("contact.subject", { inquiry: t(`contact.inquiryTypes.${inquiryType}`) });
  const emailHref = getContactEmailHref(subject);

  return (
    <section id="contact" className="section-shell scroll-mt-24 bg-canvas">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <header className="grid gap-8 border-b border-ink/10 pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="eyebrow">{t("contact.eyebrow")}</p>
              <h1 className="mt-5 max-w-[12ch] font-serif text-[clamp(3.5rem,7vw,6.8rem)] leading-[0.92] tracking-[-0.05em] text-ink">
                {t("contact.title")}
              </h1>
            </div>
            <p className="max-w-2xl text-base leading-8 text-ink/62 sm:text-lg lg:justify-self-end">
              {t("contact.subtitle")}
            </p>
          </header>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="mt-8 grid overflow-hidden rounded-[1.5rem] border border-ink/10 shadow-[0_28px_80px_rgba(32,40,42,0.09)] sm:mt-12 sm:rounded-[2rem] lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
            <div className="relative flex min-w-0 flex-col justify-center overflow-hidden bg-ink p-6 text-white sm:p-10 lg:p-12">
              <div className="contact-glow" aria-hidden="true" />
              <div className="relative py-3 sm:py-8 lg:py-12">
                <h2 className="eyebrow !text-white/45">{t("contact.emailLabel")}</h2>
                <a
                  href={emailHref}
                  className="mt-5 inline-block max-w-full break-all font-serif text-[clamp(1.55rem,3.4vw,3rem)] leading-tight tracking-[-0.03em] text-white underline decoration-white/25 underline-offset-8 transition hover:decoration-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-ink"
                >
                  {CONTACT_EMAIL}
                </a>
                <p className="mt-7 max-w-lg text-base leading-8 text-white/62">
                  {t("contact.emailIntro")}
                </p>
                {productName && (
                  <p className="mt-6 text-sm text-peach">
                    {t("contact.productContext", { product: productName })}
                  </p>
                )}
                <a href={emailHref} className="button-light mt-8">
                  {t("contact.emailAction")}
                  <span className="ml-2 shrink-0" aria-hidden="true">↗</span>
                </a>
                <p className="mt-5 max-w-sm text-xs leading-6 text-white/45">
                  {t("contact.emailHint")}
                </p>
              </div>
            </div>

            <aside className="min-w-0 bg-cream lg:order-first p-6 sm:p-10 lg:p-12">
              <p className="eyebrow">{t("contact.guideEyebrow")}</p>
              <h2 className="mt-5 max-w-sm font-serif text-3xl leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                {t("contact.guideTitle")}
              </h2>
              <ul className="mt-9 divide-y divide-ink/10 border-y border-ink/10">
                {INQUIRY_TYPE_KEYS.map((type) => (
                  <li key={type} className="py-5">
                    <h3 className="font-serif text-xl text-ink">
                      <a
                        href={getContactEmailHref(t("contact.subject", { inquiry: t(`contact.inquiryTypes.${type}`) }))}
                        className="inline-flex min-h-11 items-center underline decoration-ink/20 underline-offset-4 transition hover:decoration-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-4"
                      >
                        {t(`contact.inquiryTypes.${type}`)}
                      </a>
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-ink/55">
                      {t(`contact.inquiryHints.${type}`)}
                    </p>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
