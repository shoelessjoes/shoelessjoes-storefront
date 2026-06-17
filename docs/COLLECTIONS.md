# Shoeless Joe's — Collections & Tag Mapping

> Durable reference for the storefront's smart collections, the tag logic that populates them, and the
> navigation structure. Distilled from the May 2026 product re-org (session-recap prose removed; this is
> the reference version). Product-level spec lives in `GRADED_CARDS.md`.

**Store:** `qebynk-b0.myshopify.com` (public: shoelessjoescards.com)

---

## How collections are populated

Each of the 15 category collections is a **smart collection** using **AND logic**: a product appears only
when it has **both** a category tag (e.g. `Sealed Baseball`) **and** the `In-Stock` tag. Sort order:
`CREATED_DESC` (newest first). Products auto-add when they gain both tags and auto-remove when either is lost.

```
appliedDisjunctively: false   (AND logic)
Rules:
  1. TAG EQUALS "{Category Tag}"   (e.g. "Sealed Baseball")
  2. TAG EQUALS "In-Stock"
Sort: CREATED_DESC
```

---

## Smart collections

### Sealed

| Collection | Handle | GID | Products* |
|---|---|---|---|
| Sealed Baseball Wax | `sealed-baseball-wax` | `gid://shopify/Collection/306262278209` | 42 |
| Sealed Football Wax | `sealed-football-wax` | `gid://shopify/Collection/306262310977` | 39 |
| Sealed Entertainment Wax | `sealed-entertainment-wax` | `gid://shopify/Collection/306262442049` | 47 |
| Sealed Soccer Wax | `sealed-soccer-wax` | `gid://shopify/Collection/306262409281` | 28 |
| Sealed Pokemon Wax | `sealed-pokemon-wax` | `gid://shopify/Collection/306262474817` | 27 |
| Sealed Basketball Wax | `sealed-basketball-wax` | `gid://shopify/Collection/306262376513` | 15 |
| Sealed Hockey Wax | `sealed-hockey-wax` | `gid://shopify/Collection/306262343745` | 10 |
| Sealed TCG Wax | `sealed-tcg-wax` | `gid://shopify/Collection/306262507585` | 5 |

### Graded

| Collection | Handle | GID | Products* |
|---|---|---|---|
| Graded Pokemon Cards | `graded-pokemon-cards` | `gid://shopify/Collection/306262671425` | 99 |
| Graded Baseball Cards | `graded-baseball-cards` | `gid://shopify/Collection/306262540353` | 82 |
| Graded Football Cards | `graded-football-cards` | `gid://shopify/Collection/306262573121` | 68 |
| Graded Basketball Cards | `graded-basketball-cards` | `gid://shopify/Collection/306262638657` | 55 |
| Graded Entertainment Cards | `graded-entertainment-cards` | `gid://shopify/Collection/306262704193` | 18 |
| Graded Hockey Cards | `graded-hockey-cards` | `gid://shopify/Collection/306262605889` | 1 |
| Graded TCG Cards | `graded-tcg-cards` | `gid://shopify/Collection/306262736961` | 0 |

### Pre-existing (not modified by the re-org)

| Collection | Handle | GID | Notes |
|---|---|---|---|
| Graded Cards (all) | `graded-cards` | `gid://shopify/Collection/305798250561` | `productType` rules (OR logic), ~334 products |
| Sealed Cases | `sealed-cases` | `gid://shopify/Collection/296316600385` | `TAG=Case` rule |

\* Counts are as of the May 2026 re-org and drift with inventory; treat as approximate.

---

## Tag mapping logic

Every in-stock product also receives the `In-Stock` tag (required by every smart collection above).

### Graded cards → mapped by `productType`

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

**No dedicated collection:** Graded Soccer Card, Graded Multi-Sport Card.

### Sealed products → mapped by title keywords

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

**Skipped product types** (get `In-Stock` only, no sport tag): Supplies, Display Case, Clothing, T-Shirt, Toolkit, Gaming Deck Boxes, Repack.

**No collection exists for:** Racing/NASCAR/F1, Golf, Tennis, Boxing, Bowling.

---

## Bulk tagging via Matrixify

- **CSV format:** `Handle, Tags Command, Tags`
- **Tags Command:** `MERGE` — adds tags **without removing** existing ones (safe for bulk runs)
- Reference run: 653-row CSV, job #678149337 → 647 updated, 6 failed (handles no longer in Shopify)

---

## Navigation structure (current)

Build on the **unpublished** theme: Online Store → Navigation → Main Menu.

> Note: Shopify menus are **store-global** — menu edits go live on the published store immediately,
> they are not scoped to the dev theme.

**Sealed Wax** (parent → `#`)
- Baseball → `/collections/sealed-baseball-wax`
- Football → `/collections/sealed-football-wax`
- Basketball → `/collections/sealed-basketball-wax`
- Hockey → `/collections/sealed-hockey-wax`
- Soccer → `/collections/sealed-soccer-wax`
- Entertainment → `/collections/sealed-entertainment-wax`
- Pokemon → `/collections/sealed-pokemon-wax`
- TCG → `/collections/sealed-tcg-wax`

**Graded Cards** (parent → `/collections/graded-cards`)
- Baseball → `/collections/graded-baseball-cards`
- Football → `/collections/graded-football-cards`
- Basketball → `/collections/graded-basketball-cards`
- Hockey → `/collections/graded-hockey-cards`
- Pokemon → `/collections/graded-pokemon-cards`
- Entertainment → `/collections/graded-entertainment-cards`
- TCG → `/collections/graded-tcg-cards`

> `menuUpdate` requires reconstructing the **complete** items array (all existing items with their
> original IDs) — omitting any item removes it.

---

## Open items

- **In-Stock tag lifecycle automation** — add/remove `In-Stock` as inventory changes (Shopify Flow on
  inventory-quantity change, or a scheduled Matrixify reconcile).
- **Tag out-of-stock products** with category tags too, so they auto-populate when restocked (re-run the
  same Matrixify approach against all products, not just in-stock). Lower priority.
- **Graded image backfill** — ~335 graded products still lack media (see `GRADED_CARDS.md`).
