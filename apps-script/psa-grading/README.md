# PSA Grading — Apps Script Backend

The server-side script that powers the PSA grading submission form.

## Responsibilities

1. **CORS proxy to Shopify Admin API** — the form POSTs here, this script makes the authenticated server-to-server call to Shopify. Browser never touches the Shopify token.
2. **Draft order creation** — converts the submission into a Shopify draft order with one line item per submission group (grader + tier).
3. **Online checkout path** — when `paymentPath === 'online'`, returns the draft's `invoice_url` so the form can redirect the customer to Shopify checkout.
4. **Google Sheets logging** — every submission is appended to a tracking Sheet for staff visibility.
5. **Customer confirmation email** — sends the appropriate template based on submission state (initial confirmation; later: shipped, graded, ready for pickup).

## Files

| File | Purpose |
|---|---|
| `Code.gs` | Main entry point (`doPost`), routing, Shopify API calls, draft order builder |
| `Emails.gs` | Email templates and `sendCustomerEmail()` helper |
| `Sheets.gs` | Submission logging to the tracking Sheet |
| `appsscript.json` | Apps Script manifest (timezone, OAuth scopes, advanced services) |

> **Note:** Source files will be migrated from the existing Apps Script project on first deploy. The current production code is in the old `shopify` repo at `apps-script/psa-grading/Code.gs` — we'll pull it in here and split into the multi-file layout above when we resume PSA form work.

## Configuration

Apps Script Script Properties (set via Project Settings → Script properties):

| Key | Value source |
|---|---|
| `SHOPIFY_STORE` | `shoelessjoescards.myshopify.com` (literal) |
| `SHOPIFY_API_TOKEN` | 1Password — rotate quarterly |
| `SHOPIFY_LOCATION_ID` | `72115847233` (literal) |
| `SHOPIFY_API_VERSION` | `2024-10` |
| `SECRET_KEY` | Shared secret with the form's CONFIG `SCRIPT_SECRET` |
| `LOG_SHEET_ID` | The Google Sheet ID for submission logging |
| `FROM_EMAIL` | `contact@shoelessjoescards.com` |

## Deploy

```powershell
cd apps-script/psa-grading
clasp push
clasp deploy --description "feat: ..."
```

After deploying, if the URL changed:
1. Copy the new `/exec` URL
2. Update `APPS_SCRIPT_URL` in `.env`
3. Update the form CONFIG block in `assets/ShoelessJoes_PSA_ShopifyAsset.html`
4. Commit and push the theme update
