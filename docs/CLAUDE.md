# Shoeless Joe's Storefront — Dev Context

> **Read this file at the start of every session before touching any code.**

This is the master context for the storefront repo. Companion docs:
- [`BRAND.md`](BRAND.md) — Colors, fonts, voice, logo
- [`PSA_FORM.md`](PSA_FORM.md) — Form architecture and workflows
- [`PSA_PRICING.md`](PSA_PRICING.md) — PSA tier prices and turnaround times
- [`DEPLOYMENT.md`](DEPLOYMENT.md) — How to ship theme + Apps Script changes
- [`CREDENTIALS.md`](CREDENTIALS.md) — What credential lives where (no secrets)

---

## Shop Overview

**Shoeless Joe's Cards & Collectibles** — Lima, Ohio. Est. 1992. PSA Authorized Grading Agent. Family-owned brick-and-mortar with growing online presence.

| Item | Value |
|---|---|
| Shopify store domain | `shoelessjoescards.myshopify.com` |
| Public site | `shoelessjoescards.com` |
| Shopify location ID | `72115847233` |
| Shopify Admin API version | `2024-10` |
| GitHub org | `shoelessjoes` |
| Storefront repo | `shoelessjoes-storefront` (this one) |

---

## Repo Architecture

```
shoelessjoes-storefront/
├── assets/ blocks/ config/ layout/ locales/ sections/ snippets/ templates/
│   └── ← Ignite theme (Benchmark Themes v2.5.2), customized
├── apps-script/
│   └── psa-grading/ ← CORS proxy, draft order creation, email triggers, Sheets logging
├── docs/ ← You are here
├── scripts/ ← Local utilities (theme packaging, etc.)
├── .env.example ← Credentials template
├── .gitignore
├── .shopifyignore ← Excludes non-theme folders from Shopify CLI
└── README.md
```

---

## Sibling Repos

| Repo | Purpose |
|---|---|
| `shoelessjoes-storefront` (this) | Customer-facing Shopify theme + PSA form + Apps Script |
| `shoelessjoes-ops` | Back-office: embedded Shopify app, Dealernet sync, inventory, pricing |
| `shoelessjoes-supplier-py` | Legacy Python pipeline (being migrated into `-ops`) |

---

## Theme Base

Ignite by Benchmark Themes, v2.5.2. 81 sections, 16 blocks, 107 snippets. Includes specialty templates for `product.bulk-order`, `product.enquire`, `product.preorder`, `page.lookbook`, `page.product-finder`, and `collection.deals`.

See [`BRAND.md`](BRAND.md) for our brand overrides (fonts, colors).

---

## PSA Grading Form — High-Level

The form is a self-contained HTML asset (~1000 lines) that lives in the theme under `assets/ShoelessJoes_PSA_ShopifyAsset.html` and is loaded into the storefront via a Liquid section (`sections/psa-grading-form.liquid`) using an iframe.

It posts to a Google Apps Script web app, which:
1. Acts as a CORS proxy to the Shopify Admin API (creates draft orders)
2. Logs every submission to a Google Sheet
3. Sends customer confirmation emails

Full architecture in [`PSA_FORM.md`](PSA_FORM.md).

---

## Key Decisions (do not relitigate)

- **Upfront payment** at drop-off. Exception: Review-flagged orders pay after staff review.
- **Draft orders**, not Storefront API cart. Apps Script → Admin API → draft order → `invoice_url` for the online path.
- **CORS proxy** — all Shopify API calls from the form go through Apps Script, never directly from the browser.
- **No POS embedding** — fulfillment tracking is via Shopify order line item status (looked up by customer name in POS).
- **Bebas Neue for display, Roboto for body, Roboto Mono for mono.** Final.
- **Single-file form** — the entire PSA form is one self-contained HTML file deployed as a Shopify asset. Do not split it.

---

## Roadmap

### Current phase: Theme revamp + PSA form integration

1. ✅ Repo structure
2. ☐ Wire Ignite theme to brand standards (Bebas Neue, navy/gold/cream palette)
3. ☐ Build out homepage, About, Services, Contact, FAQ, Brands pages with real content
4. ☐ Add Graded Cards menu pulling live Shopify collection
5. ☐ Port PSA form into the new theme (section + asset + page template)
6. ☐ Update PSA pricing and turnaround times (PSA changed them recently — see PSA_PRICING.md)
7. ☐ Align PSA pricing brochure (PDF printout) with new theme styling
8. ☐ Re-deploy Apps Script with updated webhook URL/secret

### Later phases

- SlabTracker replacement: full email sequence in Apps Script (6 templates already drafted)
- Review-to-Quote loop: post-review revised form sent to customer for online payment
- BGS / SGC / CGC pricing tabs in the form (scaffold exists)
- Shopify GitHub theme integration so pushes auto-deploy

---

## Conventions

- **Commit style:** conventional commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`)
- **Branch model:** trunk-based. Work on `main`. Feature branches only for risky multi-day work.
- **PR reviews:** solo dev — no PR review required, but use PRs for risky changes so they show up in history with context.
- **Secrets:** never commit. `.env` is gitignored. Real values in 1Password. See `CREDENTIALS.md`.
