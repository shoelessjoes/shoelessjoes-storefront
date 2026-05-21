# Brand Assets

Source brand files — versioned for safekeeping, **not deployed to the Shopify theme**. This whole folder is excluded from theme pushes via `.shopifyignore`.

## fonts/

The licensed **Empera** font family (purchased license). Used in the logo only — the website renders headings in Bebas Neue as a substitute (see `docs/BRAND.md`). These files are kept here as the master copy of the licensed font.

| Style | Use |
|---|---|
| Empera-Regular | Primary wordmark ("SHOELESS") |
| Empera-Soft | Secondary ("JOE'S", tagline) |
| Empera-Vintage / SoftVintage | Distressed/vintage treatments |
| Empera-Inline / InlineVintage | Outlined display variants |

OTF and TTF provided for each. If we ever need Empera as a web font, convert the OTF to WOFF2 via [transfonter.org](https://www.transfonter.org/) and place the result in `assets/`, then add an `@font-face` in `assets/shoeless-brand.css`.

## What else belongs here

- `logo.svg` / logo source files (when exported from the designer's Illustrator file)
- The repeating batter-silhouette pattern graphic from the brand guidelines
- Any other master brand artwork

## License note

Empera is a commercially licensed font. Keep it within Shoeless Joe's projects per the license terms. Do not redistribute.
