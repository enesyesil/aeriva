# Coolify deployment

This repository publishes a production Docker image to GitHub Container Registry and asks Coolify to deploy it only after linting, type-checking, tests, and the container build succeed.

## 1. Create the Coolify application

Create a **Docker Image** application in Coolify with these values:

- Image: `ghcr.io/enesyesil/aeriva:latest`
- Exposed port: `3000`
- Health check path: `/api/health`

If the GHCR package is private, authenticate the deployment server with a GitHub token that has `read:packages`. Alternatively, make the package public after the first workflow run.

Disable Coolify's source-based auto-deploy for this application. GitHub Actions is the deployment trigger, so leaving both enabled can start duplicate deployments.

## 2. Configure runtime environment variables

Add these variables to the Coolify application. Keep them in Coolify; do not commit their values:

```text
SMTP_HOST
SMTP_PORT
SMTP_SECURE
SMTP_USER
SMTP_PASSWORD
CONTACT_FROM_EMAIL
CONTACT_TO_EMAIL
```

## 3. Create the deploy credentials

1. On self-hosted Coolify, enable **Settings → Configuration → Advanced → API Access**. Coolify Cloud already enables API access.
2. Open **Keys & Tokens → API Tokens** and create a token with only the `deploy` permission.
3. Open the application and copy **Configuration → Webhooks → Deploy Webhook (auth required)**.

## 4. Add GitHub Actions secrets

In the GitHub repository, open **Settings → Secrets and variables → Actions** and add:

- `COOLIFY_WEBHOOK`: the authenticated deploy webhook URL copied from Coolify.
- `COOLIFY_TOKEN`: the deploy-only API token.

The workflow uses GitHub's built-in `GITHUB_TOKEN` to publish `ghcr.io/enesyesil/aeriva`. No registry password is stored in the repository.

## Deployment flow

- Pull requests to `main`: lint, type-check, test, and build the Docker image without publishing or deploying it.
- Pushes to `main`: run all checks, publish `latest` and commit-SHA image tags, then call the Coolify webhook.
- Manual runs on `main`: the same production flow can be started from the GitHub Actions page. Manual runs on other branches validate and build without publishing or deploying.

Coolify should pull `ghcr.io/enesyesil/aeriva:latest` when the webhook is called. A successful webhook response means the deployment was queued; verify final health in Coolify's Deployments view.
