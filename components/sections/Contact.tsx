"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import NavyCard from "@/components/ui/NavyCard";
import Button3D from "@/components/ui/Button3D";
import { SALES_OPTION_KEYS } from "@/types";

export default function Contact() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [selectedOption, setSelectedOption] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      salesOption: selectedOption,
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
        setSelectedOption("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-white/25 outline-none focus:border-white/30 focus:bg-white/[0.08] transition-all duration-300";

  return (
    <section id="contact" className="py-24 md:py-32 px-6 md:px-8">
      <div className="max-w-2xl mx-auto">
        <RevealOnScroll delay={0.1}>
          <NavyCard className="p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl md:text-3xl text-white">
                {t("title")}
              </h2>
              <p className="mt-2 text-sm text-white/40">{t("subtitle")}</p>
            </div>

            {status === "success" ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
                  <svg className="w-8 h-8 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <p className="text-white/80 font-serif text-lg">
                  {t("success")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                      </svg>
                    </div>
                    <input
                      name="name"
                      type="text"
                      required
                      maxLength={100}
                      placeholder={t("name")}
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      placeholder={t("email")}
                      className={`${inputBase} pl-10`}
                    />
                  </div>
                </div>

                {/* Custom Inquiry Type Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <input type="hidden" name="salesOption" value={selectedOption} required />
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`${inputBase} pl-10 text-left cursor-pointer flex items-center justify-between`}
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                    </div>
                    <span className={selectedOption ? "text-white" : "text-white/25"}>
                      {selectedOption
                        ? t(`salesOptions.${selectedOption}`)
                        : t("salesOption")}
                    </span>
                    <svg
                      className={`w-4 h-4 text-white/30 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute z-20 mt-2 w-full rounded-xl overflow-hidden"
                      style={{
                        background: "linear-gradient(180deg, #243558 0%, #1a2a45 100%)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        boxShadow: "0 12px 36px rgba(0,0,0,0.40)",
                      }}
                    >
                      {SALES_OPTION_KEYS.map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedOption(key);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 cursor-pointer flex items-center gap-3 ${
                            selectedOption === key
                              ? "bg-white/10 text-white"
                              : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                          }`}
                        >
                          {selectedOption === key && (
                            <svg className="w-3.5 h-3.5 text-white/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                          <span className={selectedOption === key ? "" : "pl-[22px]"}>
                            {t(`salesOptions.${key}`)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message */}
                <div className="relative">
                  <div className="absolute left-4 top-4 text-white/20 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  </div>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    maxLength={2000}
                    placeholder={t("message")}
                    className={`${inputBase} pl-10 resize-none`}
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-400/80 text-sm bg-red-400/10 rounded-lg px-4 py-2.5">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {t("error")}
                  </div>
                )}

                <div className="text-center mt-2">
                  <Button3D
                    variant="white"
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full sm:w-auto px-10 py-3.5"
                  >
                    {status === "sending" ? "..." : t("send")}
                  </Button3D>
                </div>
              </form>
            )}
          </NavyCard>
        </RevealOnScroll>
      </div>
    </section>
  );
}
