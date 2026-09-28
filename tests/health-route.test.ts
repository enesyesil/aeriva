import { afterEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/health/route";

describe("health route", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("returns a non-cacheable healthy response", async () => {
    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(body.status).toBe("ok");
    expect(body.service).toBe("dauvena-cosmetics");
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });

  it("reports the running image revision for deployment verification", async () => {
    vi.stubEnv("APP_REVISION", "0123456789abcdef0123456789abcdef01234567");
    const body = await GET().json();

    expect(body.revision).toBe("0123456789abcdef0123456789abcdef01234567");
  });

  it("does not claim a revision for an unversioned local build", async () => {
    vi.stubEnv("APP_REVISION", "");
    const body = await GET().json();

    expect(body.revision).toBe("unknown");
  });
});
