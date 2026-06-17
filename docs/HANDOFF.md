# Shoeless Joe's — Storefront Handoff & Status

**Last updated:** 2026-06-16. Use this to bring a fresh chat up to speed on the **storefront** repo.
For the cross-repo overview, canonical IDs, and shared gotchas, read **`SHOELESS_JOES_MASTER.md`** first.

---

## The business (quick reference)

**Shoeless Joe's Cards & Collectibles** — sports cards & collectibles shop.
- **Address:** 6123 Bridgetown Rd, **Cincinnati, OH 45248** (not Lima)
- **Owners:** brothers Kevin & Dan Burke (2025–present). Founded 1992; Tom Huber era 1997–2025.
- **Public site:** shoelessjoescards.com · **myshopify:** `qebynk-b0.myshopify.com` · **Location ID:** 72115847233
- **PSA Authorized Grading Agent; Official Topps + Panini dealer.**

Full content (hours, About, history, social) is in [`CONTENT.md`](CONTENT.md).

---

## Storefront repo — what's DONE

- **Repo scaffold** — full Ignite theme (v2.5.2 by Benchmark Themes) + `docs/`, `apps-script/`, `scripts/`, `brand-assets/`. Theme files at root (Shopify convention).
- **Brand foundation:**
  - Logo files in `assets/` (`logo.png` transparent, `logo-on-navy.jpg`). True SVG from the designer is still a to-do.
  - Fonts: Empera = logo only. Site display = **Bebas Neue**, body = Roboto, mono = Roboto Mono. Loaded via Google Fonts + overridden in `assets/shoeless-brand.css`.
  - Color schemes: Brand Cream (default), Brand Navy, Brand Gold added to `config/settings_data.json`.
- **PSA submission form** (`assets/ShoelessJoes_PSA_ShopifyAsset.html`) — fully updated:
  - Pricing: PSA base + **$2/card markup**, new turnaround times, PSA Dual pricing confirmed (see `PSA_PRICING.md`).
  - **Weekly vs Monthly cadence gate** as the first choice; Weekly hides Value Bulk; tags `psa-weekly`/`psa-monthly`.
  - Add-ons: **$2 Prep/Entry**, **$3 Review** (per card, independent).
  - Shipping removed — "invoiced on return" language instead.
  - Mounted via `sections/psa-grading-form.liquid` + `templates/page.psa-form.json`.
- **Apps Script** (`apps-script/psa-grading/Code.gs`) — builds the Shopify order server-side, logs to Google Sheet (Submissions + Orders tabs, with a **Run** column), sends confirmation email.
  - **Token is server-side only** (Script Property `SHOPIFY_TOKEN`) — never in the form asset.
  - Sheet ID: `1iscPzIuOFCgRQckDH6qERrBsQD4VTpooEbVVy-KPMVw` (reused, cleared).
- **Connection verified:** test order #7670 created successfully via the Apps Script.
- **Product re-org / collections** — 15 smart collections built, ~647 in-stock products bulk-tagged via Matrixify, collections live. Full reference (GIDs, handles, counts, tag-mapping) in [`COLLECTIONS.md`](COLLECTIONS.md).

---

## Storefront repo — what's PENDING

1. **Homepage build** — the biggest gap. A standalone mockup the owner liked (`shoelessjoes-homepage-mockup.html`) was **never implemented into the theme**. Needs `index.json` assembled from Ignite sections: hero (shop photo) → brand marquee → Sealed Wax tiles → interior gallery → before/after renovation → grading CTA. Vending machines + mystery slabs go on their **own pages**, not the homepage.
2. **Header/footer chrome** — navy sticky nav with logo + dropdowns; navy footer with shop links, Cincinnati hours, newsletter signup, PSA authorization line. Wire the nav menu (structure in `COLLECTIONS.md`) into the new theme header.
3. **Apply brand color schemes** to sections (some sections still use Ignite demo schemes).
4. **Wire logo into header**; get SVG logo from designer.
5. **Form go-live** — paste real `APPS_SCRIPT_URL` into form CONFIG, package theme, upload, create the PSA page, full end-to-end test (tag + add-ons + sheet + email).
6. **Graded-card product page template** — replicate a competitor's layout/modals (owner to provide reference URL).
7. **Pricing brochure** — align the printable PDF with current theme styling **and** current pricing (`PSA_PRICING.md`). The old print brochure used pre-revision add-on amounts.
8. **Other grader forms** — BGS/SGC/TAG (PSA done; others stubbed). Need pricing.
9. **Pages:** About (story in `CONTENT.md`), Contact, FAQ, vending location pages.
10. **Reference sites:** medcitysportscards.com (homepage feel), hobbycardshop.com (shopping structure).

> **Superseded:** an earlier note mentioned a "152-product graded import" and a different nav structure
> (Vending Machines / Grading Services / "Credit Cards — unclarified"). Both are stale. The live graded
> set is ~334 products across the collections in `COLLECTIONS.md`, and the current nav structure is the
> Sealed Wax / Graded Cards dropdown set documented there.

---

## Storefront gotchas (theme-specific)

- **myshopify domain is `qebynk-b0.myshopify.com`** — not derived from the public domain; not `shoelessjoescards.myshopify.com` (that doesn't exist).
- **Shopify token stays server-side** in Apps Script Script Properties. Never in the form asset (it's a public theme file). An old token leaked this way and was rotated.
- **PowerShell `Compress-Archive` writes backslash zip paths** Shopify rejects ("missing layout/theme.liquid"). The fixed `scripts/package-theme.ps1` forces forward slashes. Or zip the 8 theme folders via Windows Explorer.
- **Repo → Shopify is one-directional.** Package from repo, upload to Shopify. Never paste theme/export zips back into the repo (this caused a 452-file mess). `.gitignore` ignores all `*.zip`.
- **Two-machine workflow:** pull before starting, commit+push before leaving. Clone path: `C:\Users\burke\Git2\`.
- **Theme work targets the unpublished theme,** not the live one, until ready to publish.

---

## Deploy quick-reference

**Theme:** `.\scripts\package-theme.ps1` → upload zip in Shopify Admin → Themes → preview → publish.
**Apps Script:** paste `Code.gs` → set `SHOPIFY_TOKEN` Script Property → Deploy → New version → copy `/exec` URL → paste into form CONFIG `APPS_SCRIPT_URL`.

Full details in [`DEPLOYMENT.md`](DEPLOYMENT.md). Brand spec in [`BRAND.md`](BRAND.md). Pricing in [`PSA_PRICING.md`](PSA_PRICING.md). Master context in [`CLAUDE.md`](CLAUDE.md).
