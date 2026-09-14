import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { validateContactBody } from "@/data/contact";

const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

const messageLoaders = {
  en: () => import("@/messages/en.json"),
  fr: () => import("@/messages/fr.json"),
  nl: () => import("@/messages/nl.json"),
} as const;

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!host || !Number.isInteger(port) || !user || !password || !from || !to) {
    return null;
  }

  return {
    transport: {
      host,
      port,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass: password },
    },
    from,
    to,
  };
}

export async function POST(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const result = validateContactBody(body);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const smtp = getSmtpConfig();
    if (!smtp) {
      return NextResponse.json(
        { error: "Contact delivery is not configured." },
        { status: 503 },
      );
    }

    const { name, email, inquiryType, locale, message, product } = result.data;
    const messages = (await messageLoaders[locale]()).default;
    const productContent = product
      ? messages.products.items[product.id as keyof typeof messages.products.items]
      : undefined;
    const productLabel = product && productContent
      ? productContent.name
      : "No specific product";
    const lineLabel = product
      ? product.line === "estila"
        ? "Estila Exclusive"
        : "Mavigöl"
      : "—";
    const subject = `[Dauvena Cosmetics] ${inquiryType} inquiry${
      productContent ? ` — ${productContent.name}` : ""
    }`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Locale: ${locale}`,
      `Inquiry type: ${inquiryType}`,
      `Product: ${productLabel}`,
      `Product line: ${lineLabel}`,
      "",
      message,
    ].join("\n");

    const transporter = nodemailer.createTransport(smtp.transport);
    await transporter.sendMail({
      from: smtp.from,
      to: smtp.to,
      replyTo: email,
      subject,
      text,
      html: `
        <h1 style="font: 600 20px Arial, sans-serif; color: #20282a;">Dauvena Cosmetics inquiry</h1>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Locale:</strong> ${escapeHtml(locale)}</p>
        <p><strong>Inquiry type:</strong> ${escapeHtml(inquiryType)}</p>
        <p><strong>Product:</strong> ${escapeHtml(productLabel)}</p>
        <p><strong>Product line:</strong> ${escapeHtml(lineLabel)}</p>
        <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unable to send inquiry." }, { status: 502 });
  }
}
