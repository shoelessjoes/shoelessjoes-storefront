# Template drift audit — repo vs live theme

Live theme: **MAIN 08-05-2026** (`148795555905`), audited 2026-08-22.

Every `templates/` file was compared against the live theme. Sizes are
minified-JSON character counts, which is what Shopify's `size` field tracks
(verified within ~1–2% on two files whose bodies were fetched in full).
`.liquid` templates are compared as raw bytes.

`ratio` = local ÷ live. **A ratio well under 1.00 means the repo copy is
missing content that exists on the live storefront** — pushing it would
delete that content.

## Stale in the repo — do not push these

| ratio | local | live | file |
| --- | --- | --- | --- |
| 0.45 | 535 | 1190 | `templates/page.vending.json` |
| 0.55 | 2282 | 4160 | `templates/collection.json` |
| 0.63 | 8660 | 13681 | `templates/page.product-finder.json` |
| 0.64 | 2350 | 3697 | `templates/password.json` |
| 0.64 | 9057 | 14242 | `templates/collection.deals.json` |
| 0.64 | 40804 | 63899 | `templates/page.lookbook.json` |
| 0.66 | 9634 | 14511 | `templates/page.faq.json` |
| 0.66 | 17471 | 26301 | `templates/page.brands.json` |
| 0.68 | 1456 | 2155 | `templates/customers/login.json` |
| 0.68 | 1207 | 1771 | `templates/customers/register.json` |

Borderline — smaller than live, worth a diff before pushing:

| ratio | local | live | file |
| --- | --- | --- | --- |
| 0.79 | 3196 | 4052 | `templates/product.display.json` |
| 0.81 | 39583 | 48720 | `templates/product.bulk-order.json` |
| 0.83 | 3499 | 4205 | `templates/product.json` |
| 0.89 | 1272 | 1435 | `templates/page.sealed-wax.json` |

## Repo ahead of live

| ratio | local | live | file |
| --- | --- | --- | --- |
| 2.69 | 13435 | 4994 | `templates/page.contact.json` |

The repo copy is well over twice the live one — either unpushed work, or the
live version was rolled back. Diff before assuming either.

`templates/product.graded.json` (4554 bytes) exists in the repo but **not on
the live theme** at all. Pushing it would create a new template, which is
additive and safe.

## In sync

`404`, `article`, `blog`, `cart`, `collection.filters.liquid`,
`customers/account`, `customers/activate_account`, `customers/addresses`,
`customers/order`, `customers/reset_password`, `gift_card.liquid`,
`list-collections`, `page.json`, `page.about-us`, `page.our-services`,
`page.psa-form.liquid`, `product.enquire`, `product.preorder`, `search`.

Plus `templates/index.json` and `templates/page.about.json`, synced from live
in this branch.

## What this means

A blanket `shopify theme push` from this repo would damage the live
storefront in at least ten places. Until a full `shopify theme pull` has been
run and committed, treat the repo as authoritative **only** for the files
listed as in sync.

The audit compares sizes, not content — a file can match on size and still
differ. Sizes only prove the negative: where they disagree, content is
definitely missing.
