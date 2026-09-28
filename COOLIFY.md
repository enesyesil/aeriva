# Coolify deployment with a GitHub webhook

GitHub sends a signed push webhook to Coolify. Coolify fetches `main`, builds this repository's Dockerfile, and deploys the application. This setup uses a webhook URL and a shared webhook secret; no Coolify API token or GitHub Actions deployment secrets are required.

## 1. Connect the repository in Coolify

Use a Git repository application with these settings:

- Repository: `https://github.com/enesyesil/aeriva` for a public repository.
- For a private repository: choose **Private Repository (with deploy key)**, grant its SSH key read-only repository access, and use `git@github.com:enesyesil/aeriva.git`.
- Branch: `main`.
- Build Pack: **Dockerfile**.
- Base Directory: `/` (the repository root).
- Dockerfile Location: `/Dockerfile`.
- Exposed port: `3000`.
- Health check path: `/api/health`.

If you created a Docker Image resource for the earlier GHCR setup, create a Git repository application for this flow. Coolify now needs access to the source and builds the image itself. A private repository still needs the SSH deploy key, independently of the webhook secret.

If the old application is already live, test the new application on a temporary domain first. Once verified, remove the production domain from the old application, assign it to the new application, and stop the old resource.

Configure your domain and DNS. Under **Configuration → Environment Variables**, set `NEXT_PUBLIC_SITE_URL=https://dauvena.com` (use your actual production URL), with **Runtime Variable** enabled and **Build Variable** disabled. Save and redeploy after changes. This value controls page metadata; it does not configure the domain or DNS.

Contact links address `info@dauvena.com`. Make sure that mailbox is active and monitored; the website needs no SMTP credentials.

## 2. Configure the webhook

In the Coolify application:

1. Enable **Auto Deploy** under **Configuration → Advanced → Deployment**.
2. Open **Configuration → Webhooks → Manual Git Webhooks**.
3. Save a long random **GitHub Webhook Secret** and copy the GitHub webhook URL. Use this GitHub-specific URL rather than **Deploy Webhook (auth required)**.

In the repository's [webhook settings](https://github.com/enesyesil/aeriva/settings/hooks), add a webhook with that URL, the same secret, JSON content, SSL verification enabled, and only push events selected. Keep it active.

If the Coolify application is already connected through a GitHub App, enable its Auto Deploy instead of adding a duplicate manual webhook.

The URL and shared secret belong in repository webhook settings, not Actions secrets. The workflow no longer reads `COOLIFY_WEBHOOK` or `COOLIFY_TOKEN`; existing Actions secrets with those names can be removed if no other workflow uses them.

## 3. Terminal setup (optional)

Install GitHub CLI if needed and authenticate with permission to manage repository webhooks:

```sh
brew install gh
gh auth login --hostname github.com --git-protocol https --web --scopes admin:repo_hook
```

If already signed in, use `gh auth refresh --hostname github.com --scopes admin:repo_hook` to add the webhook permission.

After completing the Coolify settings above, run this in your terminal to create the GitHub webhook. It prompts for values and sends them through standard input without saving a credentials file. If the matching webhook already exists, edit it in GitHub instead of running this again.

```sh
python3 - <<'PY'
import getpass
import json
import subprocess

webhook_url = getpass.getpass("Paste the Coolify Manual Git Webhook URL for GitHub: ").strip()
webhook_secret = getpass.getpass("Paste the same webhook secret saved in Coolify: ")
if not webhook_url.startswith("https://") or not webhook_secret:
    raise SystemExit("An HTTPS webhook URL and a nonempty secret are required.")
payload = {
    "name": "web",
    "active": True,
    "events": ["push"],
    "config": {
        "url": webhook_url,
        "content_type": "json",
        "secret": webhook_secret,
        "insecure_ssl": "0",
    },
}
subprocess.run(
    ["gh", "api", "--method", "POST", "repos/enesyesil/aeriva/hooks",
     "--input", "-", "--jq", '"Created webhook ID: " + (.id | tostring)'],
    input=json.dumps(payload), text=True, check=True,
)
PY
```

This uses your GitHub CLI login to configure GitHub. It does not require a Coolify API token.

## 4. Checks and deployment

`.github/workflows/coolify.yml` runs linting, type-checking, tests, and a Docker build on pull requests and pushes to `main`. It does not publish an image or call Coolify. The duplicate `ci.yml` publishing workflow has been removed.

The push webhook starts deployment independently of GitHub Actions. To require passing checks before code reaches production, protect `main`, require pull requests, and require **Validate application** and **Validate Docker image** to pass before merging. Direct pushes or bypassing those rules can deploy before CI finishes. GitHub's former `production` environment approval does not gate this webhook flow.

After committing reviewed changes on `main`, a push triggers deployment:

```sh
git push origin main
```

If `main` requires pull requests, push your feature branch and merge its PR once checks pass; the resulting push to `main` triggers deployment.

Verify the webhook delivery in GitHub's repository settings, then check the application deployment and health in Coolify. The application must be configured for branch `main`. A manual Actions run validates only; use Coolify's Deploy button for a manual deployment.

Before the first webhook-driven release, let any older publishing/deployment runs finish or cancel them in GitHub Actions.

References: [Coolify manual Git webhooks](https://coolify.io/docs/applications/deployments/manual-webhooks), [Dockerfile builds](https://coolify.io/docs/applications/builds/dockerfile), [private repository deploy keys](https://coolify.io/docs/applications/sources/deploy-keys), [GitHub webhook creation API](https://docs.github.com/en/rest/repos/webhooks#create-a-repository-webhook).
