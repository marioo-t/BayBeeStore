# Bay Bee Store JSON catalog notes

## Source of truth
Edit only `data/products.json` for:
- product title, price, description, SKU
- sizes and colors
- image list
- product-specific sections

## Product pages
Each file in `products/style/product-X.html` is now a lightweight wrapper.
The actual content is rendered by:
- `assets/catalog.js`
- `assets/product-page.js`

To create a new product page:
1. Duplicate `products/style/product-template.html`
2. Change `data-product-slug` on `<body>`
3. Add the matching product entry in `data/products.json`

## Category pages
A generic category engine is ready in:
- `assets/category-page.js`
- `categories/style.html`
- `categories/coffee.html`
- `categories/wellness.html`
- `categories/extras.html`

## Important
Open the site through a local server or hosting, not directly as `file://`, because the pages fetch the JSON with JavaScript.
Examples:
- VS Code Live Server
- `python -m http.server`
