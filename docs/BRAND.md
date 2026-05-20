# Brand Standards

Visual and voice guidelines for Shoeless Joe's Cards & Collectibles.

---

## Colors

### Primary palette

| Name | Hex | Use |
|---|---|---|
| Navy | `#173B4E` | Primary text, headers, dark surfaces |
| Navy Dark | `#0E2535` | Hover states, deep backgrounds |
| Gold | `#DDA852` | Accents, calls-to-action, highlights |
| Cream | `#F5EEDC` | Section backgrounds, warm neutrals |

### Secondary / accent

| Name | Hex | Use |
|---|---|---|
| Sport Red | `#C70F0F` | Discount badges, urgency tags |
| Card Blue | `#0454A5` | Secondary CTAs (links, "View more") |
| Charcoal | `#121212` | Body text on light backgrounds |

### Inside the Ignite theme

The theme ships with 13 default color schemes plus one custom scheme that matches our palette. The custom scheme (id: `scheme-1203590d-2999-412a-986f-d063dd6d00f1` in `config/settings_data.json`) is configured with:

- Background: `#F5EEDC` (Cream)
- Background accent: `#DDA852` (Gold)
- Text: `#173B4E` (Navy)
- Button label: `#FFFFFF`

Use this as the primary scheme. Standard schemes 1, 5, and 7 (white, blue, red) are for specific accent sections.

---

## Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / Headings | **Bebas Neue** | 400 | All-caps look, condensed, used for hero/section titles |
| Body | **Roboto** | 400 / 500 / 700 | Body text, UI labels, paragraphs |
| Mono | **Roboto Mono** | 400 | Code, IDs, cert numbers, technical readouts |

### Setting fonts in the theme

The Ignite theme defaults to **Francois One** for headings. To switch to Bebas Neue:

1. Open `config/settings_data.json`
2. Find `"type_header_font"` and change from `francois_one_n4` to `bebas_neue_n4`
3. Find `"type_body_font"` and set to `roboto_n4`

**Do not use:** DM Sans, DM Mono (deprecated, replaced mid-project).

---

## Voice

| Trait | Yes | No |
|---|---|---|
| Tone | Friendly, knowledgeable, collector-to-collector | Salesy, formal, corporate |
| POV | "We" — family-owned, local | "Shoeless Joe's offers..." (third person) |
| Trust signals | Est. 1992, PSA Authorized, brick-and-mortar | "World-class", "premier" filler |

**Sample phrasing:**

> "We're collectors too. From vintage stars to modern rookies, Pokémon hits, and sealed hobby boxes — we've got something for every budget and every collection."

> "PSA Authorized Grading Agent. Drop off in store or ship to us."

---

## Logo

Logo files live in the theme under `assets/`. Always present on a light or navy background. Avoid placing on the gold accent at small sizes — contrast suffers.

---

## Buttons

- Primary CTA: Navy background, white text, gold hover
- Secondary CTA: Cream background, navy text, navy outline
- Destructive: Sport Red, white text (use rarely — typically only "Remove" or "Cancel order")
- Border radius: 8px on standard buttons, 26px on hero/pill CTAs (Ignite default)

---

## Spacing & Layout

- Max page width: 1440px
- Standard section padding: 56px vertical (mobile: 32px)
- Card border radius: 12px
- Grid gap: 16px (mobile: 8px)
