# Apps Script Projects

Google Apps Script projects tracked in this repo. Each project lives in its own folder with source files (`*.gs`), the manifest (`appsscript.json`), and a README documenting deployment.

---

## Projects

| Folder | Purpose | Deployed URL var |
|---|---|---|
| `psa-grading/` | Backend for the PSA grading form — CORS proxy to Shopify Admin API, draft order creation, Google Sheets submission log, customer confirmation emails | `APPS_SCRIPT_URL` |

---

## Working with Apps Script source

### Option 1: Manual (copy/paste)

Edit files locally, then copy/paste into the Apps Script editor at [script.google.com](https://script.google.com). Slow, but no setup. Use this if you only edit Apps Script occasionally.

### Option 2: clasp (recommended)

[clasp](https://github.com/google/clasp) is Google's CLI for Apps Script.

```powershell
npm install -g @google/clasp
clasp login
```

Inside a project folder (e.g. `apps-script/psa-grading/`):

```powershell
clasp pull              # download live version
clasp push              # upload local changes
clasp deploy --description "feat: ..."
clasp open              # open the project in the Apps Script web editor
```

The `.clasp.json` file in each project folder holds the Apps Script project ID. It's gitignored — each developer logs in via `clasp login` and creates their own `.clasp.json` by running `clasp clone <scriptId>` once.

---

## Why these are in the storefront repo

The PSA form (in `assets/`) and its Apps Script backend (here) are tightly coupled — the form's CONFIG block hardcodes the Apps Script URL, and the script's response shape is consumed directly by the form's JS. Keeping them in the same repo means a single PR can update both sides at once and history stays coherent.

If we add Apps Script projects unrelated to the storefront (e.g. ops automation), those would live in `shoelessjoes-ops` or its own repo, not here.
