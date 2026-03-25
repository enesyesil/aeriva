import { NextResponse } from "next/server";
import { SALES_OPTION_KEYS, type SalesOptionKey } from "@/types";

// ─── Rate Limiter (in-memory) ───
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

// ─── Validation helpers ───
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")     // strip HTML tags
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .trim();
}

function validateContactForm(body: Record<string, unknown>): {
  valid: true;
  data: { name: string; email: string; salesOption: SalesOptionKey; message: string };
} | { valid: false; error: string } {
  const { name, email, salesOption, message } = body;

  if (typeof name !== "string" || typeof email !== "string" || typeof message !== "string") {
    return { valid: false, error: "All fields are required." };
  }

  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email);
  const cleanMessage = sanitize(message);

  if (!cleanName || cleanName.length > 100) {
    return { valid: false, error: "Name is required (max 100 characters)." };
  }

  if (!cleanEmail || cleanEmail.length > 254 || !EMAIL_RE.test(cleanEmail)) {
    return { valid: false, error: "A valid email is required." };
  }

  if (!cleanMessage || cleanMessage.length > 2000) {
    return { valid: false, error: "Message is required (max 2000 characters)." };
  }

  // salesOption is optional for "general" fallback, but must be valid if provided
  let validOption: SalesOptionKey = "general";
  if (salesOption && typeof salesOption === "string") {
    if (!SALES_OPTION_KEYS.includes(salesOption as SalesOptionKey)) {
      return { valid: false, error: "Invalid inquiry type." };
    }
    validOption = salesOption as SalesOptionKey;
  }

  return {
    valid: true,
    data: { name: cleanName, email: cleanEmail, salesOption: validOption, message: cleanMessage },
  };
}

// ─── Route handler ───
export async function POST(request: Request) {
  try {
    // Rate limiting by IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = validateContactForm(body);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // TODO: Store in database once Prisma is configured
    // await db.contactSubmission.create({ data: result.data });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
