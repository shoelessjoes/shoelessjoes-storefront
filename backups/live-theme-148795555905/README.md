# Live theme snapshot — MAIN 08-05-2026 (`148795555905`)

Captured 2026-08-22 from the **live** theme via the Shopify Admin API
(read-only), before any push was attempted.

## Why this exists

A handoff note instructed the next session to run:

```
npx shopify theme push --only templates/page.about.json --only templates/index.json --allow-live
```

**Do not run that command against the current repo contents.** The two JSON
templates in `templates/` are empty scaffolds — they declare the right
sections but carry no `settings`. The live theme holds all the real content.
Pushing the repo versions over live would have deleted:

- **`templates/page.about.json`** — the entire About page: intro copy, the
  four "era" story blocks and their images, the Burke family owner bio, the
  reopening copy, and the shop address / phone / seven-day hours.
- **`templates/index.json`** — the homepage hero image and headings, the
  "OUR PRODUCTS" brand marquee, the four gallery photos (all image
  references), the before/after renovation images, and the trailing `apps`
  section.

Shopify's theme editor has been the source of truth for these two files;
the repo never held their content.

## Before pushing either template again

1. `shopify theme pull --only templates/<file>` from the live theme, or
   restore from this snapshot.
2. Layer the intended change on top of the pulled content.
3. Diff against live and confirm nothing is dropped.

## Repo drift at capture — now resolved

| File | Repo vs live at capture | Now |
| --- | --- | --- |
| `sections/sj-about.liquid` | identical (`d1bfa02d…`) | unchanged |
| `sections/sj-homepage.liquid` | **differed** — live newer | synced from live, md5 `ab639489…` verified |
| `templates/index.json` | **differed** — empty scaffold | synced from live |
| `templates/page.about.json` | **differed** — empty scaffold | synced from live |

The single change in `sections/sj-homepage.liquid` was a schema default:
`"Est. 1992 · Lima, Ohio"` → `"Est. 1992 · Cincinnati, Ohio"`. It is only a
default (the live template sets `hero_eyebrow` explicitly), so it was not
visible on the storefront.

## Verifying a sync

`checksumMd5` from the Admin API is a plain md5 for `.liquid` files, so those
can be verified exactly — `sections/sj-homepage.liquid` was. For JSON
templates Shopify returns a normalized digest that does not match the md5 of
the served body, so those were verified by content instead.

## Fidelity note

Both templates here are copies of the body returned by the Admin API,
including the Shopify auto-generated header comment, and are identical to the
files now in `templates/`.
