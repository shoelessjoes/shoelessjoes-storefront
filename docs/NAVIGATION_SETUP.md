# Navigation Menu Setup — Shoeless Joe's

Build navigation menus in **Shopify Admin → Online Store → Navigation** (not in theme code).

---

## Primary Menu: `Main Menu`

This menu appears in the header.

| Menu Item | Link Target | Notes |
|-----------|-------------|-------|
| **Sealed Wax** | `/collections/sealed-wax` | Sports cards & collectibles in original packaging |
| **Graded Cards** | `/pages/graded-inventory` | Browse graded inventory by sport/TCG (display-only) |
| **Grading Services** | Submenu (see below) | PSA, BGS, SGC, TAG options |
| **About Us** | `/pages/about-us` | Store history & team |
| **Sell Your Cards** | `/pages/contact` | Consignment & purchasing inquiry form |
| **Contact** | `/pages/contact` | Email, phone, hours, visit |

### Grading Services Submenu

| Menu Item | Link Target |
|-----------|-------------|
| PSA Grading | `/pages/psa-form` |
| BGS Grading | `/pages/bgs-form` *(stub)* |
| SGC Grading | `/pages/sgc-form` *(stub)* |
| TAG Grading | `/pages/tag-form` *(stub)* |

---

## Footer Menu: `Footer`

This menu appears at the bottom of every page.

| Menu Item | Link Target |
|-----------|-------------|
| About Us | `/pages/about-us` |
| Contact | `/pages/contact` |
| FAQ | `/pages/faq` |
| Privacy Policy | `/policies/privacy-policy` *(auto-generated)* |
| Terms of Service | `/policies/terms-of-service` *(auto-generated)* |
| Refund Policy | `/policies/refund-policy` *(auto-generated)* |

---

## Steps to Create in Shopify Admin

1. **Log in** to Shopify Admin → **Online Store → Navigation**
2. **Click "Add menu"** → Name it `Main Menu`
3. **Add links** using the table above (just paste `/pages/about-us` into the Link field)
4. **Save**
5. **Edit theme settings** to assign `Main Menu` as the primary header menu
6. Repeat for `Footer` menu
7. Test the menu in a theme preview or live site

---

## Collection Requirements

The following collections must exist in Shopify before the menu links work:

- `sealed-wax` — All sealed product boxes, packs, cases
- `graded-baseball` — Graded baseball cards only
- `graded-football` — Graded football cards only
- `graded-hockey` — Graded hockey cards only
- `graded-basketball` — Graded basketball cards only
- `graded-pokemon` — Graded Pokémon cards only
- `graded-magic` — Graded Magic: The Gathering cards only

**Note:** Collection handles (URLs) must match exactly. If your collection is titled "Sealed Wax Products", its handle will be `sealed-wax-products`. Either rename the collection or update the menu links to match.

---

## Page Requirements

The following pages must exist before the menu links work:

- `/pages/about-us` — About the store, history, team (exists)
- `/pages/contact` — Contact form, hours, location (exists)
- `/pages/psa-form` — PSA grading submission (exists)
- `/pages/graded-inventory` — Browse graded cards (newly created)
- `/pages/faq` — FAQ (exists)
- `/pages/bgs-form` — BGS submission form (stub — needs pricing)
- `/pages/sgc-form` — SGC submission form (stub — needs pricing)
- `/pages/tag-form` — TAG submission form (stub — needs pricing)

---

## How to Create a Page in Shopify Admin

1. **Shopify Admin → Content → Pages**
2. **Click "Add page"**
3. **Title:** e.g., "About Us"
4. **Content:** Add your text, images, etc. (or leave blank if using a theme template)
5. **SEO → URL:** Shopify auto-generates the handle. Ensure it matches what's in your menu links.
6. **Publish**

**Alternatively:** If you create the page in code (template file), Shopify will auto-detect it when you upload the theme. Just ensure the **page template is published** in Shopify Admin afterward.

---

## Troubleshooting

- **Menu links don't appear:** Make sure the theme setting references the menu name (e.g., `Main Menu`).
- **404 errors on menu clicks:** Double-check collection handles and page URLs match exactly (case-insensitive, hyphens not underscores).
- **Missing menu items:** If a collection or page doesn't exist yet, the link target will be broken. Create the collection/page first.

---

## Brand Notes

- **Header:** Navy background with gold accent line (Bebas Neue for title, Roboto body)
- **Menu items:** Use Bebas Neue for menu labels (configured in theme settings)
- **Active state:** Gold underline for the current page
- **Mobile:** Hamburger menu collapsible, same items

See [`BRAND.md`](BRAND.md) for full branding specs.
