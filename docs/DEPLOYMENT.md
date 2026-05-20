# Deployment

How to ship theme changes and Apps Script changes from this repo to production.

---

## Theme deployment

### Option 1: Manual zip upload (current default, no extra tools)

1. Open PowerShell in the repo root.
2. Run the packaging script:
   ```powershell
   .\scripts\package-theme.ps1
   ```
3. A zip file is created in the repo root, named like `theme-export-20260520-1430.zip`.
4. In Shopify Admin → **Online Store → Themes → Add theme → Upload zip**.
5. Once uploaded, click **Actions → Preview** to verify, then **Publish** when ready.

### Option 2: Shopify CLI (faster for iterative work)

Install Shopify CLI once:
```powershell
npm install -g @shopify/cli @shopify/theme
shopify auth login
```

Local dev with hot reload:
```powershell
shopify theme dev --store shoelessjoescards.myshopify.com
```

Push directly to live or unpublished theme:
```powershell
shopify theme push --store shoelessjoescards.myshopify.com --unpublished
```

The `.shopifyignore` file ensures `apps-script/`, `docs/`, and `scripts/` aren't uploaded.

### Option 3: Shopify GitHub integration (set up later)

Shopify can auto-deploy from a GitHub branch. Settings → Online Store → Themes → Connect from GitHub. Once configured, every push to `main` (or a chosen branch) auto-syncs to the connected theme. Lowest-friction long-term option.

---

## Apps Script deployment

The Apps Script projects under `apps-script/` are tracked here as source of truth. To deploy:

### Option 1: Manual (paste into Apps Script editor)

1. Open the project in Apps Script (`script.google.com`).
2. Copy file contents from `apps-script/psa-grading/*.gs` into the corresponding files in the editor.
3. Click **Deploy → Manage deployments → Edit** (pencil icon on the active deployment) → **New version** → Deploy.
4. Copy the new deployment URL if it changed and update `APPS_SCRIPT_URL` in the form's CONFIG block (and in `.env`).

### Option 2: clasp (recommended)

Install once:
```powershell
npm install -g @google/clasp
clasp login
```

From `apps-script/psa-grading/`:
```powershell
clasp pull   # download current live version into the repo
clasp push   # upload local files to Apps Script
clasp deploy --description "feat: updated PSA pricing tiers"
```

`.clasp.json` is gitignored — each developer logs in separately.

---

## Credential rotation checklist

If any of these are exposed or you're cycling them as a precaution:

| Credential | Where to rotate | What to update after |
|---|---|---|
| Shopify Admin API token | Shopify Admin → Apps → Develop apps → [your app] → API credentials → Rotate | Apps Script (`SHOPIFY_TOKEN`), `.env` |
| Apps Script `SECRET_KEY` | Apps Script editor → constants block | Form CONFIG `SCRIPT_SECRET`, `.env` |
| Apps Script deployment URL | New deployment in Apps Script editor | Form CONFIG `APPS_SCRIPT_URL`, `.env` |
| PSA API token (if/when integrated) | psacard.com → API settings | `.env` |

See [`CREDENTIALS.md`](CREDENTIALS.md) for the full map.

---

## Pre-deploy checklist

Before publishing changes to the live theme:

- [ ] Tested locally (Shopify CLI dev) or in an unpublished theme preview
- [ ] PSA form submits successfully → draft order appears in Shopify
- [ ] Customer confirmation email arrives
- [ ] Google Sheet logs the submission
- [ ] Printable receipt renders correctly and prints from `window.print()`
- [ ] All four payment paths tested: in-store + online × review-flagged + non-review
- [ ] PSA pricing matches `docs/PSA_PRICING.md`
- [ ] Brand standards intact (Bebas Neue, navy/gold/cream palette)
- [ ] No secrets in committed files (`git diff --staged | grep -i 'shpat_\|secret\|token\|password'`)
