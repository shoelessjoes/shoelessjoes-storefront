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

## Known repo drift (as of capture)

| File | Repo vs live |
| --- | --- |
| `sections/sj-about.liquid` | identical (`d1bfa02d…`) |
| `sections/sj-homepage.liquid` | **differs** — live is newer (`ab639489…` vs repo `74894add…`) |
| `templates/index.json` | **differs** — repo is an empty scaffold |
| `templates/page.about.json` | **differs** — repo is an empty scaffold |

A full `shopify theme pull` is worth running before trusting the repo as a
deploy source.

## Fidelity note

`page.about.json` is a byte-for-byte copy of the live file, including the
Shopify auto-generated header comment. `index.json` is semantically exact
but reformatted (compact block objects, header comment omitted).
