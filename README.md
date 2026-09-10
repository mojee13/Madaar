# مدار — Madar Commerce

A complete Persian, RTL demo of intelligent digital sales infrastructure for an electrical equipment supplier. It combines a working customer catalog, locally simulated AI, a quotation workflow, and a business workspace. It is designed for a five-minute customer presentation and can run entirely on **free GitHub Pages**.

**No backend, database, account, API key, environment variable or paid service is required.**

> این وب‌سایت نسخه نمایشی است و اطلاعات محصولات و قیمت‌ها صرفاً برای نمایش قابلیت‌های سیستم استفاده شده‌اند.

## Start locally

Install **Node.js 22 or newer**. From the repository root:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally **http://localhost:5173/**. Open **http://localhost:5173/#/demo** for the presentation tour. Stop the server with `Ctrl+C`.

To open a browser automatically:

```bash
npm run dev -- --open
```

For a production build and local demonstration:

```bash
npm run build
npm run preview -- --open
```

The production preview normally uses **http://localhost:4173/**. Serve `dist/` over HTTP; do not double-click `index.html` using `file://`, because browsers restrict JavaScript modules there.

For a phone on the same Wi-Fi, use the network URL printed by Vite. The development server is configured to listen on the local network. Clipboard features may require HTTPS or localhost; copying can fall back to selecting text manually.

## What works

- Persian storefront with self-hosted Vazirmatn fonts, RTL layouts, industrial imagery, responsive navigation and business-value sections.
- **39 sample products in 9 categories**, with brands, models, specs, applications, stock, indicative toman prices, related products and alternatives.
- Local search with Persian/Arabic normalization, brand aliases, autocomplete and keyboard navigation. Explicit category, brand, voltage and current requirements constrain results.
- Catalog filters for category, brand, voltage, minimum current, application, availability and maximum price; sort by relevance, price, name or stock.
- Product pages with technical tabs, illustrative imagery, favorites, recently viewed state, related items and contextual assistant links.
- A conversational assistant that recognizes catalog questions, motor selection, alternatives, complements, stock and comparisons. Responses visibly cite product cards. It is **deterministic local retrieval and templates**, not a live LLM.
- Requirements-based recommendations, with hard constraints and explainable rule scores. Scores are not technical certification or probabilistic confidence.
- Comparison of **2–4 products**, with a differences-only control.
- Quotation lists, quantity editing, validated requester forms, consultation mode, sample autofill, confirmation and reference codes.
- A demo business workspace, with **real local requests and interactions separated from illustrative business metrics**.
- Product creation and editing. Price, availability and content changes update the customer catalog and local assistant data.
- Six editable content outputs: title, description, SEO title, SEO description, Instagram caption and technical summary. Apply title/description to the catalog after review; copy the other outputs.
- Excel import **simulation** with file selection / drag-and-drop, size and extension validation, six staged steps, review, and idempotent import of three fixed sample products.
- Weekly/monthly sample analytics, SVG charts with accessible data tables, popular searches, top products, category shares and conversion funnel.
- A **12-step presenter tour** that follows navigation and provides presenter notes. Comparison and quotation steps prepare sample selections.
- Company solutions, rollout stages, multi-industry customization and a clearly labelled future private-AI offering.
- Favorites, recent views, comparison, quotes, product edits and recent activity persisted in `localStorage`; reset available in the admin sidebar.

## Routes

All routes are hash routes. The same paths work at the domain root or in a repository subdirectory.

| Route                     | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `#/`                      | Storefront and product value                  |
| `#/catalog`               | Searchable catalog and filters                |
| `#/catalog?saved=1`       | Favorites                                     |
| `#/catalog?recent=1`      | Recently viewed                               |
| `#/product/p01`           | Product detail example                        |
| `#/assistant`             | Catalog assistant                             |
| `#/assistant?product=p01` | Contextual assistant                          |
| `#/recommend`             | Requirements-based selection                  |
| `#/compare`               | 2–4 product comparison                        |
| `#/quote`                 | Product quotation form                        |
| `#/quote?consultation=1`  | Consultation request                          |
| `#/demo`                  | Guided presentation tour                      |
| `#/solutions`             | Business presentation and company offering    |
| `#/solutions#private-ai`  | Future enterprise offering                    |
| `#/admin`                 | Business overview; no real login              |
| `#/admin/products`        | Product management                            |
| `#/admin/quotes`          | Local RFQs and statuses                       |
| `#/admin/analytics`       | Sample analytics and local interaction counts |
| `#/admin/content`         | Six-output content studio                     |
| `#/admin/import`          | Excel migration simulation                    |

## Publish on GitHub Pages

The workflow is included at **`.github/workflows/deploy.yml`**. Its test and build steps must pass before publishing.

### Repository site: `USERNAME.github.io/REPOSITORY/`

1. Create an empty public GitHub repository, for example `madar-commerce`. For the simplest free setup, use a public repository.
2. Put the project files at the repository root. Include `package-lock.json` and `.github/workflows/deploy.yml`; do not commit `node_modules` or `dist`.
3. In GitHub, open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Push the `main` branch. If you enabled Pages after the first push, open **Actions → Deploy Madar to GitHub Pages → Run workflow**.
5. Wait for both `build` and `deploy` to succeed. Open the URL shown by the deployment: `https://USERNAME.github.io/REPOSITORY/`.
6. Present from `https://USERNAME.github.io/REPOSITORY/#/demo`.

For an extracted ZIP that is not yet a Git repository:

```bash
git init -b main
git add .
git commit -m "Build Madar intelligent commerce demo"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Replace `USERNAME` and `REPOSITORY` with your own values. GitHub will handle authentication through your normal Git credential setup. If the project is already a Git checkout, keep its history and configure the GitHub remote appropriately instead of running `git init` again.

### User / organization site: `USERNAME.github.io`

Create the repository named exactly **`USERNAME.github.io`**. Follow the same steps, and use that name in the remote URL. The result is:

```text
https://USERNAME.github.io/
https://USERNAME.github.io/#/demo
```

### Why repository subdirectories and refresh work

`vite.config.ts` uses **`base: './'`**. Vite emits relative script and stylesheet URLs, and image references use `import.meta.env.BASE_URL` through `asset()`. `HashRouter` keeps application routing after `#`, so the server only receives `/REPOSITORY/` on refresh.

No SPA rewrite, custom backend, `404.html` redirect hack, or repository-specific environment variable is necessary. **Do not replace HashRouter with BrowserRouter** unless the hosting strategy also changes. Keep the trailing slash on the site root.

If you intentionally prefer an explicit Vite base, use `/` for a user site and `/REPOSITORY/` for a repository site. The default relative base supports both without edits.

### Pages troubleshooting

- **Missing workflow:** confirm the hidden `.github` directory was included in your upload.
- **No deployment:** check that the branch is `main`, Pages uses GitHub Actions, and Actions are enabled.
- **404:** open the repository URL with a trailing slash, then `#/catalog`; `/REPOSITORY/catalog` is not an application route.
- **Stale local products:** reset demo data in the admin sidebar after modifying seed data.
- **Build failures:** use Node 22+, run `npm install` to synchronize a deliberately changed manifest, and commit the updated lockfile. CI uses `npm ci`.
- **Private repository:** availability of Pages for private repositories depends on the GitHub plan. A public repository is the straightforward free route.

Reference documentation: [Vite static deployment](https://vite.dev/guide/static-deploy.html), [Vite relative base](https://vite.dev/guide/build.html#relative-base), [GitHub Pages publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Project structure

```text
madar-commerce/
├── .github/workflows/deploy.yml
├── .gitignore
├── .prettierrc.json
├── .prettierignore
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── PRESENTATION.fa.md
│   ├── QA.md
│   └── ASSETS.md
├── public/
│   ├── .nojekyll
│   ├── favicon.svg
│   └── images/
│       ├── industrial-hero.webp
│       └── category-grid.webp
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── styles.css
    ├── vite-env.d.ts
    ├── components/
    │   ├── UI.tsx
    │   ├── ProductCard.tsx
    │   ├── SearchBox.tsx
    │   ├── Charts.tsx
    │   ├── Modal.tsx
    │   └── TourDock.tsx
    ├── layouts/
    │   ├── StoreLayout.tsx
    │   └── AdminLayout.tsx
    ├── pages/
    │   ├── HomePage.tsx
    │   ├── CatalogPage.tsx
    │   ├── ProductPage.tsx
    │   ├── AssistantPage.tsx
    │   ├── ComparePage.tsx
    │   ├── QuotePage.tsx
    │   ├── RecommendPage.tsx
    │   ├── DemoPage.tsx
    │   ├── SolutionsPage.tsx
    │   ├── AdminDashboard.tsx
    │   ├── AdminProducts.tsx
    │   ├── AdminQuotes.tsx
    │   ├── ContentStudio.tsx
    │   ├── ImportPage.tsx
    │   └── NotFoundPage.tsx
    ├── data/
    │   ├── products.ts
    │   ├── brand.ts
    │   ├── analytics.ts
    │   ├── importDemo.ts
    │   └── tour.ts
    ├── hooks/
    │   ├── useDemo.tsx
    │   └── useTour.tsx
    ├── services/
    │   ├── search.ts
    │   ├── demoAI.ts
    │   ├── storage.ts
    │   └── demo.test.ts
    ├── types/index.ts
    ├── utils/format.ts
    └── i18n/index.ts
```

If present, `.openai/hosting.json` is metadata for the optional accompanying private preview. It is not used by GitHub Pages, the browser application, `npm run dev`, or `npm run build`. It contains no secret. The downloadable GitHub-ready ZIP omits this environment-specific metadata.

## Stack and design

React 19, Vite 6, TypeScript, Tailwind CSS 4, React Router, Lucide and self-hosted Vazirmatn. Tailwind is configured through its Vite plugin; the visual system and composed components live in `styles.css`. Heavy chart and component libraries are intentionally unnecessary: charts use accessible inline SVG, and dialogs use the browser's native modal dialog with keyboard focus handling.

The identity uses dark forest green, a controlled lime accent, restrained surfaces, industrial product renders and a clear Persian type hierarchy. Non-home routes are lazy-loaded. Images are local WebP files, fonts are installed locally via Fontsource, and there are no runtime image, font or AI network dependencies.

## Change branding

1. Edit `src/data/brand.ts` for the name, tagline, supplier and fictional contact fields. The shared logo reads this configuration.
2. Change the `:root` and `@theme` tokens in `src/styles.css` for your visual identity. Component styling lives in that file, including context-specific tones.
3. Replace `public/favicon.svg`, the hero image and category images with assets you have rights to use.
4. Update editorial mentions of «مدار» in page copy, document titles and metadata in `index.html` / `App.tsx`.
5. Replace sample contact information before presenting as an actual business. `.example` is intentionally a non-operational contact domain.

## Edit products

Edit the typed seed rows in `src/data/products.ts` or use **پنل مدیریت → مدیریت محصولات** for browser-local changes. Each product has an immutable `id`, category, brand, model, specs, prices, application, relationship IDs and featured flag.

- Keep IDs unique; related and alternative IDs must refer to existing products.
- Prices are integer **toman** values, not rials. Use `null` for “تماس برای قیمت”. Cable prices are per metre where stated.
- Nominal voltage has category-specific meaning: output voltage for power supplies, circuit voltage for contactors/breakers. Separate input/coil values live in `specs`.
- Availability is `in-stock`, `limited` or `order`.
- The sample atlas uses one representative visual per category, not an authentic photograph of each model.
- **Reset demo data after editing seeds** if your browser already contains the old catalog.
- Browser-local edits are not written to source files and are not shared with other visitors.

## Replace simulated AI with a real backend

`src/services/demoAI.ts` is the adapter boundary. Keep its `AIReply`, `Recommendation` and `GeneratedContent` contracts, but introduce an async client that calls your own server endpoint.

A production flow should:

1. Authenticate and authorize the caller on the server.
2. Validate input and enforce tenant access, rate and size limits.
3. Retrieve current, authorized product/document records, including availability and prices from the source of truth.
4. Call an LLM from the server using a server-held secret, then return grounded answers and allowed product IDs.
5. Validate citations and returned IDs, preserve technical uncertainty, and provide a human escalation path.
6. Display loading, cancellation, error and retry states on the frontend.
7. Keep raw company documents, private knowledge and credentials out of the static bundle.

**Never put an LLM key in a `VITE_*` environment variable. Those values are public browser code.** GitHub Pages can continue to host the frontend while a separately hosted API provides real functionality. Such a service has its own costs, security, consent, retention and operational requirements.

## Localization

`src/i18n/index.ts` defines `fa`, `tr`, `it`, and `en` locale metadata, direction, Intl locale, and the initial Persian common dictionary. The only completed language is **Persian**; there is no misleading language selector.

To ship another language:

1. Move the remaining page-specific Persian copy into dictionary modules alongside the existing shared keys.
2. Add a complete dictionary and translated catalog descriptions for that locale.
3. Introduce a locale provider and replace `activeLocale` with its value.
4. Update `document.documentElement.lang` and `.dir`, and use the locale in all Intl formatters.
5. Localize currency and the commercial workflow deliberately; translating toman to another currency is not a conversion rule.
6. Audit a small number of physical anchors (floating controls, sidebar, decorative offsets). Most layout spacing uses logical properties, but LTR QA is still required.
7. Expose the locale switch only when the language is complete, then test mixed model numbers, keyboard navigation and responsive tables.

Turkey, Italy, Europe and other industries are future configuration and localization targets, not currently supported live commerce jurisdictions.

## Storage and reset

The versioned key is **`madar-demo-v1`**. Data remains on the visitor's device. Storage failures show a warning and the app continues in memory. Malformed stored data falls back to the seed state. Quotes retain a product-name/model snapshot so later edits do not rewrite historical request contents.

Use **پنل مدیریت → بازنشانی داده‌های دمو → بله، بازنشانی** to restore seed products and remove the demo's local quotes, selections, favorites and events. This only touches Madar's state, not all browser storage. Events are capped at 200, requests at 100, and recent products at 8.

Avoid entering real personal or company confidential data in this static demonstration. No local state is a security boundary, and no browser-only admin page is protected.

## Demo limitations

- No authentication or authorization. “ورود آزمایشی” is navigation, not a login.
- No payments, emails, CRM integration, live stock, real quotation delivery or shared database.
- AI is local intent matching, retrieval, rules and template assembly. It does not understand arbitrary questions like a general LLM.
- Excel files are **not uploaded or parsed**. File names are shown and formats/sizes checked; processing and preview use three fixed demo records. Repeating publication does not duplicate their IDs.
- Product imagery is illustrative and shared by category. Model references, specifications, stock and prices are unverified sample data, not manufacturer datasheets.
- Electrical selection and substitutes must be verified by a qualified specialist using actual manufacturer documentation and project conditions.
- Brands are examples only; no authorized partnership or representation is claimed.
- Private AI, document RAG, role-based access, ERP and multi-tenant deployment are proposed enterprise work, not implemented features.
- Hash routing is robust on Pages, but has limitations for route-specific search-engine indexing and social crawlers. Per-route titles/descriptions update in JavaScript; static crawlers may see only root metadata. Production SEO may require prerendering or SSR on different hosting.
- Persistent data is per browser/device; resetting or clearing browser data removes it. The tour and chat conversation are temporary in-memory sessions.

## Verification and maintenance

```bash
npm test
npm run check
npm run build
npm run format:check
```

The focused test suite validates meaningful behavior and catalog integrity. See `docs/QA.md` for browser checks and practical limitations. To format source:

```bash
npm run format
```

## Screenshots

The website itself is the authoritative interactive demo. Suggested screenshots to add after personalizing the brand:

- [ ] Desktop homepage and featured products
- [ ] Mobile catalog and filters
- [ ] AI response with product sources
- [ ] Quotation confirmation and corresponding admin request
- [ ] Dashboard analytics
- [ ] Content studio and import review

Store your chosen screenshots under `docs/screenshots/` and link them here. No broken placeholder image URLs are included.

## Five-minute presentation

Open `#/demo` and choose **شروع تور راهنما**. The guide remains visible as you move through the storefront and admin area. Expand the presenter note for each step. Detailed Persian talking points are in `docs/PRESENTATION.fa.md`.
