# Deploy to Coolify from GitHub Actions

Pushes to `main` and manual runs on `main` validate the app, publish a new Docker image to GitHub Container Registry, and call Coolify with an API token. The workflow succeeds only after the live health endpoint reports the deployed commit. Pull requests validate and build without publishing or deploying.

## 1. Check the existing Coolify application

Use the **Docker Image** application serving `dauvena.com`:

- Image: `ghcr.io/enesyesil/aeriva`
- Tag: `latest` (remove any pinned SHA or digest)
- Exposed port: `3000`
- Health check path: `/api/health`
- Runtime variable: `SITE_URL=https://dauvena.com` (legacy `NEXT_PUBLIC_SITE_URL` is also accepted)

Coolify pulls the published image; it does not need a Git source or to build this repository. The image is currently public. If you make it private, configure registry authentication on the deployment server with permission to read the package.

The Docker build embeds its Git commit as `APP_REVISION`. Do not override this variable in Coolify; the workflow uses it to verify the running release. Avoid mounting persistent storage over `/app/public` or `/app/.next`, which would hide updated files in the image.

Disable any separate Git push webhook/Auto Deploy configured during the previous webhook-only setup, so it cannot start a deployment before the new image is published. If you already migrated to a Git source application, use a Docker Image application with the settings above and assign the production domain to it after verifying it on a temporary domain.

## 2. Create the two GitHub secrets

In Coolify, select the team that owns the application:

1. **Keys & Tokens → API tokens**: create a token with the **deploy** permission.
2. In the application, open **Configuration → Webhooks** and copy **Deploy Webhook (auth required)**. It should be an HTTPS URL ending in `/api/v1/deploy?uuid=...` (possibly with `&force=false`). Use the single application's UUID, not a tag or a Manual Git Webhook.

In [GitHub Actions secrets](https://github.com/enesyesil/aeriva/settings/secrets/actions), add:

| Secret | Value |
| --- | --- |
| `COOLIFY_WEBHOOK` | The application's authenticated Deploy Webhook URL |
| `COOLIFY_TOKEN` | The Coolify API token with deploy permission |

The old GitHub webhook signing secret is not an API token. Actual credentials stay in GitHub secrets; the YAML only references them. GitHub supplies `GITHUB_TOKEN` automatically for image publishing.

The deployment job uses the GitHub `production` environment. If secrets with these names exist there, update them too: environment secrets override repository secrets. Existing environment approval rules still apply.

### Terminal commands

Install and sign in to GitHub CLI if needed:

```sh
brew install gh
gh auth login --hostname github.com --git-protocol https --web
```

These commands prompt for each value without putting it in shell history:

```sh
gh secret set COOLIFY_WEBHOOK --repo enesyesil/aeriva
gh secret set COOLIFY_TOKEN --repo enesyesil/aeriva
```

If the secrets already exist in the `production` environment, update that scope instead:

```sh
gh secret set COOLIFY_WEBHOOK --repo enesyesil/aeriva --env production
gh secret set COOLIFY_TOKEN --repo enesyesil/aeriva --env production
```

The live verification URL defaults to `https://dauvena.com/api/health`. Only if you use a different domain, set an Actions variable:

```sh
gh variable set COOLIFY_HEALTH_URL --repo enesyesil/aeriva --body 'https://your-domain.example/api/health'
```

## 3. Release and verify

After committing the workflow changes, push `main`, or run **Actions → Build and deploy to Coolify → Run workflow → main**. From the terminal:

```sh
git push origin main
gh workflow run coolify.yml --repo enesyesil/aeriva --ref main
gh run list --repo enesyesil/aeriva --workflow coolify.yml --limit 3
```

A push already triggers deployment; use the manual command only when you need another run. Each run publishes `latest` and a `sha-<full commit>` tag. Only one main-branch run publishes and deploys at a time; GitHub may replace pending runs with a newer one.

The deployment step sends an authenticated POST to Coolify, checks that a deployment was accepted, then polls the public health endpoint for up to ten minutes. The token is sent only to Coolify, never to the website. A successful trigger alone does not pass the workflow: `/api/health` must return `status: "ok"` and the exact run's `revision`.

If the deploy job fails:

- **Missing credentials:** add the two secrets in the correct repository/environment.
- **401/403:** check the API token, active team, deploy permission, and Coolify API access/IP allowlist.
- **No deployment accepted:** confirm this is the authenticated Deploy Webhook for one application.
- **Live revision timeout:** open Coolify's deployment logs. Check that it pulled the new `latest`, that no old image digest is pinned, and that the production domain points to this application. A queued or failed deployment can leave the old site running even after a successful API request.

You can inspect the running release at [the health endpoint](https://dauvena.com/api/health). It reports the image's commit without exposing credentials.

References: [Coolify API deployment endpoint](https://coolify.io/docs/api/endpoints/deployments/deploy-by-tag-or-uuid), [API permissions](https://coolify.io/docs/api/permissions), [Docker Image applications](https://coolify.io/docs/applications/deployments/docker-image).
