# Shoeless Joe's Cards & Collectibles — Product Re-Org Recap
## Session: May 28, 2026

**Store:** shoelessjoescards.myshopify.com

---

## What Was Done

### 1. Created 15 Smart Collections via Claude Code Agent
A previous Claude Code session created 15 smart collections on the store. Each uses AND logic requiring both a **category tag** (e.g., "Sealed Baseball") and an **"In-Stock" tag** to include products. Sort order: CREATED_DESC (newest first).

### 2. Bulk-Tagged 647 Products via Matrixify Import
Built a Python script (`build_csv.py`) that generated a CSV with all ~653 in-stock products mapped to category tags. Imported via Matrixify (Job #678149337) using **MERGE** command (adds tags without removing existing ones).

**Result:** 647 updated, 6 failed (handles no longer exist in Shopify)

### 3. All 15 Collections Are Now Populated and Live

**Sealed Collections:**

| Collection | Handle | GID | Products |
|---|---|---|---|
| Sealed Baseball Wax | `sealed-baseball-wax` | `gid://shopify/Collection/306262278209` | 42 |
| Sealed Football Wax | `sealed-football-wax` | `gid://shopify/Collection/306262310977` | 39 |
| Sealed Entertainment Wax | `sealed-entertainment-wax` | `gid://shopify/Collection/306262442049` | 47 |
| Sealed Soccer Wax | `sealed-soccer-wax` | `gid://shopify/Collection/306262409281` | 28 |
| Sealed Pokemon Wax | `sealed-pokemon-wax` | `gid://shopify/Collection/306262474817` | 27 |
| Sealed Basketball Wax | `sealed-basketball-wax` | `gid://shopify/Collection/306262376513` | 15 |
| Sealed Hockey Wax | `sealed-hockey-wax` | `gid://shopify/Collection/306262343745` | 10 |
| Sealed TCG Wax | `sealed-tcg-wax` | `gid://shopify/Collection/306262507585` | 5 |

**Graded Collections:**

| Collection | Handle | GID | Products |
|---|---|---|---|
| Graded Pokemon Cards | `graded-pokemon-cards` | `gid://shopify/Collection/306262671425` | 99 |
| Graded Baseball Cards | `graded-baseball-cards` | `gid://shopify/Collection/306262540353` | 82 |
| Graded Football Cards | `graded-football-cards` | `gid://shopify/Collection/306262573121` | 68 |
| Graded Basketball Cards | `graded-basketball-cards` | `gid://shopify/Collection/306262638657` | 55 |
| Graded Entertainment Cards | `graded-entertainment-cards` | `gid://shopify/Collection/306262704193` | 18 |
| Graded Hockey Cards | `graded-hockey-cards` | `gid://shopify/Collection/306262605889` | 1 |
| Graded TCG Cards | `graded-tcg-cards` | `gid://shopify/Collection/306262736961` | 0 |

**Pre-existing Collections (not modified):**

| Collection | Handle | GID | Notes |
|---|---|---|---|
| Graded Cards (all) | `graded-cards` | `gid://shopify/Collection/305798250561` | Uses productType rules (OR logic), 334 products |
| Sealed Cases | `sealed-cases` | `gid://shopify/Collection/296316600385` | Uses TAG=Case rule |

---

## Tag Mapping Logic

### Graded Cards → Mapped by `productType` field
| Product Type | Tag Applied |
|---|---|
| Graded Baseball Card | Graded Baseball |
| Graded Football Card | Graded Football |
| Graded Basketball Card | Graded Basketball |
| Graded Hockey Card | Graded Hockey |
| Graded Pokemon Card | Graded Pokemon |
| Graded Entertainment Card | Graded Entertainment |
| Graded Pop Culture Card | Graded Entertainment |
| Graded Disney Card | Graded Entertainment |

**Not mapped to collections** (no dedicated collection): Graded Soccer Card, Graded Multi-Sport Card

### Sealed Products → Mapped by title keywords
| Keywords Checked | Tag Applied |
|---|---|
| Premier League, UEFA, FIFA, MLS, NWSL, La Liga, Bundesliga, USWNT, Soccer | Sealed Soccer |
| Pokemon, Pokémon | Sealed Pokemon |
| One Piece, Magic the Gathering | Sealed TCG |
| WWE, Wrestling, Disney, Star Wars, Spongebob, Marvel, Batman, Superman, X-Men, Minecraft, Squishmallows, Invincible, Stranger Things, Pixar, Dune, Fantastic Four, Captain America, Deadpool, Rolling Stones, Pop Century, UFC, DC Annual, Sapphire Edition Wrestling | Sealed Entertainment |
| Hockey | Sealed Hockey |
| Basketball, WNBA | Sealed Basketball |
| Football, NFL, Ohio State | Sealed Football |
| Baseball, Bowman Chrome, Bowman Draft, Allen & Ginter, Topps Complete Set, Topps Heritage, Topps Update, Topps Archives, Topps Stadium Club, Topps Five Star, Topps Gilded, Bo Jackson Battle Arena, Ball Star Fusion, USA Stars | Sealed Baseball |

**Skipped product types** (no sport tag, just In-Stock): Supplies, Display Case, Clothing, T-Shirt, Toolkit, Gaming Deck Boxes, Repack

**No collection exists for:** Racing/NASCAR/F1, Golf, Tennis, Boxing, Bowling

### Every in-stock product also received the `In-Stock` tag

---

## Matrixify Import Details
- **CSV Format:** `Handle, Tags Command, Tags`
- **Tags Command:** `MERGE` — adds tags without removing existing ones
- **Job ID:** 678149337
- **File:** products.csv (54KB, 653 rows)

---

## Smart Collection Rule Structure
Each of the 15 new collections uses:
```
appliedDisjunctively: false (AND logic)
Rules:
  1. TAG EQUALS "{Category Tag}"  (e.g., "Sealed Baseball")
  2. TAG EQUALS "In-Stock"
Sort: CREATED_DESC
```

This means products auto-populate when they have BOTH tags, and auto-remove when either tag is removed.

---

## What Still Needs To Be Done

### Navigation Menu (Manual — 2 min in Shopify Admin)
Go to: **Online Store → Navigation → Main Menu** (on the NEW unpublished theme)

Add two dropdown parents with nested children:

**Sealed Wax** (parent, link to `#`)
- Baseball → `/collections/sealed-baseball-wax`
- Football → `/collections/sealed-football-wax`
- Basketball → `/collections/sealed-basketball-wax`
- Hockey → `/collections/sealed-hockey-wax`
- Soccer → `/collections/sealed-soccer-wax`
- Entertainment → `/collections/sealed-entertainment-wax`
- Pokemon → `/collections/sealed-pokemon-wax`
- TCG → `/collections/sealed-tcg-wax`

**Graded Cards** (parent, link to `/collections/graded-cards`)
- Baseball → `/collections/graded-baseball-cards`
- Football → `/collections/graded-football-cards`
- Basketball → `/collections/graded-basketball-cards`
- Hockey → `/collections/graded-hockey-cards`
- Pokemon → `/collections/graded-pokemon-cards`
- Entertainment → `/collections/graded-entertainment-cards`
- TCG → `/collections/graded-tcg-cards`

### Tag Out-of-Stock Products (Lower Priority)
Current tags only cover in-stock products. Out-of-stock products should also get category tags so they auto-populate collections when restocked. Can re-run the same Matrixify approach against all products (not just in-stock).

### In-Stock Tag Lifecycle Automation
Need a mechanism to add/remove the "In-Stock" tag as inventory changes. Options:
- **Shopify Flow:** Trigger on inventory quantity change → add/remove "In-Stock" tag
- **Scheduled Matrixify job:** Periodic export + re-import to reconcile

### Graded Card Product Page Template
Kevin wants to replicate the layout/modals from a competitor's Shopify-based graded card product page. Needs to send an example URL to analyze and build a custom template on the new (unpublished) theme.

---

## Technical Notes
- **Shopify product SKU format for graded cards:** YYYYMMDD + cost with decimal stripped. Example: acquired May 17, 2026 for $100 → `20260517100`. $49.99 → `202605174999`.
- **Matrixify CSV MERGE:** adds tags without removing existing ones — safe for bulk operations
- **GraphQL pagination quirk:** parameterized cursor variables failed during schema exploration; inline cursor strings worked
- **All theme/layout work should be done on the unpublished paid theme**, not the current live theme
