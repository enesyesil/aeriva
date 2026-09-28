import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { pathToFileURL } from "node:url";

const resourcePattern = /^[a-zA-Z0-9_-]+$/;

function parseHttpsUrl(value, label) {
  let url;
  try {
    if (typeof value !== "string" || !value.trim()) throw new Error();
    url = new URL(value);
  } catch {
    throw new Error(`${label} must be a valid HTTPS URL.`);
  }
  if (url.protocol !== "https:" || url.username || url.password || url.hash) {
    throw new Error(`${label} must use HTTPS without credentials or a fragment.`);
  }
  return url;
}

function validateConfig({ webhookUrl, token, healthUrl, revision }) {
  const webhook = parseHttpsUrl(webhookUrl, "COOLIFY_WEBHOOK");
  const resource = webhook.searchParams.get("uuid");
  if (
    webhook.pathname !== "/api/v1/deploy" ||
    webhook.searchParams.getAll("uuid").length !== 1 ||
    !resource ||
    !resourcePattern.test(resource) ||
    webhook.searchParams.getAll("force").length > 1 ||
    (webhook.searchParams.has("force") && webhook.searchParams.get("force") !== "false") ||
    [...webhook.searchParams.keys()].some((key) => !["uuid", "force"].includes(key))
  ) {
    throw new Error(
      "COOLIFY_WEBHOOK must be the API deploy URL with one uuid and optional force=false; manual Git webhooks and tag deployments are not supported.",
    );
  }
  if (typeof token !== "string" || !token.trim() || /[\r\n]/.test(token)) {
    throw new Error("COOLIFY_TOKEN must be a nonempty API token.");
  }
  const health = parseHttpsUrl(healthUrl, "COOLIFY_HEALTH_URL");
  if (typeof revision !== "string" || !/^[a-f0-9]{40}$/i.test(revision)) {
    throw new Error("GITHUB_SHA must be the full 40-character commit SHA.");
  }
  return { webhook, resource, token: token.trim(), health, revision };
}

/** Trigger once, then verify the public application's deployed revision. */
export async function deployCoolify(
  config,
  {
    fetchImpl = globalThis.fetch,
    sleep = delay,
    now = Date.now,
    log = console.log,
    requestTimeoutMs = 30_000,
    pollIntervalMs = 10_000,
    healthTimeoutMs = 600_000,
  } = {},
) {
  const { webhook, resource, token, health, revision } = validateConfig(config);
  for (const timeout of [requestTimeoutMs, pollIntervalMs, healthTimeoutMs]) {
    if (!Number.isSafeInteger(timeout) || timeout <= 0) {
      throw new Error("Deployment timeouts must be positive whole milliseconds.");
    }
  }

  log("Requesting deployment from Coolify.");
  let response;
  try {
    response = await fetchImpl(webhook.href, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      redirect: "error",
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
  } catch {
    throw new Error("The Coolify deployment request failed or timed out; it was not retried.");
  }
  if (!response.ok) {
    throw new Error(`Coolify rejected the deployment request (HTTP ${response.status}).`);
  }

  let acknowledgement;
  try {
    acknowledgement = await response.json();
  } catch {
    throw new Error("Coolify did not return a valid deployment acknowledgement.");
  }
  const deployments = acknowledgement?.deployments;
  if (
    !Array.isArray(deployments) ||
    deployments.length !== 1 ||
    deployments[0]?.resource_uuid !== resource ||
    typeof deployments[0]?.deployment_uuid !== "string" ||
    !resourcePattern.test(deployments[0].deployment_uuid)
  ) {
    throw new Error("Coolify did not confirm one deployment for the requested resource.");
  }

  log("Deployment accepted. Waiting for the expected live revision.");
  const deadline = now() + healthTimeoutMs;
  while (now() < deadline) {
    const healthRequest = new URL(health);
    healthRequest.searchParams.set("revision", revision);
    healthRequest.searchParams.set("_deploy_check", String(now()));
    try {
      const healthResponse = await fetchImpl(healthRequest.href, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(Math.max(1, Math.min(requestTimeoutMs, deadline - now()))),
      });
      if (healthResponse.ok) {
        const result = await healthResponse.json();
        if (now() < deadline && result?.status === "ok" && result?.revision === revision) {
          log("Deployment verified: the expected revision is healthy.");
          return { deploymentUuid: deployments[0].deployment_uuid, revision };
        }
      }
    } catch {
      // A rollout can temporarily interrupt health checks. Never log response
      // bodies, request URLs, or raw errors that could contain credentials.
    }
    const remaining = deadline - now();
    if (remaining > 0) await sleep(Math.min(pollIntervalMs, remaining));
  }
  throw new Error("Timed out waiting for the expected live revision. Deployment may still be running.");
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isCli) {
  deployCoolify({
    webhookUrl: process.env.COOLIFY_WEBHOOK,
    token: process.env.COOLIFY_TOKEN,
    healthUrl: process.env.COOLIFY_HEALTH_URL,
    revision: process.env.GITHUB_SHA,
  }).catch((error) => {
    console.error(`Deployment failed: ${error.message}`);
    process.exitCode = 1;
  });
}
