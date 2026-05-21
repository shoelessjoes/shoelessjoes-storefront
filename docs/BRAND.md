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

The theme ships with 13 demo color schemes plus **three brand schemes** we've configured in `config/settings_data.json`. Use these when building sections:

| Scheme name | Background | Text | Buttons | Use for |
|---|---|---|---|---|
| **Brand Cream** (`scheme-1203590d-…`) | Cream `#F5EEDC` | Navy `#173B4E` | Navy | Default — most sections, light content areas |
| **Brand Navy** (`scheme-sj-navy`) | Navy `#173B4E` | Cream `#F5EEDC` | Gold | Footer, hero overlays, feature/testimonial bands |
| **Brand Gold** (`scheme-sj-gold`) | Gold `#DDA852` | Navy `#173B4E` | Navy | CTA bands, promo strips, "submit your cards" calls |

Assign these per-section in the theme editor (each section has a Color scheme dropdown). The demo schemes (1–13) can be ignored or deleted once the site is fully on brand.

---

## Typography

| Role | Font | Where | Notes |
|---|---|---|---|
| **Logo** | **Empera** / Empera Soft | Logo image only | Paid/licensed font, per official brand guidelines. Baked into the logo image files — the website never renders Empera as live text. |
| Display / Headings | **Bebas Neue** | Site headings | Web substitute for Empera. Condensed, athletic, all-caps. Free (Google Fonts). |
| Body | **Roboto** | Body, UI, paragraphs | Free (Google Fonts). Weights 300/400/500/700. |
| Mono | **Roboto Mono** | Cert numbers, IDs, technical readouts | Free (Google Fonts). |

### Why Empera isn't on the website

Empera is the official brand font (it's the "SHOELESS / JOE'S" wordmark in the logo). It's licensed for the logo, but **not loaded as a web font** — instead the logo lives as an image, and the site's heading text uses **Bebas Neue** as a stylistically-aligned, freely-licensed substitute. This decision was made deliberately: it keeps the brand mark exact while avoiding per-page web-font licensing.

### How fonts are wired in the theme

Bebas Neue isn't in Shopify's native font library, so we don't set it in the theme's font picker. Instead:

1. `layout/theme.liquid` loads Bebas Neue + Roboto + Roboto Mono from Google Fonts (just before `</head>`).
2. `assets/shoeless-brand.css` overrides `--font-heading-family` → Bebas Neue and `--font-body-family` → Roboto, and is loaded last so it wins.

To change fonts later, edit `assets/shoeless-brand.css`, not the theme settings.

**Do not use:** DM Sans, DM Mono (deprecated, replaced mid-project).

### Licensed font files

The licensed Empera files live in `assets/` for safekeeping/versioning (they aren't referenced by any CSS). The official brand guidelines PDF (56 MB) is **not** committed — it's stored in 1Password/Drive. See the brand guidelines for the pattern graphic and full logo lockup variants.

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

Logo files in `assets/`:

| File | Format | Use |
|---|---|---|
| `logo.png` | Transparent PNG (1128×763) | Primary — header, anywhere on cream/light/navy |
| `logo-on-navy.jpg` | JPEG on navy | When you want the solid navy badge block on a light section |

**Action item:** the current `logo.png` is an interim transparent version created by knocking the black background out of a supplied JPEG. It's clean, but for crisp scaling at all sizes we want the **vector SVG** (or a true high-res transparent PNG) from the designer's Illustrator source. Request and drop into `assets/logo.svg` when available, then update the header to prefer it.

Logo lockup variants available in the brand guidelines (not yet exported as files): full shield badge, horizontal text-only lockup, and compact icon variants in cream/gold/navy/black.

Always present on a light, cream, or navy background. The gold-bordered badge reads well on all three.

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
