# Shoeless Joe's — Graded Card Operations & Import Spec

> Graded-card product spec for the storefront / Shopify catalog: product structure, title format,
> metafields, SKU, and the import workflows that feed them. For the cross-repo picture see
> `SHOELESS_JOES_MASTER.md`; for collection membership/tagging see `COLLECTIONS.md`.
>
> _(Formerly `project-instructions-main.md`.)_

---

## Shopify Store Configuration

**Vendor name:** `Shoeless Joe's`

**Product Types in use:**
- Graded Baseball Card
- Graded Basketball Card
- Graded Football Card
- Graded Hockey Card
- Graded Soccer Card
- Graded Pokemon Card
- Graded Pop Culture Card
- Graded Entertainment Card
- Graded Multi-Sport Card

**Product title format:**
`{Year} {Set} {Player Name} {Variation} #{Card Number} {Grader} {Grade}`

Example: `2022 Bowman Draft Chrome Draft Pick Autographs Sal Stewart Blue Refractor #CDASS PSA 10`

For dual-cert autos (separate card and auto grade): `PSA 9/10` format at the end.

**Custom metafields:**
| Field | Metafield key |
|---|---|
| Card grade | `product.metafields.custom.card_grade` |
| Certification link | `product.metafields.custom.certification_link` |
| Certification number | `product.metafields.custom.certification_number` |
| Date acquired | `product.metafields.custom.date_acquired` |

Certification numbers are stored with a leading apostrophe (e.g. `'145531087`) to prevent Excel from stripping leading zeros.

**Certification link formats by grader:**
- PSA: `https://www.psacard.com/cert/{certNum}`
- BGS: `https://www.beckett.com/gradingsubmission/pop/{certNum padded to 11 digits}`
- SGC: `https://www.sgccard.com/cert/{certNum}`
- CGC: `https://www.cgccards.com/certlookup/{certNum}`
- TAG: `https://taggradingcard.com`

**SKU format:**
`{YYYYMMDD}{cost}` — date acquired concatenated with whole-dollar cost, no separators, no decimals.

Example: Card acquired May 17 2026 for $100 → `20260517100`
Example: Card acquired May 28 2026 for $49 → `2026052849`
Costs are always whole dollar amounts, never decimals.

**Standard product defaults for graded cards:**
- Published: `FALSE`
- Status: `active`
- Variant Inventory Qty: `1`
- Variant Inventory Policy: `deny`
- Variant Inventory Tracker: `shopify`
- Variant Fulfillment Service: `manual`
- Variant Taxable: `FALSE`
- Variant Grams: `0`
- Variant Weight Unit: `oz`
- Option1 Name: `Title` / Option1 Value: `Default Title`
- Gift Card: `FALSE`
- Included / United States: `TRUE`
- Google Shopping / Google Product Category: `6997`

**Tags format:** Alphabetically sorted, comma-space separated.
Examples: `Baseball, Graded, PSA` / `Graded, Pokemon, PSA` / `Football, Graded, SGC`
(Category + In-Stock tags that drive smart collections are documented in `COLLECTIONS.md`.)

**Product Category (Shopify taxonomy):**
- Sports cards (Baseball, Basketball, Football, Hockey, Soccer, Multi-Sport): `Arts & Entertainment > Hobbies & Creative Arts > Collectibles > Collectible Trading Cards > Sports Trading Cards`
- Pokemon, Entertainment, Pop Culture: `Arts & Entertainment > Hobbies & Creative Arts > Collectibles > Collectible Trading Cards > Entertainment Cards`

---

## Graded Card Import Workflows

### PSA Order Return CSV
When PSA returns a graded order, a CSV can be downloaded from psacard.com with these columns:
`Cert #, Type, Description, Grade, After Service, Images`

Grade values are text like `GEM MINT 10`, `MINT 9`, `NEAR MINT-MINT 8`, `EXCELLENT 5`. Extract the trailing number for the numeric grade.

**Important:** PSA orders contain a mix of Kevin's own cards and customer cards submitted through the shop. Only Kevin's own cards get imported to Shopify. The workflow requires reviewing the full order list and selecting only shop-owned cards before pushing.

### PSA My Collection CSV
PSA also exports a collection CSV with columns:
`Item Status, Item, Cert Number, Grade Issuer, Grade, Autograph Grade, Year, Set, Card Number, Subject, Variety, Serial, Category, My Cost, PSA Estimate, Gain/Loss, My Value, Date Acquired, ...`

This maps directly to Shopify product fields.

### PSA Public API
Endpoint: `https://api.psacard.com/publicapi/cert/GetByCertNumber/{certNum}`
Image endpoint: `https://api.psacard.com/publicapi/cert/GetImagesByCertNumber/{certNum}`
Auth: Bearer token in Authorization header.

API response key fields: `Year`, `Brand` (set), `Category` (sport), `CardNumber`, `Subject` (player), `Variety`, `GradeDescription`, `CardGrade`, `AutographGrade`, `IsDualCert`, `TotalPopulation`, `PopulationHigher`.

Cards graded after October 2021 have front/back images available via the image endpoint.

### Card Import Tool (GitHub)
A standalone HTML tool has been built and is hosted at:
`shoelessjoes.github.io/sj-card-tool`

It has two modes:
- **PSA Order tab:** Upload PSA order CSV → click rows to select shop-owned cards → enter cost and date → push to Shopify
- **Quick Add tab:** For trade-ins and purchased cards — select grader, enter cert #, PSA auto-lookup, manual form for other graders, create Shopify draft

**Current limitation:** The tool's Shopify push functionality requires a Cloudflare Worker proxy (in progress). At present, Shopify operations are handled directly through Claude.ai chat using the connected Shopify MCP.

> **Known gap:** ~335 bulk-imported graded products have no media. The `sj-card-tool` handles PSA image
> fetching for *new* cards; the open item is a one-time backfill for that initial batch. PSA blocks
> direct browser/datacenter requests (CORS/Cloudflare) — use the existing `sj-card-tool` proxy as the
> fallback image source.

### Other Collection CSV Formats
The shop also works with:
- **Card Ladder exports** — 16-column format with investment/value tracking
- **Third-party tracking site template** — 13-column format: `Sport, Grade, Player Name, Year, Set, Variation, Card Number, Specific Qualifier, Quantity, Date Purchased, Purchase Price per Card, Notes, Category`

When converting between formats, cert numbers go in the Notes column, serial numbers (like /76) go in Specific Qualifier.

---

## Print Forms & Brochures

Three HTML files are used as print documents for PSA submission services:
1. PSA submission form (per-card checkbox options)
2. Pricing brochure
3. (Third form TBD)

**Redesign conventions established:**
- No header/hero sections — removed for print efficiency
- Larger text sizes for print readability
- Per-card add-on checkboxes on every card row: **Prep/Entry** and **Review**
  - **Amounts must match the web form. See `PSA_PRICING.md` — currently $2 Prep/Entry and $3 Review (independent; both = $5).**
  - ⚠️ The earlier "$3 Prep / $5 Review/Prep" figures predate the May 2026 pricing revision (which moved from a $5 markup to a $2 markup). Do not reuse them — regenerate the brochure against `PSA_PRICING.md`.
- SlabShield Coverage and SlabNotify Alerts retained as standalone add-on services

When working on these files: output to `/mnt/user-data/outputs/`, preserve embedded base64 logo images from source files.

---

## Planned: Grading Submission Tracking App

Kevin is planning to build a full grading submission tracking application embedded within Shopify. This will handle the full lifecycle of customer card submissions — intake, submission to PSA, return, and customer notification. The card import tool (above) will eventually be part of this larger system.

---

## General Working Notes

- Always use `Shoeless Joe's` as vendor (not the full business name)
- When generating Shopify import CSVs, match the exact column order from the reference export
- SKU is printed on a barcode label placed on the back of each graded card slab
- When sport cannot be determined from PSA API category, detect from player/set keywords in the description
- Dual-cert cards (autos with separate card and auto grades) use `{CardGrade}/{AutoGrade}` format e.g. `PSA 9/10`; `Authentic` auto grade becomes `AUTH`
