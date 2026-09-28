import { describe, expect, it, vi } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { deployCoolify } from "../scripts/deploy-coolify.mjs";

const revision = "a".repeat(40);
const config = {
  webhookUrl: "https://coolify.example.com/api/v1/deploy?uuid=resource-123&force=false",
  token: "test-secret-token",
  healthUrl: "https://dauvena.example.com/api/health",
  revision,
};
const accepted = () => Response.json({
  deployments: [{ resource_uuid: "resource-123", deployment_uuid: "deployment-456" }],
});

function harness(fetchImpl) {
  let time = 0;
  return {
    fetchImpl,
    now: () => time,
    sleep: vi.fn(async (milliseconds) => { time += milliseconds; }),
    log: vi.fn(),
    requestTimeoutMs: 100,
    pollIntervalMs: 10,
    healthTimeoutMs: 30,
  };
}

describe("Coolify deployment", () => {
  it.each([
    { webhookUrl: undefined },
    { token: undefined },
    { healthUrl: undefined },
    { revision: undefined },
    { revision: "main" },
    { webhookUrl: "http://coolify.example.com/api/v1/deploy?uuid=resource-123&force=false" },
    { webhookUrl: "https://coolify.example.com/api/v1/webhooks/source/github/events/manual" },
    { webhookUrl: "https://coolify.example.com/api/v1/deploy?uuid=one,two&force=false" },
    { webhookUrl: "https://coolify.example.com/api/v1/deploy?uuid=one&uuid=two&force=false" },
    { webhookUrl: "https://coolify.example.com/api/v1/deploy?tag=production&force=false" },
    { webhookUrl: "https://coolify.example.com/api/v1/deploy?uuid=resource-123&tag=production&force=false" },
    { webhookUrl: "https://coolify.example.com/api/v1/deploy?uuid=resource-123&force=true" },
    { webhookUrl: "https://coolify.example.com/api/v1/deploy?uuid=resource-123&force=false&force=false" },
    { webhookUrl: "https://secret@coolify.example.com/api/v1/deploy?uuid=resource-123&force=false" },
    { healthUrl: "http://dauvena.example.com/api/health" },
    { healthUrl: "https://secret@dauvena.example.com/api/health" },
    { token: "test\r\nsecret" },
  ])("rejects invalid configuration before any request: %j", async (override) => {
    const fetchImpl = vi.fn();
    await expect(deployCoolify({ ...config, ...override }, harness(fetchImpl))).rejects.toThrow();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("accepts a deployment URL without the optional force parameter", async () => {
    const webhookUrl = "https://coolify.example.com/api/v1/deploy?uuid=resource-123";
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(accepted())
      .mockResolvedValueOnce(Response.json({ status: "ok", revision }));
    await expect(deployCoolify({ ...config, webhookUrl }, harness(fetchImpl))).resolves.toEqual({
      deploymentUuid: "deployment-456", revision,
    });
    expect(fetchImpl.mock.calls[0][0]).toBe(webhookUrl);
  });

  it.each([true, false])("keeps CLI inputs private on success=%s and exits appropriately", (success) => {
    const script = fileURLToPath(new URL("../scripts/deploy-coolify.mjs", import.meta.url));
    const child = spawnSync(process.execPath, ["--input-type=module", "--eval", `
      globalThis.fetch = async (_url, options) => Response.json(options.method === "POST"
        ? { deployments: [{ resource_uuid: "resource-123", deployment_uuid: "deployment-456" }] }
        : { status: "ok", revision: process.env.GITHUB_SHA });
      process.argv[1] = ${JSON.stringify(script)};
      await import(${JSON.stringify(new URL("../scripts/deploy-coolify.mjs", import.meta.url).href)});
    `], {
      encoding: "utf8",
      env: {
        ...process.env,
        COOLIFY_WEBHOOK: success ? config.webhookUrl : config.webhookUrl.replace("https:", "http:"),
        COOLIFY_TOKEN: config.token,
        COOLIFY_HEALTH_URL: config.healthUrl,
        GITHUB_SHA: revision,
      },
    });
    expect(child.status).toBe(success ? 0 : 1);
    const output = child.stdout + child.stderr;
    expect(output).toContain(success ? "Deployment verified" : "must use HTTPS");
    for (const privateValue of [config.webhookUrl, config.healthUrl, config.token, "resource-123", "deployment-456"]) {
      expect(output).not.toContain(privateValue);
    }
  });

  it("triggers once with a token, then waits for the matching healthy revision without a token", async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(accepted())
      .mockResolvedValueOnce(Response.json({ status: "ok", revision: "b".repeat(40) }))
      .mockResolvedValueOnce(new Response("temporarily unavailable", { status: 503 }))
      .mockResolvedValueOnce(Response.json({ status: "ok", revision }));
    const dependencies = harness(fetchImpl);
    await expect(deployCoolify(config, dependencies)).resolves.toEqual({
      deploymentUuid: "deployment-456", revision,
    });
    expect(fetchImpl).toHaveBeenCalledTimes(4);
    const [triggerUrl, triggerOptions] = fetchImpl.mock.calls[0];
    expect(triggerUrl).toBe(config.webhookUrl);
    expect(triggerOptions).toMatchObject({
      method: "POST",
      headers: { Authorization: `Bearer ${config.token}` },
      redirect: "error",
    });
    expect(triggerOptions.signal).toBeInstanceOf(AbortSignal);
    const healthCalls = fetchImpl.mock.calls.slice(1);
    for (const [url, options] of healthCalls) {
      expect(new URL(url).origin).toBe("https://dauvena.example.com");
      expect(new URL(url).searchParams.get("revision")).toBe(revision);
      expect(options).toMatchObject({
        method: "GET", cache: "no-store", redirect: "error",
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      expect(new Headers(options.headers).has("Authorization")).toBe(false);
      expect(JSON.stringify([url, options])).not.toContain(config.token);
    }
    expect(new Set(healthCalls.map(([url]) => url)).size).toBe(3);
    expect(dependencies.sleep).toHaveBeenCalledTimes(2);
    expect(JSON.stringify(dependencies.log.mock.calls)).not.toContain(config.token);
  });

  it("fails on unauthorized responses without logging their body or polling health", async () => {
    const response = new Response(`${config.token} ${config.webhookUrl}`, { status: 401 });
    const fetchImpl = vi.fn().mockResolvedValue(response);
    const dependencies = harness(fetchImpl);
    await expect(deployCoolify(config, dependencies)).rejects.toThrow("HTTP 401");
    expect(response.bodyUsed).toBe(false);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(dependencies.log.mock.calls)).not.toContain(config.token);
  });

  it.each([
    ["API is disabled.", "API access is disabled"],
    ["You are not allowed to access the API.", "IP allowlist rejected"],
    ["Missing required permissions: deploy", "lacks deploy permission"],
    ["This API token has permissions (deploy) that exceed your current role as a team member.", "token owner no longer has the team role"],
    [`Unexpected error: ${config.token} ${config.webhookUrl}`, "Check Coolify API access"],
  ])("classifies forbidden responses without exposing their contents: %s", async (message, expected) => {
    const fetchImpl = vi.fn().mockResolvedValue(Response.json({ message }, { status: 403 }));
    const dependencies = harness(fetchImpl);
    const error = await deployCoolify(config, dependencies).catch((failure) => failure);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toContain("HTTP 403");
    expect(error.message).toContain(expected);
    expect(error.message).not.toContain(config.token);
    expect(error.message).not.toContain(config.webhookUrl);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("handles non-JSON forbidden responses without exposing their contents", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(config.token, { status: 403 }));
    await expect(deployCoolify(config, harness(fetchImpl))).rejects.toThrow("Check Coolify API access");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it.each([
    {},
    { deployments: [] },
    { deployments: [{ resource_uuid: "wrong-resource", deployment_uuid: "deployment-456" }] },
    { deployments: [{ resource_uuid: "resource-123" }] },
    { deployments: [
      { resource_uuid: "resource-123", deployment_uuid: "deployment-456" },
      { resource_uuid: "other-resource", deployment_uuid: "deployment-789" },
    ] },
  ])("rejects missing or ambiguous deployment acknowledgements: %j", async (body) => {
    const fetchImpl = vi.fn().mockResolvedValue(Response.json(body));
    await expect(deployCoolify(config, harness(fetchImpl))).rejects.toThrow("did not confirm one deployment");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("sanitizes network errors and never retries the deployment trigger", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error(`${config.token} ${config.webhookUrl}`));
    const dependencies = harness(fetchImpl);
    await expect(deployCoolify(config, dependencies)).rejects.toThrow(
      "The Coolify deployment request failed or timed out; it was not retried.",
    );
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(dependencies.sleep).not.toHaveBeenCalled();
  });

  it("rejects invalid acknowledgement JSON without exposing the response body", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(`${config.token} ${config.webhookUrl}`));
    await expect(deployCoolify(config, harness(fetchImpl))).rejects.toThrow(
      "Coolify did not return a valid deployment acknowledgement.",
    );
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("does not accept a healthy response that arrives after the deadline", async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(accepted());
    const dependencies = harness(fetchImpl);
    fetchImpl.mockImplementation(async () => {
      await dependencies.sleep(31);
      return Response.json({ status: "ok", revision });
    });
    await expect(deployCoolify(config, dependencies)).rejects.toThrow("Timed out waiting");
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    expect(dependencies.log.mock.calls.flat().join(" ")).not.toContain("Deployment verified");
  });

  it.each(["old revision", "missing revision", "unhealthy", "HTTP error", "network error", "invalid JSON"])(
    "times out instead of reporting success when health returns %s",
    async (failure) => {
      const fetchImpl = vi.fn().mockResolvedValueOnce(accepted()).mockImplementation(async () => {
        if (failure === "network error") throw new Error("temporary connection failure");
        if (failure === "HTTP error") return new Response("not available", { status: 503 });
        if (failure === "invalid JSON") return new Response("not JSON");
        return Response.json({
          status: failure === "unhealthy" ? "error" : "ok",
          revision: failure === "old revision" ? "b".repeat(40) : failure === "missing revision" ? undefined : revision,
        });
      });
      const dependencies = harness(fetchImpl);
      await expect(deployCoolify(config, dependencies)).rejects.toThrow("Timed out waiting for the expected live revision");
      expect(fetchImpl).toHaveBeenCalledTimes(4);
      expect(dependencies.now()).toBe(30);
      expect(fetchImpl.mock.calls.filter(([, options]) => options.method === "POST")).toHaveLength(1);
      expect(dependencies.log.mock.calls.flat().join(" ")).not.toContain("Deployment verified");
    },
  );
});
