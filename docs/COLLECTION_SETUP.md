# Smart Collections & Matrixfy Tagging — Shoeless Joe's

## Collections Created ✅

**15 smart collections** have been created and are live in Shopify Admin. They use a tag-based rule system:

| Collection | Rule | Status |
|-----------|------|--------|
| **Sealed Baseball Wax** | `Sealed Baseball` + `In-Stock` | Ready |
| **Sealed Football Wax** | `Sealed Football` + `In-Stock` | Ready |
| **Sealed Hockey Wax** | `Sealed Hockey` + `In-Stock` | Ready |
| **Sealed Basketball Wax** | `Sealed Basketball` + `In-Stock` | Ready |
| **Sealed Soccer Wax** | `Sealed Soccer` + `In-Stock` | Ready |
| **Sealed Entertainment Wax** | `Sealed Entertainment` + `In-Stock` | Ready |
| **Sealed Pokemon Wax** | `Sealed Pokemon` + `In-Stock` | Ready |
| **Sealed TCG Wax** | `Sealed TCG` + `In-Stock` | Ready |
| **Graded Baseball Cards** | `Graded Baseball` + `In-Stock` | Ready |
| **Graded Football Cards** | `Graded Football` + `In-Stock` | Ready |
| **Graded Hockey Cards** | `Graded Hockey` + `In-Stock` | Ready |
| **Graded Basketball Cards** | `Graded Basketball` + `In-Stock` | Ready |
| **Graded Pokemon Cards** | `Graded Pokemon` + `In-Stock` | Ready |
| **Graded Entertainment Cards** | `Graded Entertainment` + `In-Stock` | Ready |
| **Graded TCG Cards** | `Graded TCG` + `In-Stock` | Ready |

---

## Why Tag-Based Collections?

Shopify's smart collection rules support **TAG** filtering, not product type filtering. To organize products effectively, we use a two-tag system:

1. **Category tag** (e.g., `Sealed Baseball`, `Graded Football`) — identifies both the product type (Sealed/Graded) and sport
2. **Inventory tag** (e.g., `In-Stock`) — controls visibility based on stock

---

## Matrixfy Bulk-Tagging Tasks

Use Matrixfy to bulk-apply the category tags to all products. Two tasks below:

### Task 1: Add "In-Stock" Tag to Products with Positive Inventory

**Condition:** `Inventory > 0`  
**Action:** Add tag `In-Stock`

This tag is required for products to appear in any collection. Products with zero or negative inventory are excluded.

**Affected products:** ~150–170 products (estimate from current inventory scan)

---

### Task 2: Add Sport/Type Category Tags

Map products to their category tag based on **title patterns** and **current tags**. Use the mapping table below.

#### Mapping Rules

**For SEALED products** (currently tagged as `productType: "Sealed Wax"`):

| Product Title Keywords | Shopify Tag | Collection |
|------------------------|-------------|-----------|
| "Baseball" + (not "Graded") | `Sealed Baseball` | Sealed Baseball Wax |
| "Football" + (not "Graded") | `Sealed Football` | Sealed Football Wax |
| "Hockey" (not "Graded") | `Sealed Hockey` | Sealed Hockey Wax |
| "Basketball" (not "Graded") | `Sealed Basketball` | Sealed Basketball Wax |
| "Soccer" (not "Graded") | `Sealed Soccer` | Sealed Soccer Wax |
| "Rolling Stones", "WWE", "Disney", "Marvel", "Star Wars", "Batman", "Minecraft", "Dune" | `Sealed Entertainment` | Sealed Entertainment Wax |
| "Pokemon" (not "Graded") | `Sealed Pokemon` | Sealed Pokemon Wax |
| "Magic" (in title) | `Sealed TCG` | Sealed TCG Wax |
| "One Piece", "TCG" (after filtering above) | `Sealed TCG` | Sealed TCG Wax |

**For GRADED products** (if your store has them):

These would follow the same pattern with `Graded` prefix instead of `Sealed`.  
E.g., products with title "Graded Baseball" get tag `Graded Baseball`.

---

## How to Execute in Matrixfy

1. **Log in** to [Matrixfy](https://www.matrixify.com)
2. **Create Task 1: In-Stock Tagging**
   - Operation: "Add tags to products"
   - Condition: `Inventory > 0` (if Matrixfy supports this) or manually filter
   - Tags to add: `In-Stock`
   - Apply to all matching products

3. **Create Task 2: Category Tagging**
   - Operation: "Add tags to products"
   - For each sport/category in the table above:
     - Search products by title keyword
     - Add the corresponding category tag

**Alternative (if Matrixfy doesn't support conditional logic):**
- Export product list from Shopify
- Use a spreadsheet to map products → tags
- Import back with bulk edit

---

## Next Steps

1. **Complete Matrixfy tasks** (In-Stock tagging + category tags)
2. **Verify collections populate** in Shopify Admin → Online Store → Collections
3. **Update navigation menu** to link to the new collections (see `NAVIGATION_SETUP.md`)
4. **Test collection pages** in theme preview to ensure they display correctly

---

## Notes

- Collections are **live and immediately visible** to customers once products receive the required tags
- Collections use `CREATED_DESC` sort (newest products first)
- `In-Stock` tag is **required** for visibility — products with zero/negative inventory remain in the system but hidden from storefronts
- Your existing **Shopify Flow** ("New" tag automation) continues to operate independently and won't interfere

