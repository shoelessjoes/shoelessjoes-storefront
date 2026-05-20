# Shoeless Joe's Storefront

Shopify storefront theme (Ignite base), PSA grading submission form, customer-facing pages, and Google Apps Script integration for **Shoeless Joe's Cards & Collectibles** — Lima, Ohio. Established 1992. PSA Authorized Grading Agent.

---

## What's in this repo

| Folder | Purpose |
|---|---|
| `assets/` `blocks/` `config/` `layout/` `locales/` `sections/` `snippets/` `templates/` | The Shopify theme (Ignite by Benchmark Themes, customized) |
| `apps-script/` | Google Apps Script projects — PSA form CORS proxy, email triggers, Sheets logging |
| `docs/` | Brand standards, PSA pricing, form architecture, deployment, credentials map |
| `scripts/` | Local utilities (theme packaging, etc.) |

---

## Quick start

### Reading this repo

**Always read [`docs/CLAUDE.md`](docs/CLAUDE.md) first** — it's the master context file. Brand standards, pricing, form workflow, deployment, the works.

### Working on the theme

1. Edit theme files directly (`assets/`, `sections/`, etc.)
2. Test locally with Shopify CLI (`shopify theme dev`) if installed, or zip and upload
3. Run `scripts/package-theme.ps1` (Windows) to bundle a clean zip for Shopify Admin upload
4. Commit and push

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for the full process.

### Working on Apps Script

The Apps Script projects under `apps-script/` are tracked here for version control. To deploy, use `clasp` or copy/paste into the Apps Script editor. Each project folder has its own README with deploy steps.

---

## Stack

| Layer | Tech |
|---|---|
| Storefront | Shopify (Ignite theme) |
| Form backend | Google Apps Script (CORS proxy → Shopify Admin API) |
| Form data logging | Google Sheets |
| Customer emails | Google Apps Script + Gmail (replacing SlabTracker) |

---

## Related repos

- [`shoelessjoes-ops`](https://github.com/shoelessjoes/shoelessjoes-ops) — Embedded Shopify app + workers (Dealernet, inventory, pricing automation)
- [`shoelessjoes-supplier-py`](https://github.com/shoelessjoes/shoelessjoes-supplier-py) — Python pipeline (transitional, being migrated into `shoelessjoes-ops`)

---

## License

Private — All rights reserved. © Shoeless Joe's Cards & Collectibles.
