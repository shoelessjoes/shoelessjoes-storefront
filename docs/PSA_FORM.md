# PSA Grading Form — Architecture

## Where it lives in the theme

| File | Purpose |
|---|---|
| `assets/ShoelessJoes_PSA_ShopifyAsset.html` | The full form (~1000 lines, self-contained HTML/CSS/JS) |
| `sections/psa-grading-form.liquid` | Liquid wrapper that loads the asset in an iframe + handles height syncing |
| `templates/page.psa-form.json` | Page template that assigns the section |
| `sections/psa-grading-landing.liquid` | Landing/info page section (separate from the form itself) |
| `templates/page.psa-grading.json` | Landing page template |

**Why iframe?** Liquid's templating syntax (`{% %}`, `${...}`) conflicts with the form's JavaScript template literals. Loading the form as a raw asset via iframe sidesteps Liquid parsing entirely.

---

## End-to-end flow

```
Customer fills form (tablet in store or online)
  └── Submit
        ├── Pay In Store path
        │     └── POST to Apps Script (with paymentPath: 'in_store')
        │           └── Apps Script → Shopify Admin API → create draft order (stays open)
        │           └── Apps Script → Google Sheet (log submission)
        │           └── Apps Script → Gmail (customer confirmation)
        │           └── Form renders printable receipt
        │     [Staff marks line item Fulfilled in Shopify POS when batch returns]
        │
        └── Checkout Online path
              └── POST to Apps Script (with paymentPath: 'online')
                    └── Apps Script → Shopify Admin API → create draft order + invoice
                    └── Returns invoice_url to form
              └── Form redirects customer to Shopify checkout
              └── Customer pays → Shopify redirects back to printable confirmation
```

### Review-flagged orders (special case)

If any card row is marked "Review" or "Review/Prep", or the global Review toggle is on, payment path **locks to Pay In Store** automatically. Customer can't choose online checkout until they're approved at the counter. Banner explains why.

---

## Grouping logic

Cards sharing the **same grader + same tier** are auto-grouped into one submission group → one Shopify line item per group. When the batch returns from PSA, staff marks that line item Fulfilled in Shopify POS by looking up the customer name.

---

## Apps Script payload shape

```
POST {APPS_SCRIPT_URL}/exec
Content-Type: application/json
{
  secret: "SJ-PSA-2024",
  paymentPath: "in_store" | "online",
  customer: { firstName, lastName, email, phone, address? },
  cards: [
    { grader: "PSA", tier: "Regular", value: 500, description, prepAddon: true, reviewAddon: false, ... },
    ...
  ],
  addOns: { slabShield: true, slabNotify: true, ... },
  shipping: { mode: "carry_in" | "ship_to_store", tier, insurance, declaredValue },
  totals: { subtotal, shipping, tax, total },
  meta: { submittedAt, source: "online" | "in_store_tablet" }
}
```

### Response

```
{
  ok: true,
  shopifyOrderNumber: "#1234",
  draftOrderId: 1234567890,
  invoice_url: "https://..."   // only present when paymentPath === "online"
}
```

---

## CONFIG block in the form

Top of `assets/ShoelessJoes_PSA_ShopifyAsset.html`:

```javascript
const CONFIG = {
  SHOPIFY_STORE:   'qebynk-b0.myshopify.com',  // admin link only — not secret
  LOCATION_ID:     '72115847233',
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/.../exec',
  SCRIPT_SECRET:   'SJ-PSA-2024',
  // SHOPIFY_TOKEN is intentionally NOT here — Apps Script Script Properties only
};
```

> The form **never calls Shopify directly**. `SCRIPT_SECRET` must match the Apps Script `SECRET_KEY` constant. The Shopify Admin API token lives only in Apps Script Script Properties (`SHOPIFY_TOKEN`).

---

## Pricing reference

See [`PSA_PRICING.md`](PSA_PRICING.md) for tier prices, turnaround times, shipping rates, and add-ons.

---

## On the horizon (not built yet)

- BGS / SGC / CGC pricing tabs (scaffold exists, awaiting CSV)
- SlabTracker replacement: full email sequence from form submission → grades popped → ready for pickup (6 templates drafted)
- Review-to-Quote loop: revised form sent to customer post-review for online payment of approved cards only
