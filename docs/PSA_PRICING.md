# PSA Pricing & Turnaround Times

Authoritative pricing for the PSA form, landing page, and printable brochure. The form's `TIERS` object in `assets/ShoelessJoes_PSA_ShopifyAsset.html` must match this doc.

## Pricing model

- **Customer price = PSA base price + $2.00/card markup.**
- **Add-ons (per card):** $2 Prep/Entry (sleeve + wipe + entry), $3 Review (yes/no grading recommendation). These are independent — both = $5.
- **Shipping:** NOT charged upfront. Return shipping and any PSA upcharges are **invoiced when cards return**, based on insured/declared value. In-store pickup is free.

## Submission cadence (first choice on the form)

The form opens with a required **Weekly vs Monthly** choice — it's the first decision, applies to the whole form, and tags the resulting Shopify order `psa-weekly` or `psa-monthly`.

- **Monthly:** held until the monthly run so Value Bulk's 50-card minimum (raised from 20 on 5/18) can be met. All tiers available.
- **Weekly:** ships on the next weekly run no matter the count. **Value Bulk unavailable** — graded at Value tier and up.

Mixed cadence = two separate submissions (two forms).

## PSA Standard ($2 markup)

| Tier | Customer price | Turnaround (business days) |
|---|---|---|
| Value Bulk | $26.99 | 140–160 (Monthly only) |
| Value | $34.99 | 100–120 |
| Value Plus | $51.99 | 60–80 |
| Value Max | $66.99 | 40–50 |
| Regular | $81.99 | 30–40 |
| Express | $151.00 | 20–30 |
| Super Express | $351.00 | 7–10 |
| Walk-Through | $601.00 | 5–7 |

## PSA Dual Autograph ($2 markup — confirmed)

PSA base + $2/card. Confirmed against psacard.com. Dual has its own (slightly longer) turnarounds and Value Bulk is Collectors Club only.

| Tier | Customer price | Turnaround |
|---|---|---|
| Value Bulk | $34.99 | 150–170 (Monthly only) |
| Value | $44.99 | 110–130 |
| Value Plus | $66.99 | 70–90 |
| Value Max | $86.99 | 50–60 |
| Regular | $106.99 | 40–50 |
| Express | $201.00 | 30–40 |
| Super Express | $471.00 | 10–15 |
| Walk-Through | $801.00 | 7–9 |

## BGS / SGC / TAG

Not yet priced in the form (stubbed as "Call/Other"). The sitemap calls for separate BGS, SGC, and TAG submission forms — those get built once pricing is provided. TAG pricing exists from an earlier draft but isn't wired into this PSA form.

## Add-On Services

| Service | Price |
|---|---|
| Prep / Entry — sleeve + wipe + order entry | $2.00 / card |
| Review — yes/no grading recommendation | $3.00 / card |
| Full Review + Restore | Variable — ask in store |

## Notes

- Value Bulk minimum: **50 cards** (raised from 20 on 5/18/2026), enforced via the Monthly cadence requirement.
- Super Express base rose $299 → $349 (the one tier whose customer price increased net of the markup change).
- All other tiers' customer prices dropped $3 vs. the old $5-markup model.
