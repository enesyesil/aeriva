import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/product/ProductGallery";
import ProductCard from "@/components/ui/ProductCard";
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
    <div className="bg-canvas pb-24 pt-32 sm:pt-36">
      <article className="mx-auto max-w-7xl px-5 sm:px-8">
        <Link
          href={`/${locale}#products`}
          className="inline-flex items-center gap-2 text-[0.67rem] font-semibold tracking-[0.18em] uppercase text-ink/55 transition hover:text-ink"
        >
          <span aria-hidden="true">←</span>
          {t("productPage.back")}
        </Link>

        <div className="mt-9 grid gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-20">
          <ProductGallery images={product.images} productName={name} accent={product.accent} />

          <div className="lg:pt-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">
                {isPerfume ? "Estila Exclusive" : "Mavigöl"}
              </span>
              {product.code && (
                <span className="rounded-full border border-ink/15 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-ink/55">
                  {product.code}
                </span>
              )}
            </div>

            <h1 className="mt-6 font-serif text-[clamp(3.2rem,6vw,6rem)] leading-[0.93] tracking-[-0.055em] text-ink">
              {name}
            </h1>
            <p className="mt-5 font-serif text-2xl italic leading-snug text-clay sm:text-3xl">
              {t(`products.items.${product.id}.headline`)}
            </p>
            <p className="mt-7 max-w-xl text-base leading-8 text-ink/62">
              {t(`products.items.${product.id}.shortDescription`)}
            </p>

            <dl className="mt-9 grid grid-cols-2 gap-x-5 gap-y-6 border-y border-ink/10 py-7">
              <div>
                <dt className="text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-ink/40">
                  {t("productPage.audience")}
                </dt>
                <dd className="mt-2 text-sm text-ink">
                  {t(`productPage.audiences.${product.audience}`)}
                </dd>
              </div>
              <div>
                <dt className="text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-ink/40">
                  {isPerfume ? t("catalogue.perfumeLabel") : t("catalogue.diffuserLabel")}
                </dt>
                <dd className="mt-2 text-sm text-ink">
                  {product.sizeMl ? `${product.sizeMl} ml` : "Estila Exclusive"}
                </dd>
              </div>
            </dl>

            <a
              href={`/${locale}?product=${product.id}#contact`}
              className="button-primary mt-9"
            >
              {t("productPage.inquire")}
            </a>
          </div>
        </div>

        <div className={`mt-20 grid gap-12 border-t border-ink/10 pt-14 ${isPerfume ? "lg:grid-cols-[1.15fr_0.85fr]" : "max-w-3xl"}`}>
          <div>
            <p className="eyebrow">{t("productPage.storyTitle")}</p>
            <div className="story-copy mt-7 space-y-6">
              {story.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>

          {isPerfume && (
            <aside className="h-fit rounded-[2rem] bg-cream p-7 sm:p-9">
              <h2 className="font-serif text-3xl tracking-[-0.03em] text-ink">
                {t("productPage.detailsTitle")}
              </h2>
              <dl className="mt-7 divide-y divide-ink/10">
                {[
                  ["family", "family"],
                  ["topNotes", "topNotes"],
                  ["heartNotes", "heartNotes"],
                  ["baseNotes", "baseNotes"],
                ].map(([label, key]) => (
                  <div key={key} className="py-5 first:pt-0 last:pb-0">
                    <dt className="text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-ink/42">
                      {t(`productPage.${label}`)}
                    </dt>
                    <dd className="mt-2 text-sm leading-6 text-ink/72">
                      {t(`products.items.${product.id}.${key}`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </div>
      </article>

      <section className="mx-auto mt-24 max-w-7xl border-t border-ink/10 px-5 pt-16 sm:px-8">
        <h2 className="font-serif text-4xl tracking-[-0.035em] text-ink">
          {t("productPage.related")}
        </h2>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {relatedProducts.map((related) => (
            <ProductCard key={related.id} product={related} />
          ))}
        </div>
      </section>
    </div>
  );
}
