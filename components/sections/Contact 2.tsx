"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { products } from "@/data/products";
import { INQUIRY_TYPE_KEYS, type InquiryType } from "@/types";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const t = useTranslations();
  const locale = useLocale();
  const [status, setStatus] = useState<Status>("idle");
  const [inquiryType, setInquiryType] = useState<InquiryType>("general");
  const [productId, setProductId] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedProduct = params.get("product") || "";
    const requestedType = params.get("inquiry");

    if (products.some((product) => product.id === requestedProduct)) {
      setProductId(requestedProduct);
      setInquiryType("product");
    } else if (
      requestedType &&
      INQUIRY_TYPE_KEYS.includes(requestedType as InquiryType)
    ) {
      setInquiryType(requestedType as InquiryType);
    }
  }, []);

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

  return (
    <section id="contact" className="section-shell scroll-mt-24 bg-canvas">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="grid overflow-hidden rounded-[2rem] bg-ink text-white lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative overflow-hidden border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
              <div className="contact-glow" aria-hidden="true" />
              <div className="relative">
                <p className="eyebrow !text-white/50">{t("contact.eyebrow")}</p>
                <h2 className="mt-5 max-w-md font-serif text-4xl leading-tight tracking-[-0.035em] sm:text-5xl">
                  {t("contact.title")}
                </h2>
                <p className="mt-6 max-w-sm text-base leading-7 text-white/58">
                  {t("contact.subtitle")}
                </p>
              </div>
            </div>

            <div className="p-7 sm:p-10 lg:p-14">
              {status === "success" ? (
                <div className="flex min-h-[420px] flex-col items-start justify-center" role="status">
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
                    {t("contact.send")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5" noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="text-xs font-medium tracking-wide text-white/65">
                      {t("contact.name")}
                      <input
                        name="name"
                        type="text"
                        required
                        maxLength={100}
                        autoComplete="name"
                        className={fieldClass}
                      />
                    </label>
                    <label className="text-xs font-medium tracking-wide text-white/65">
                      {t("contact.email")}
                      <input
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
                    <label className="text-xs font-medium tracking-wide text-white/65">
                      {t("contact.inquiryType")}
                      <select
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
                    <label className="text-xs font-medium tracking-wide text-white/65">
                      {t("contact.product")}
                      <select
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
                            {product.code ? `${product.code} · ` : ""}
                            {t(`products.items.${product.id}.name`)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="text-xs font-medium tracking-wide text-white/65">
                    {t("contact.message")}
                    <textarea
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
                    <p className="rounded-xl bg-red-300/10 px-4 py-3 text-sm text-red-100" role="alert">
                      {t("contact.error")}
                    </p>
                  )}

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xs text-xs leading-5 text-white/35">
                      {t("contact.privacy")}
                    </p>
                    <button
                      type="submit"
                      disabled={status === "sending"}
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
