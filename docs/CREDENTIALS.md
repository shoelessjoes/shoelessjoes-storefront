# Credentials Map

A safe, no-secrets reference for what credentials this repo uses, where they live, and what they're scoped to. **Real values live in 1Password and `.env` files (gitignored). Never paste actual secrets in this file.**

---

## How we manage credentials

1. **1Password** is the source of truth. Every credential below has a 1Password entry under the "Shoeless Joe's" vault.
2. **`.env` files** hold the working copy for local development. They're gitignored. Copy `.env.example` and fill in from 1Password.
3. **Each machine** (home PC, shop PC) maintains its own `.env`. Never sync `.env` files via Drive/Dropbox.
4. **Rotate quarterly** or immediately if a credential leaks, a contractor leaves, or a device is lost.

---

## Credentials in this repo

| ID | What it is | Lives in | Used by | Last rotated |
|---|---|---|---|---|
| `SHOPIFY_API_TOKEN` | Shopify Admin API access token (`shpat_xxx`) | 1Password → "Shopify Admin API" | Apps Script (server-to-server) | _TBD_ |
| `SHOPIFY_LOCATION_ID` | Public-ish ID for the brick-and-mortar location | `.env`, hardcoded in form CONFIG | Apps Script when creating draft orders | n/a |
| `APPS_SCRIPT_URL` | Deployed `/exec` URL of the Apps Script web app | 1Password → "PSA Apps Script Deploy" | Form CONFIG block (`SHOPIFY_PSA_ASSET.HTML`) | _TBD_ |
| `SCRIPT_SECRET` | Shared secret between form and Apps Script | 1Password → "PSA Form ↔ Apps Script Secret" | Form CONFIG + Apps Script `SECRET_KEY` constant | _TBD_ |
| `GMAIL_APP_PASSWORD` | App-specific password for `contact@shoelessjoescards.com` | 1Password → "Gmail App Password — Contact" | Apps Script for sending customer emails | _TBD_ |

---

## Credentials in sibling repos (referenced here for context)

These do **not** belong in this repo's `.env`, but are documented so you know the full picture.

| ID | Repo | What it is |
|---|---|---|
| `DEALERNET_USERNAME` / `_PASSWORD` | `shoelessjoes-ops`, `shoelessjoes-supplier-py` | DealernetX dealer portal login |
| `DATABASE_URL` | `shoelessjoes-ops` | Railway Postgres connection string |
| `SHOPIFY_ACCESS_TOKEN` (worker) | `shoelessjoes-ops` | Separate Admin API token for the back-office app — keep distinct from the form's token so they can be rotated independently |
| `ALERT_SMTP_*` | `shoelessjoes-ops`, `shoelessjoes-supplier-py` | Outbound email for ops alerts |

---

## Rotation checklist

When rotating any credential:

1. Generate the new value (Shopify admin, Apps Script editor, Gmail account security, etc.)
2. Update the 1Password entry — keep the old value in the "previous" field for 24h in case of rollback
3. Update `.env` on every machine that needs it (home, shop, any cloud worker)
4. Update any hardcoded references (e.g., form CONFIG block in the HTML asset)
5. Redeploy whatever consumes the credential (Apps Script redeploy, theme push, worker restart)
6. Test the flow end-to-end (form submission → draft order → email)
7. Update the "Last rotated" column in this doc and commit

---

## What is NOT a credential (and is safe to commit)

- Shopify store domain (`shoelessjoescards.myshopify.com`)
- Shopify location ID (`72115847233`) — public-facing
- Shopify API version string (`2024-10`)
- Apps Script project IDs (not the deployment URL or secret)
- Sheet IDs for logging Sheets

These can be committed in code and config files.
