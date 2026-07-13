# Claude Code Handoff — Dealernet → Shopify Seed & Inventory Pipeline

> **Read this first, then read** (in the repos, which you can see and I can't):
> `SHOELESS_JOES_MASTER.md` (canonical IDs + cross-repo rules), `shoelessjoes-ops/docs/AGENT_HANDOFF.md`,
> and the newest pasted ops handoff describing the **fixed** sync semantics (purchases → `InboundLine`,
> sales → draft orders **with** `shipping_address`). That fix is DONE — do not relitigate it.
>
> This doc was produced in a chat session that had the live Shopify store (via MCP) but **no repo access**.
> Every fact tagged **[VERIFIED]** was checked against the live store or against real data
> (`matches_daily.csv`). Everything tagged **[CONFIRM]** is an assumption you should check against the
> real Prisma schema before trusting.

---

## 0. What this session produced

Four TypeScript files (currently sitting in a scratch/output folder — place them as noted) plus the
architecture below. They advance master-doc priorities **#1 (shared catalog seed)** and **#6 (scan-to-receive)**.

| File | Goes to | Purpose |
|---|---|---|
| `receive-scan.ts` | `shoelessjoes-ops/apps/worker/src/jobs/` | Scan UPC → adjust Shopify inventory + weighted-avg cost. **Closes the purchase→inventory gap.** |
| `build-draft-seed.ts` | `shoelessjoes-ops/apps/worker/src/jobs/` | Read `DealernetMarketProduct` → emit Matrixify draft-products CSV (barcode = UPC). Bulk backfill. |
| `name-key.ts` | `shoelessjoes-ops/packages/core/src/` (or shared) | Normalized-nomenclature merge key bridging email-born and Dealernet-born products. |
| `dealernet-url.ts` | `shoelessjoes-ops/packages/core/src/` (or shared) | Parse `supplier_product_url` params → authoritative sport/config/year via ID maps. |

Suggested npm scripts (match the repo's `job:*` convention):
```json
"job:receive-scan":     "tsx apps/worker/src/jobs/receive-scan.ts",
"job:build-draft-seed": "tsx apps/worker/src/jobs/build-draft-seed.ts"
```

---

## 1. Canonical facts

| Item | Value | Source |
|---|---|---|
| myshopify domain | `qebynk-b0.myshopify.com` | master doc |
| Shopify location GID | `gid://shopify/Location/72115847233` ("6123 Bridgetown Road", single active location) | **[VERIFIED]** live |
| Vendor on products | `Shoeless Joe's` | master doc |
| Admin API version | `2024-10` used by storefront/Apps Script; ops worker reads `SHOPIFY_API_VERSION`. Any **2024-07+** supports `inventoryAdjustQuantities` + `referenceDocumentUri`. | master doc + **[VERIFIED]** |
| Clone root | `C:\Users\burke\Git2\` | master doc |
| Conventions | conventional commits; trunk-based on `main`; secrets in `.env`/1Password (never commit) | master doc |

### Verified Shopify mutation shapes — do not re-derive
- **Inventory receive** (`inventoryAdjustQuantities`): input `{ reason: "received", name: "available", referenceDocumentUri: "gid://shoelessjoes-ops/InboundLine/{id}", changes: [{ delta, inventoryItemId, locationId }] }`. Receives are **additive**, so `changeFromQuantity` (compare-and-swap) is intentionally omitted — a concurrent POS sale can't corrupt an additive delta. **[VERIFIED]**
- **Cost write** (`inventoryItemUpdate(id, input: { cost })`): `cost` is a Decimal string, e.g. `"12.34"`. `InventoryItemInput.cost` exists. **[VERIFIED]**
- **Variant → inventory item + on-hand + current cost**, one round trip:
  `productVariant(id){ inventoryItem { id tracked unitCost { amount } inventoryLevel(locationId: $loc){ quantities(names:["on_hand"]){ quantity } } } }` **[VERIFIED]**

---

## 2. The architecture we locked

**Two sources of truth, joined on a name key, converging on UPC.**

```
Birth event A: Dealernet category row   ──┐   has UPC + release + price + sport(category)
Birth event B: preorder / vendor email  ──┘   name only, NO UPC yet
                     │
                     ▼   compute name_key (sport INJECTED from context, not title)
         ┌───────────────────────────────┐
         │  match on name_key             │
         │  found (email-born)? backfill  │──► one Shopify DRAFT product (barcode=UPC when known)
         │  UPC + release + price onto it │
         │  not found? productCreate      │
         └───────────────────────────────┘
                     │
        Dealernet purchase matches UPC ──► sync-offers writes InboundLine
                     │
        scan UPC (receive-scan) ──► inventoryAdjustQuantities (+delta) + weighted-avg cost
                     │
        stock > 0 ──► In-Stock lifecycle (Flow / Matrixify) flips draft → sellable
```

Locked decisions:
- **UPC spine = Dealernet (primary) + DA Card World presells.** WaxStat is the release-calendar / market-price / clean-naming layer — **not** a UPC source.
- **Sport comes from the Dealernet `categoryid`, never guessed from the title.** ("Bowman University **Football**" breaks title-regex on the word "Bowman"; the category id doesn't.)
- **Cost = weighted moving average**, computed at receive. Shopify stores one cost per item (no layers), so WAC is both the accurate model and the only one that fits without a parallel ledger. `new = (on_hand·cur + recv·buy)/(on_hand+recv)`; first units or null cost → just `buy`.
- **Preorder is a flag + future release_date on an otherwise-identical draft.** No separate seeding path.
- **Case → box (1 case = N boxes) is intentionally deferred.** When wanted it's a kit/BOM in the ops layer (opening a case decrements the case, +N to the box variant via the same `inventoryAdjustQuantities` path). Nothing in the current design blocks it.

---

## 3. The four files — what to confirm against the real schema

I wrote these self-contained (each has its own `PrismaClient` + a minimal Admin `fetch` using
`SHOPIFY_SHOP_DOMAIN` / `SHOPIFY_ACCESS_TOKEN` / `SHOPIFY_API_VERSION`). **First task: refactor them onto
the repo's shared `@shoelessjoes/db` client and the `packages/core` Shopify client**, and verify these
field names, which are all isolated to a clearly-marked block at the top of each file:

**`InboundLine`** (used by `receive-scan.ts`) — assumed fields **[CONFIRM]**:
`upc, qtyOrdered, qtyReceived, stage (plain string; "received" closes it), shopifyVariantId, offerId,
title, unitCost (per-unit purchase cost for WAC), createdAt, receivedAt (DateTime?)`.
If `receivedAt` doesn't exist, add it or delete the two lines that set it. If `stage` is a Prisma enum,
swap the `"received"` literal for the enum member.

**`DealernetMarketProduct`** (used by `build-draft-seed.ts`) — **[VERIFIED from Kevin's paste]**:
```
id String @id @default(cuid())
canonicalKey String @unique      // e.g. "upc:887521088034"
upc String?                       // NULLABLE — only rows with a UPC become drafts
title String                      // messy supplier title ("Bowman ~  Hobby")
searchQuery String?               // clean query ("2020 Bowman Baseball Hobby") — preferred for display title
supplierYear String?
highBuy Decimal? / lowSell Decimal?
productUrl String? / listingUrl String?
source String @default("search")
matchScore Float? / scrapedAt / updatedAt
```
`build-draft-seed` builds the display title from `searchQuery` (falls back to tidied `title`), runs
sport/config/brand detection on **both** fields combined, sets a deterministic Handle `sj-seed-{upc}`
(re-runs update, no dupes), and **skips UPCs already live in Shopify** (paginates variant barcodes) so it
can never flip a live product to draft.

---

## 4. Immediate build (unblocked) — new-product detection

**Problem, proven from `matches_daily.csv`:** that file is repricing-only — all 165 rows are `exact_upc`
matches that already exist in Shopify (every row has a `shopify_product_id`). supplier-py currently works
**product-by-product outward from the Shopify catalog** (the resolve cache is search-based, `source=search`),
so a brand-new Dealernet listing is invisible to it. **No unmatched-supplier rows exist → no new-product feed.**

**Build:** a **category-enumeration scraper** in `shoelessjoes-supplier-py` (Python + Playwright).
- Walk the Dealernet category tree — the same `priceguide.php?categoryid=…&subcategoryid=…&boxtypeid=…&year=…`
  pages, but **all** of them, not just those matching known Shopify products.
- Diff each row's UPC against the Shopify barcode set (or `ProductCatalog`).
- Emit the **unmatched** rows as the new-product feed (e.g. `out/new_products.csv`).
- Each unmatched row → fires `productCreate` (draft) in ops, keyed through `name-key` so it merges with any
  email-born preorder draft instead of duplicating.

**To write this against real code, one input still needed from Kevin:** the supplier-py module that already
hits `priceguide.php` (the Dealernet fetch/parse client, likely a `dealernet`/`scrape`/`client` module — see
`shoelessjoes-supplier-py/PROJECT_STATE.md`). Extend that, don't reinvent the HTTP/Playwright layer.

**Learned ID maps (from real data, [VERIFIED], extensible — unknown id falls back to title regex):**
- `categoryid` → sport: 21 Baseball · 25 Football · 23/1501 Basketball · 27 Hockey · 29/1521 Soccer ·
  1561 Pokemon · 1606 TCG · 1381 UFC · 241 Golf · 221 Racing · 141 Entertainment · 521 College.
- `boxtypeid` → config: 2/253/248/9/256 Hobby · 3/254 Blaster · 6/283 Mega · 4 Jumbo · 8 Value · 11 Hanger ·
  83 ETB · 225/281 Booster Box · 228 Booster Bundle · 1 Retail.
- `year`: `2025` (single) · `25/6`→`2025-26`, `24/5`→`2024-25` (seasons) · `""` for TCG (set-named). All handled by `dealernet-url.ts`.
- **Price columns:** `supplier_high_buy` < `supplier_low_sell` (bid vs ask); repricing treats `low_sell` as the
  market ask; `market_mid` = sensible placeholder price for a seed.

**Prisma migration to support the trigger + convergence** (add to `DealernetMarketProduct` or a catalog table):
`releaseDate DateTime?`, `category String?` (sport from the table), `nameKey String? @@index`,
`shopifyProductId String?` (link the created draft; enables UPC/release/price backfill onto email-born drafts),
`draftCreatedAt DateTime?` (fire the create-trigger once). Store `name_key` as a `custom.name_key` product
metafield too, so both the ingest and the email parser look products up the same way.

---

## 5. Downstream builds (after seeding produces data)

- **Release calendar** (Remix, `apps/web`) — filtered to Topps/Panini/Pokemon; reads the seed/catalog table
  (`releaseDate`, brand, config, market price) with a "draft exists / on order / in stock" badge.
- **Ops dashboard** (near-live, Remix) — groups `InboundLine` by stage: preorders (future `releaseDate` /
  open line pre-release), in transit (has tracking), arrived this week (`stage=received`, `receivedAt < 7d`).
  Tracking already lands via `poll-messages` + (future) vendor-email ingest, so it's query-and-render.
- **In-Stock tag lifecycle** — draft seeds carry the category tag (e.g. `Sealed Baseball`) but **not**
  `In-Stock`; add `In-Stock` at receive (Shopify Flow or scheduled Matrixify) so it joins the smart collection.

---

## 6. Guardrails (from master doc + this session)

- **Never** run `sync-offers sale --execute` without Kevin's explicit approval — it creates orders and
  decrements inventory. `receive-scan` and `build-draft-seed` default to **dry-run** (`--execute` required).
- **Matrixify bulk imports:** `Handle, Tags Command, Tags` with the `MERGE` command so existing tags survive.
- **Repo → Shopify is one-directional.** Never paste theme/export zips back into a repo.
- **Two-machine workflow:** pull before starting, commit + push before leaving.
- Secrets: `.env` gitignored; the ops worker uses a **separate** Admin token from the form's.

---

## 7. Suggested first tasks for Claude Code (in order)

1. Read `SHOELESS_JOES_MASTER.md`, `shoelessjoes-ops/docs/AGENT_HANDOFF.md`, and
   `packages/db/prisma/schema.prisma`. Confirm the `InboundLine` fields in §3.
2. Place the four files; refactor each onto the shared db + Shopify clients; add the npm scripts. Typecheck.
3. Dry-run `job:build-draft-seed` → eyeball the "no sport detected" count; wire `dealernet-url.ts` into it so
   sport/config/year come from the URL where present.
4. Write the Prisma migration in §4. `receive-scan` already expects `receivedAt`.
5. Open `shoelessjoes-supplier-py/PROJECT_STATE.md`, find the Dealernet scraper, and build the
   category-enumeration + unmatched-feed (§4). Ask Kevin to point you at the scraper module if unclear.
6. Wire the new-product trigger: unmatched feed → `name-key` lookup → backfill or `productCreate` (draft).

---

## 8. Open question for Kevin

Which supplier-py module already fetches/parses `priceguide.php`? That's the one to extend for category
enumeration. Everything else on the critical path is unblocked.
