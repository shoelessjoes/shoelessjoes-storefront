# Shoeless Joe's — Project Handoff & Status

**Last updated:** 2026-05-28. Use this to bring a fresh chat fully up to speed.

---

## The business

**Shoeless Joe's Cards & Collectibles** — sports cards & collectibles shop.
- **Address:** 6123 Bridgetown Rd, Cincinnati, OH 45248
- **Owners:** brothers Kevin & Dan Burke (2025–present). Founded 1992; Tom Huber era 1997–2025.
- **Public site:** shoelessjoescards.com
- **Shopify myshopify domain:** `qebynk-b0.myshopify.com` ← **NOT** shoelessjoescards.myshopify.com (that doesn't exist). This tripped us up; the `.myshopify` handle is a fixed internal string.
- **Shopify location ID:** 72115847233
- **PSA Authorized Grading Agent; Official Topps + Panini dealer.**

Full content (hours, About, history, social) is in `docs/CONTENT.md`.

---

## Three-repo architecture

| Repo | Purpose | Status |
|---|---|---|
| **shoelessjoes-storefront** | Shopify theme (Ignite base) + PSA form + Apps Script | **Active — customer-facing work** |
| **shoelessjoes-ops** | Node monorepo: Dealernet offer ingest, inbox, Shopify draft orders/orders, Remix admin app | **Migrated & local dev working** (Docker Postgres, `ingest-offers` validated). See `../shoelessjoes-ops/docs/HANDOFF_CLAUDE.md` |
| **shoelessjoes-supplier-py** | Python: DealerNet **pricing table** scrape, match, alerts, review packs | **Migrated from legacy `shoeless-joes`**. See `../shoelessjoes-supplier-py/docs/HANDOFF_CLAUDE.md` |

**Next cross-repo priority:** shared Shopify **sealed-product catalog export** (UPC + variant ID) used by both ops purchase sync and pricing/margin pipeline.

Old tangled repos (`shopify`, `shoeless-joes`, `dealernet-shopify-ops`) should be **archived** on GitHub, not deleted. Local clones live under `C:\Users\burke\Git2\`. Old Railway Postgres tied to legacy repo — **do not use**; see `shoelessjoes-ops/docs/RAILWAY_FRESH_START.md`.

---

## Storefront repo — what's DONE

- **Repo scaffold** — full Ignite theme (v2.5.2 by Benchmark Themes) + `docs/`, `apps-script/`, `scripts/`, `brand-assets/`. Theme files at root (Shopify convention).
- **Brand foundation:**
  - Logo files in `assets/` (`logo.png` transparent, `logo-on-navy.jpg`). Interim transparent version made by knocking out a black bg — works, but **getting a true SVG from the designer is still a to-do**.
  - Fonts: Empera = logo only (files in `brand-assets/fonts/`). Site display = **Bebas Neue**, body = Roboto, mono = Roboto Mono. Loaded via Google Fonts + overridden in `assets/shoeless-brand.css` (Bebas Neue isn't in Shopify's font library).
  - Color schemes: Brand Cream (default), Brand Navy, Brand Gold added to `config/settings_data.json`.
- **PSA submission form** (`assets/ShoelessJoes_PSA_ShopifyAsset.html`) — fully updated:
  - Pricing: PSA base + **$2/card markup**, new turnaround times, PSA Dual pricing confirmed.
  - **Weekly vs Monthly cadence gate** as the first choice; Weekly hides Value Bulk; tags order `psa-weekly`/`psa-monthly`.
  - Add-ons: **$2 Prep/Entry**, **$3 Review** (per card, independent).
  - Shipping removed — "invoiced on return" language instead.
  - Mounted via `sections/psa-grading-form.liquid` + `templates/page.psa-form.json`.
- **Apps Script** (`apps-script/psa-grading/Code.gs`) — builds the Shopify order server-side, logs to Google Sheet (Submissions + Orders tabs, with a **Run** column), sends confirmation email.
  - **Token is server-side only** (Script Property `SHOPIFY_TOKEN`) — never in the form asset.
  - Sheet ID: `1iscPzIuOFCgRQckDH6qERrBsQD4VTpooEbVVy-KPMVw` (reused, cleared).
- **Connection verified:** test order #7670 created successfully via the Apps Script.

---

## Storefront repo — what's PENDING

1. **Homepage build** — the biggest gap. There's a standalone mockup (`shoelessjoes-homepage-mockup.html`) the owner liked, but it was **never implemented into the theme**. Needs `index.json` assembled from Ignite sections: hero (shop photo) → brand marquee → Sealed Wax tiles → interior gallery → before/after renovation → grading CTA. Vending machines + mystery slabs go on their **own pages**, not the homepage.
2. **Navigation menu** — build in Shopify Admin (Online Store → Navigation), not theme code. Structure: Sealed Wax (7 sport collections), Vending Machines (3 location pages), Grading Services (PSA/BGS/SGC/TAG), Credit Cards (⚠️ *unclarified — ask what this links to*), About Us, Sell Your Cards, Contact Us.
3. **Apply brand color schemes** to sections (currently sections still use Ignite demo schemes).
4. **Wire logo into header**; get SVG logo from designer.
5. **Graded Cards collection** — 152-product import CSV exists from a prior chat; needs to go live + a tag-based collection + menu link.
6. **Form go-live** — paste real `APPS_SCRIPT_URL` into form CONFIG, package theme, upload, create the PSA page, full end-to-end test (tag + add-ons + sheet + email).
7. **Other grader forms** — BGS/SGC/TAG (PSA done; others stubbed). Need pricing.
8. **Pages:** About (great story in CONTENT.md), Contact, FAQ, vending location pages.
9. **Reference sites:** medcitysportscards.com (homepage feel), hobbycardshop.com (shopping structure).

---

## Hard-won gotchas (don't repeat these)

- **myshopify domain is `qebynk-b0.myshopify.com`** — not derived from the public domain.
- **Shopify token stays server-side** in Apps Script Script Properties. Never in the form asset (it's a public theme file). An old token leaked this way and was rotated.
- **PowerShell `Compress-Archive` writes backslash zip paths** that Shopify rejects ("missing layout/theme.liquid"). The fixed `scripts/package-theme.ps1` forces forward slashes. Or zip the 8 theme folders via Windows Explorer.
- **Repo → Shopify is one-directional.** Package from repo, upload to Shopify. Never paste theme/export zips back into the repo (this caused a 452-file mess).
- **`.gitignore` now ignores all `*.zip`** so stray zips can't be committed.
- **Workflow across two machines:** pull before starting, commit+push before leaving. Clone path: `C:\Users\burke\Git2\`.

---

## Deploy quick-reference

**Theme:** `.\scripts\package-theme.ps1` → upload zip in Shopify Admin → Themes → preview → publish.
**Apps Script:** paste `Code.gs` → set `SHOPIFY_TOKEN` Script Property → Deploy → New version → copy `/exec` URL → paste into form CONFIG `APPS_SCRIPT_URL`.

Full details in `docs/DEPLOYMENT.md`. Brand spec in `docs/BRAND.md`. Pricing in `docs/PSA_PRICING.md`. Master context in `docs/CLAUDE.md`.
