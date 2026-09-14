import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/health/route";

describe("health route", () => {
  it("returns a non-cacheable healthy response", async () => {
    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body.status).toBe("ok");
    expect(body.service).toBe("dauvena-cosmetics");
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });
});
