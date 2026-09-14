"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { products } from "@/data/products";
import { INQUIRY_TYPE_KEYS, type InquiryType } from "@/types";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type Status = "idle" | "sending" | "success" | "error";

interface ContactProps {
  initialInquiryType?: InquiryType;
  initialProductId?: string;
}

export default function Contact({
  initialInquiryType = "general",
  initialProductId = "",
}: ContactProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [inquiryType, setInquiryType] =
    useState<InquiryType>(initialInquiryType);
  const [productId, setProductId] = useState(initialProductId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      inquiryType,
      productId: productId || undefined,
      locale,
      message: formData.get("message"),
      website: formData.get("website"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Unable to send inquiry");

      form.reset();
      setInquiryType("general");
      setProductId("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-2xl border border-white/12 bg-white/[0.055] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/28 hover:border-white/20 focus:border-white/45 focus:ring-2 focus:ring-white/10";
  const requiredMark = (
    <span className="ml-1 text-peach" aria-hidden="true">
      *
    </span>
  );

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
            <div className="max-w-2xl lg:justify-self-end">
              <p className="text-base leading-8 text-ink/62 sm:text-lg">
                {t("contact.subtitle")}
              </p>
              <p className="mt-4 text-xs tracking-wide text-ink/42">
                {t("contact.requiredHint")}
              </p>
            </div>
          </header>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="mt-12 grid overflow-hidden rounded-[2rem] border border-ink/10 shadow-[0_28px_80px_rgba(32,40,42,0.09)] lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="bg-cream p-7 sm:p-10 lg:p-12">
              <p className="eyebrow">{t("contact.guideEyebrow")}</p>
              <h2 className="mt-5 max-w-sm font-serif text-3xl leading-tight tracking-[-0.03em] text-ink sm:text-4xl">
                {t("contact.guideTitle")}
              </h2>
              <ol className="mt-9 divide-y divide-ink/10 border-y border-ink/10">
                {(["general", "product", "wholesale"] as const).map((type, index) => (
                  <li key={type} className="grid grid-cols-[2.2rem_1fr] gap-3 py-5">
                    <span className="pt-1 text-[0.62rem] text-ink/32">0{index + 1}</span>
                    <div>
                      <h3 className="font-serif text-xl text-ink">
                        {t(`contact.inquiryTypes.${type}`)}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-ink/55">
                        {t(`contact.inquiryHints.${type}`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </aside>

            <div className="relative overflow-hidden bg-ink p-7 text-white sm:p-10 lg:p-12">
              <div className="contact-glow" aria-hidden="true" />
              {status === "success" ? (
                <div className="relative flex min-h-[480px] flex-col items-start justify-center" role="status" aria-live="polite">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink">
                    ✓
                  </span>
                  <p className="mt-7 max-w-lg font-serif text-3xl leading-snug">
                    {t("contact.success")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-8 text-xs font-semibold tracking-[0.18em] uppercase text-white/60 underline decoration-white/25 underline-offset-8 hover:text-white"
                  >
                    {t("contact.sendAnother")}
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="relative grid gap-5"
                  aria-describedby="contact-privacy"
                >
                  <div className="mb-2">
                    <p className="eyebrow !text-white/45">{t("contact.formEyebrow")}</p>
                    <h2 className="mt-4 font-serif text-3xl tracking-[-0.03em] sm:text-4xl">
                      {t("contact.formTitle")}
                    </h2>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label htmlFor="contact-name" className="text-xs font-medium tracking-wide text-white/65">
                      {t("contact.name")}{requiredMark}
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        required
                        maxLength={100}
                        autoComplete="name"
                        className={fieldClass}
                      />
                    </label>
                    <label htmlFor="contact-email" className="text-xs font-medium tracking-wide text-white/65">
                      {t("contact.email")}{requiredMark}
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        required
                        maxLength={254}
                        autoComplete="email"
                        className={fieldClass}
                      />
                    </label>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <label htmlFor="contact-inquiry-type" className="text-xs font-medium tracking-wide text-white/65">
                      {t("contact.inquiryType")}{requiredMark}
                      <select
                        id="contact-inquiry-type"
                        name="inquiryType"
                        required
                        value={inquiryType}
                        onChange={(event) =>
                          setInquiryType(event.target.value as InquiryType)
                        }
                        className={fieldClass}
                      >
                        {INQUIRY_TYPE_KEYS.map((key) => (
                          <option key={key} value={key} className="text-ink">
                            {t(`contact.inquiryTypes.${key}`)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label htmlFor="contact-product" className="text-xs font-medium tracking-wide text-white/65">
                      {t("contact.product")}
                      <select
                        id="contact-product"
                        name="productId"
                        value={productId}
                        onChange={(event) => {
                          setProductId(event.target.value);
                          if (event.target.value) setInquiryType("product");
                        }}
                        className={fieldClass}
                      >
                        <option value="" className="text-ink">
                          {t("contact.noProduct")}
                        </option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id} className="text-ink">
                            {t(`products.items.${product.id}.name`)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label htmlFor="contact-message" className="text-xs font-medium tracking-wide text-white/65">
                    {t("contact.message")}{requiredMark}
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      maxLength={2000}
                      className={`${fieldClass} resize-y`}
                    />
                  </label>

                  <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                    <label>
                      Website
                      <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </label>
                  </div>

                  {status === "error" && (
                    <p className="rounded-xl bg-red-300/10 px-4 py-3 text-sm text-red-100" role="alert" aria-live="assertive">
                      {t("contact.error")}
                    </p>
                  )}

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p id="contact-privacy" className="max-w-xs text-xs leading-5 text-white/35">
                      {t("contact.privacy")}
                    </p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      aria-busy={status === "sending"}
                      className="button-light disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {status === "sending" ? t("contact.sending") : t("contact.send")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
