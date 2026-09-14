import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendMail } = vi.hoisted(() => ({ sendMail: vi.fn() }));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail })),
  },
}));

import { POST } from "@/app/api/contact/route";
import { validateContactBody } from "@/data/contact";

const validBody = {
  name: "Ada Example",
  email: "ada@example.com",
  inquiryType: "product",
  productId: "w301",
  locale: "en",
  message: "Please tell me more about this product.",
  website: "",
};

function makeRequest(body: Record<string, unknown>, ip: string) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("contact inquiry route", () => {
  beforeEach(() => {
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_SECURE = "false";
    process.env.SMTP_USER = "user";
    process.env.SMTP_PASSWORD = "password";
    process.env.CONTACT_FROM_EMAIL = "website@example.com";
    process.env.CONTACT_TO_EMAIL = "contact@example.com";
    sendMail.mockReset();
    sendMail.mockResolvedValue({ messageId: "test" });
  });

  it("validates product and locale identifiers", () => {
    expect(validateContactBody(validBody).valid).toBe(true);
    expect(validateContactBody({ ...validBody, productId: "unknown" }).valid).toBe(false);
    expect(validateContactBody({ ...validBody, locale: "tr" }).valid).toBe(false);
    expect(validateContactBody({ ...validBody, inquiryType: "enterprise" }).valid).toBe(false);
  });

  it("sends a localized, product-aware email before returning success", async () => {
    const response = await POST(makeRequest(validBody, "203.0.113.10"));

    expect(response.status).toBe(200);
    expect(sendMail).toHaveBeenCalledOnce();
    expect(sendMail.mock.calls[0][0].subject).toContain("Vanille Harmony");
    expect(sendMail.mock.calls[0][0].text).toContain("W-301 · Vanille Harmony");
  });

  it("returns an error when SMTP delivery fails", async () => {
    sendMail.mockRejectedValueOnce(new Error("SMTP unavailable"));
    const response = await POST(makeRequest(validBody, "203.0.113.11"));

    expect(response.status).toBe(502);
  });

  it("rejects unknown products and honeypot submissions", async () => {
    const invalidProduct = await POST(
      makeRequest({ ...validBody, productId: "unknown" }, "203.0.113.12"),
    );
    const honeypot = await POST(
      makeRequest({ ...validBody, website: "spam" }, "203.0.113.13"),
    );

    expect(invalidProduct.status).toBe(400);
    expect(honeypot.status).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("does not report success when delivery is not configured", async () => {
    delete process.env.SMTP_HOST;
    const response = await POST(makeRequest(validBody, "203.0.113.14"));

    expect(response.status).toBe(503);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("rate limits repeated requests from the same address", async () => {
    const responses = [];

    for (let attempt = 0; attempt < 11; attempt += 1) {
      responses.push(
        await POST(makeRequest(validBody, "203.0.113.99")),
      );
    }

    expect(responses.slice(0, 10).every((response) => response.status === 200)).toBe(true);
    expect(responses[10].status).toBe(429);
    expect(sendMail).toHaveBeenCalledTimes(10);
  });
});
