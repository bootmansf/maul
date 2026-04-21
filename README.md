# Mid-Atlantic Uniform League website

Rebuild of [uniformleague.org](https://uniformleague.org), transitioning off Webflow.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
- **CMS:** [Sanity](https://sanity.io) — embedded Studio at `/studio`
- **Hosting:** Vercel (planned)
- **Forms:** [Formspree](https://formspree.io) — wired on `/contact`

## Repo layout

```
app/
  page.tsx                    # Homepage
  about/                      # About + 3 subpages
  events/ + [slug]/           # Sanity-backed list + detail
  gallery/ + [slug]/          # Sanity-backed list + detail
  leadership/ + [slug]/       # Sanity-backed list + detail
  resources/
    amcc-clubs/               # Sanity-backed
    other-clubs/              # Static link directory
    gear-vendors/             # Static link directory
  membership/how-to-join/     # Static with <details> accordion
  contact/                    # Formspree-wired form
  maul20/                     # 20th Anniversary w/ live countdown + schedule
  studio/[[...tool]]/         # Embedded Sanity Studio at /studio
  components/
    SiteNav.tsx               # Client nav with hamburger + dropdowns
    SiteFooter.tsx            # variant="gold" | "blue"
    ContactForm.tsx           # Formspree submit + inline success/error
    Countdown.tsx              # Live day/hour/min/sec countdown
  webflow-css/                # Webflow CSS carry-over (normalize, webflow, theme)
                              # + nav-overrides.css (our React-friendly nav)
                              # + custom-pages.css (grid layouts for pages w/o Webflow templates)
sanity/
  client.ts                   # Lazy-initialized Sanity client
  env.ts                      # Env reader + isSanityConfigured()
  image.ts                    # urlFor() builder
  structure.ts                # Studio desk config
  schemas/                    # event, anniversaryEvent, amccClub, gallery, leadership
sanity.config.ts              # Studio config
sanity.cli.ts                 # CLI config
scripts/import-from-csv.ts    # Webflow CSV → Sanity importer
public/
  images/                     # Carried over from Webflow export
  svg/maul-logo-gold.svg      # Nav logo
  svg/maul-logo-blue.svg      # Footer logo (inner pages)
reference/                    # Original Webflow export + CMS CSVs, kept for reference
```

## First-time setup

```bash
npm install
```

### 1. Create a Sanity project

```bash
npx sanity@latest login
npx sanity@latest init --bare
```

Copy `.env.example` to `.env.local` and fill in the values printed by `init`.

### 2. Write token (CSV import only)

1. Go to <https://sanity.io/manage> → your project → **API** → **Tokens**
2. Create a token with role **Editor**
3. Paste into `.env.local` as `SANITY_API_WRITE_TOKEN`

### 3. Formspree

1. Create a new form at <https://formspree.io>
2. Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in `.env.local` to either the full `https://formspree.io/f/xxxxxx` URL or just the form ID — both work

### 4. Seed + run

```bash
npm run import:csv       # Seeds 5 collections from reference/cms-csv/
npm run dev              # Site at :3000, Studio at :3000/studio
```

Images are not imported — Webflow CSVs only contain Webflow CDN URLs, so you upload them by hand in Studio.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server (includes Studio at `/studio`) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run import:csv` | Import the 5 Webflow CMS CSVs into Sanity |
| `npm run sanity:deploy` | Deploy Studio standalone to `<host>.sanity.studio` (optional — `/studio` route already works) |

## Environment variables

See [.env.example](./.env.example). In production, set these in the Vercel dashboard (or via `vercel env add`).

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (default: `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | GROQ API version pin |
| `SANITY_API_WRITE_TOKEN` | **Server-side only.** Used by the CSV import script |
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | Formspree URL or form ID for the contact form |

Note: `vercel env pull .env.local` overwrites the whole file. If you add custom local-only vars, keep them in `.env.development.local` instead — Next.js loads it after `.env.local` and Vercel won't clobber it.

## Routes

| Route | Source | Notes |
|---|---|---|
| `/` | Static sections + Sanity upcoming events | Navy gradient wrapper, gold nav logo |
| `/about` | Static | About MAUL |
| `/about/our-mission` | Static | |
| `/about/letter-from-the-chief` | Static | Chief Brad Garbert |
| `/about/letter-from-the-colonel` | Static | Colonel William F. Buckley, Jr. |
| `/events` + `/events/[slug]` | Sanity `event` | Split into Upcoming / Past; detail page with full info |
| `/gallery` + `/gallery/[slug]` | Sanity `gallery` | Cover grid → photo grid |
| `/leadership` + `/leadership/[slug]` | Sanity `leadership` | Card grid → bio detail |
| `/resources/amcc-clubs` | Sanity `amccClub` | Logo grid |
| `/resources/other-clubs` | Static | Link directory |
| `/resources/gear-vendors` | Static | Link directory |
| `/membership/how-to-join` | Static | 4-step `<details>` accordion |
| `/contact` | Static + Formspree | Client form with inline success/error |
| `/maul20` | Sanity `anniversaryEvent` + static | Live countdown + daily schedule accordion |
| `/studio[/*]` | Sanity Studio | Embedded Studio for editors |

## Visual system

- **Homepage:** navy gradient page-wrapper (`background-gradient`), transparent nav, gold footer
- **Inner pages:** plain wrapper, navy nav, blue footer with gold text
- **Fonts:** IBM Plex Sans (body + headings) + Red Hat Text (accents) via `next/font/google` — no local font files
- **Colors:** `--maul-blue: #282763`, `--maul-gold: #f4d70f`

## Remaining before deploy

### Must-do before tomorrow's deploy

- [ ] **GitHub repo** — create repo, `git init` / push
- [ ] **Vercel project** — connect to the repo, framework auto-detects as Next.js
- [ ] **Vercel env vars** — add the 4 Sanity vars + Formspree endpoint (run `vercel env add` or paste in dashboard for Production + Preview)
- [ ] **Re-run `npm run import:csv`** after the import-script fix so the 3 Leadership records (all marked `Draft: true` in Webflow export) land in Sanity
- [ ] **Upload images in Studio** for the documents that need them — at minimum: leader portraits, event cover images, gallery photos, AMCC club logos. Webflow CSVs don't carry images over
- [ ] **CORS origins** — in <https://sanity.io/manage> → API → CORS origins, add `https://uniformleague.org` (and your Vercel preview domain if you want previews to query Sanity)
- [ ] **Smoke-test contact form** end-to-end once Vercel is up — submit a real message and confirm Formspree delivers

### Custom domain

- [ ] Add `uniformleague.org` + `www.uniformleague.org` to the Vercel project
- [ ] Update DNS at the registrar (point A / CNAME records to Vercel)
- [ ] Wait for SSL to auto-provision
- [ ] Update Sanity CORS origins to include the custom domain

### Nice to have (post-launch)

- [ ] Homepage contact form is still inline HTML — could be rewired through `ContactForm` component for DRY
- [ ] `robots.txt` + `sitemap.xml` (Next.js has `app/sitemap.ts` / `app/robots.ts` conventions)
- [ ] Analytics — Vercel Analytics or Plausible (site currently has none)
- [ ] `<Image>` + Sanity image loader instead of `<img>` for auto-optimization on Sanity assets
- [ ] Custom `/not-found.tsx` page in the MAUL style
- [ ] Click-outside-to-close on the mobile nav
- [ ] Focus trap in the mobile nav for keyboard a11y
- [ ] OG images for each route (Next.js `opengraph-image.tsx` convention)
- [ ] Incremental Static Regeneration webhook from Sanity → Vercel on content change (currently `revalidate: 60s` is fine but instant is better)
