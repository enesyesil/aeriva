/* eslint-disable @next/next/no-img-element -- ImageResponse renders image bytes, not browser components. */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getProductBySlug, products } from "@/data/products";
import { routing } from "@/i18n/routing";
import en from "@/messages/en.json";
import fr from "@/messages/fr.json";
import nl from "@/messages/nl.json";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const dynamicParams = false;

const messages = { en, fr, nl };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => [
    { locale, slug: [] },
    ...products.map((product) => ({ locale, slug: [product.slug] })),
  ]);
}

async function imageData(path: string) {
  const content = await readFile(join(process.cwd(), "public", path));
  const type = path.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${type};base64,${content.toString("base64")}`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string; slug?: string[] }> },
) {
  const { locale, slug = [] } = await params;
  if (!hasLocale(routing.locales, locale) || slug.length > 1) {
    return new Response("Not found", { status: 404 });
  }
  const product = slug[0] ? getProductBySlug(slug[0]) : undefined;
  if (slug.length && !product) return new Response("Not found", { status: 404 });

  const copy = messages[locale];
  const logo = await imageData(`/images/brand/dauvena-lockup-${product ? "ink" : "white"}-v2.png`);
  const item = product ? copy.products.items[product.id as keyof typeof copy.products.items] : undefined;
  const photo = product ? await imageData(product.images[0]) : undefined;

  return new ImageResponse(
    product && item && photo ? (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#F7F3EC", color: "#20282A", padding: 56, gap: 52 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 604 }}>
          <img src={logo} width={430} height={76} alt="Dauvena" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 17, letterSpacing: 4, marginBottom: 18 }}>
              {product.line === "estila" ? "ESTILA EXCLUSIVE" : "MAVIGÖL"}
            </div>
            <div style={{ fontSize: item.name.length > 22 ? 47 : 62, fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
              {item.name}
            </div>
            <div style={{ fontSize: 24, lineHeight: 1.45, color: "#596062" }}>
              {item.shortDescription}
            </div>
          </div>
          <div style={{ fontSize: 18, letterSpacing: 2 }}>dauvena.com</div>
        </div>
        <div style={{ display: "flex", width: 432, height: 518, overflow: "hidden", borderRadius: 24, background: "#EEE6DC" }}>
          <img src={photo} width={432} height={518} style={{ objectFit: "cover" }} alt={item.name} />
        </div>
      </div>
    ) : (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#20282A", color: "#FFFFFF", padding: 64 }}>
        <div style={{ display: "flex", position: "absolute", inset: 24, border: "1px solid #56605E", borderRadius: 18 }} />
        <div style={{ color: "#EAD2BF", fontSize: 17, letterSpacing: 6, marginBottom: 46 }}>ESTILA EXCLUSIVE · MAVIGÖL</div>
        <img src={logo} width={880} height={155} alt="Dauvena" />
        <div style={{ fontSize: 32, marginTop: 40 }}>{copy.hero.eyebrow}</div>
        <div style={{ color: "#EAD2BF", fontSize: 19, letterSpacing: 3, marginTop: 52 }}>dauvena.com</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    },
  );
}
