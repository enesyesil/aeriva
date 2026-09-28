import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import ProductCard from "@/components/ui/ProductCard";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import { getProductBySlug, getProductsByLine, products } from "@/data/products";
import { routing } from "@/i18n/routing";

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    products.map((product) => ({ locale, slug: product.slug })),
  );
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  const t = await getTranslations({ locale, namespace: "products" });
  const name = t(`items.${product.id}.name`);
  const description = t(`items.${product.id}.shortDescription`);
  const path = `/${locale}/products/${product.slug}`;

  return {
    title: `${name} | Dauvena Cosmetics`,
    description,
    alternates: {
      canonical: path,
      languages: Object.fromEntries(
        routing.locales.map((language) => [
          language,
          `/${language}/products/${product.slug}`,
        ]),
      ),
    },
    openGraph: {
      title: `${name} | Dauvena Cosmetics`,
      description,
      type: "website",
      siteName: "Dauvena Cosmetics",
      images: [{ url: product.images[0], alt: name }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const t = await getTranslations({ locale });
  const name = t(`products.items.${product.id}.name`);
  const story = t.raw(`products.items.${product.id}.story`) as string[];
  const isPerfume = product.kind === "eau-de-parfum";
  const relatedProducts = getProductsByLine(product.line)
    .filter((item) => item.id !== product.id)
    .slice(0, 3);

  return (
    <div
      className="product-detail bg-canvas pb-24 pt-32 sm:pt-36"
      style={{ "--product-accent": product.accent } as CSSProperties}
    >
      <article className="mx-auto max-w-7xl px-5 sm:px-8">
        <Link
          href={`/${locale}/products`}
          className="inline-flex min-h-11 items-center gap-2 text-[0.67rem] font-semibold tracking-[0.18em] uppercase text-ink/55 transition hover:text-ink"
        >
          <span className="shrink-0" aria-hidden="true">←</span>
          {t("productPage.back")}
        </Link>

        <div className="product-atmosphere relative mt-9 overflow-hidden rounded-[2.2rem] p-3 sm:p-5 lg:p-7">
          <span className="product-atmosphere__orb product-atmosphere__orb--one" aria-hidden="true" />
          <span className="product-atmosphere__orb product-atmosphere__orb--two" aria-hidden="true" />

          <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <ProductGallery images={product.images} productName={name} accent={product.accent} />

            <div className="product-identity relative flex min-w-0 flex-col overflow-hidden rounded-[1.7rem] bg-ink p-5 text-white sm:min-h-[36rem] sm:p-8 xl:p-12">
              <span className="product-identity__code" aria-hidden="true">
                {product.code ?? String(product.sizeMl)}
              </span>

              <div className="relative flex flex-wrap items-center gap-3">
                <span className="text-[0.65rem] font-semibold tracking-[0.24em] uppercase text-white/52">
                  {isPerfume ? "Estila Exclusive" : "Mavigöl"}
                </span>
              </div>

              <div className="relative my-auto py-8 sm:py-10">
                <div className="mb-7 h-px w-16 bg-[var(--product-accent)]" />
                <h1 className="max-w-[9ch] break-words font-serif text-[clamp(3rem,6.2vw,6.8rem)] leading-[0.9] tracking-[-0.06em] text-white sm:text-[clamp(3.6rem,6.2vw,6.8rem)]">
                  {name}
                </h1>
                <p className="mt-7 max-w-md font-serif text-2xl italic leading-snug text-white/72 sm:text-3xl">
                  {t(`products.items.${product.id}.headline`)}
                </p>
                <p className="mt-7 max-w-lg text-sm leading-7 text-white/58 sm:text-base sm:leading-8">
                  {t(`products.items.${product.id}.shortDescription`)}
                </p>
              </div>

              <div className="relative">
                <dl className="grid grid-cols-2 gap-x-3 border-t border-white/12 pt-6 sm:gap-x-5">
                  <div className="min-w-0 break-words">
                    <dt className="text-[0.58rem] font-semibold tracking-[0.18em] uppercase text-white/38">
                      {t("productPage.audience")}
                    </dt>
                    <dd className="mt-2 text-sm text-white/82">
                      {t(`productPage.audiences.${product.audience}`)}
                    </dd>
                  </div>
                  <div className="min-w-0 break-words">
                    <dt className="text-[0.58rem] font-semibold tracking-[0.18em] uppercase text-white/38">
                      {isPerfume ? t("catalogue.perfumeLabel") : t("catalogue.diffuserLabel")}
                    </dt>
                    <dd className="mt-2 text-sm text-white/82">
                      {product.sizeMl ? `${product.sizeMl} ml` : "Estila Exclusive"}
                    </dd>
                  </div>
                </dl>

                <a
                  href={`/${locale}/contact?product=${product.id}`}
                  className="button-light mt-8 w-full gap-2 text-center sm:w-fit"
                >
                  <span className="min-w-0 leading-relaxed">{t("productPage.inquire")}</span>
                  <span className="shrink-0" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div id="story" className={`mt-16 grid gap-8 border-t border-ink/10 pt-10 sm:mt-24 sm:gap-12 sm:pt-16 ${isPerfume ? "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20" : "max-w-4xl"}`}>
          <RevealOnScroll>
            <div className={isPerfume ? "lg:sticky lg:top-32" : ""}>
              <p className="eyebrow">{t("productPage.storyTitle")}</p>
              <p className="mt-6 max-w-md font-serif text-[clamp(2.4rem,4vw,4rem)] leading-[0.98] tracking-[-0.04em] text-ink">
                {t(`products.items.${product.id}.headline`)}
              </p>
              <div className="mt-7 h-px w-20 bg-[var(--product-accent)]" />
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.08}>
            <div className="story-copy story-copy--editorial space-y-6 break-words">
              {story.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </RevealOnScroll>

          {isPerfume && (
            <RevealOnScroll className="lg:col-start-2" delay={0.12}>
              <aside className="scent-map overflow-hidden rounded-[2rem] bg-cream p-5 sm:p-8 xl:p-10">
                <div className="flex items-end justify-between gap-4 border-b border-ink/10 pb-7 sm:gap-6">
                  <h2 className="font-serif text-3xl tracking-[-0.03em] text-ink sm:text-4xl">
                    {t("productPage.detailsTitle")}
                  </h2>
                  <span className="mb-1 h-3 w-3 shrink-0 rounded-full bg-[var(--product-accent)] shadow-[0_0_0_7px_color-mix(in_srgb,var(--product-accent)_16%,transparent)]" />
                </div>
                <dl>
                  {[
                    ["family", "family"],
                    ["topNotes", "topNotes"],
                    ["heartNotes", "heartNotes"],
                    ["baseNotes", "baseNotes"],
                  ].map(([label, key], index) => (
                    <div key={key} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-3 border-b border-ink/10 py-6 last:border-0 last:pb-0 sm:grid-cols-[2.2rem_minmax(0,1fr)] sm:gap-4">
                      <span className="pt-0.5 text-[0.62rem] tabular-nums text-ink/32">0{index + 1}</span>
                      <div className="min-w-0 break-words">
                        <dt className="text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-ink/42">
                          {t(`productPage.${label}`)}
                        </dt>
                        <dd className="mt-2 font-serif text-xl leading-snug text-ink/78 sm:text-2xl">
                          {t(`products.items.${product.id}.${key}`)}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </aside>
            </RevealOnScroll>
          )}
        </div>
      </article>

      <section className="mx-auto mt-16 max-w-[90rem] px-5 sm:mt-24 sm:px-8">
        <div className="rounded-[2.2rem] bg-cream px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <h2 className="font-serif text-4xl tracking-[-0.035em] text-ink sm:text-5xl">
              {t("productPage.related")}
            </h2>
            <Link href={`/${locale}/products`} className="inline-flex min-h-11 items-center gap-2 text-[0.64rem] font-semibold tracking-[0.17em] uppercase text-ink/55 transition hover:text-ink">
              {t("productPage.back")} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="mt-9 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
