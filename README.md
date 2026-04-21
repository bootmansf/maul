# Mid-Atlantic Uniform League website

Rebuild of [uniformleague.org](https://uniformleague.org), off Webflow.

## Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4
- **CMS:** [Sanity](https://sanity.io) — embedded Studio at `/studio`
- **Hosting:** Vercel
- **Forms:** [Formspree](https://formspree.io) — wired on homepage + `/contact`

## Repo layout

```
app/
  page.tsx                    # Homepage (fully editable via Sanity homepage singleton)
  about/                      # About + 3 subpages (Sanity-backed simplePage singletons)
  events/ + [slug]/           # Sanity-backed list + detail
  gallery/ + [slug]/          # Sanity-backed list + click-to-enlarge lightbox
  leadership/ + [slug]/       # Sanity-backed list + detail
  resources/
    amcc-clubs/               # Sanity-backed
    other-clubs/              # Sanity-backed (externalLink kind=club)
    gear-vendors/             # Sanity-backed (externalLink kind=vendor)
  membership/how-to-join/     # Sanity-backed howToJoinPage singleton
  contact/                    # Formspree-wired form
  maul20/                     # Sanity-backed (anniversaryPage + anniversaryEvent)
  studio/[[...tool]]/         # Embedded Sanity Studio at /studio
  components/
    SiteNav.tsx               # Client nav with hamburger + dropdowns
    SiteFooter.tsx            # variant="gold" | "blue"
    ContactForm.tsx           # Formspree submit + inline success/error
    Countdown.tsx             # Live day/hour/min/sec countdown
    GalleryLightbox.tsx       # Click-to-enlarge with keyboard nav + scroll lock
    portableText.tsx          # Shared PortableText component config (link rendering)
  webflow-css/                # Webflow CSS carry-over (normalize, webflow, theme)
                              # + nav-overrides.css (our React-friendly nav)
                              # + custom-pages.css (gallery grid, lightbox, directories)
sanity/
  client.ts                   # Lazy-initialized Sanity client
  env.ts                      # Env reader + isSanityConfigured()
  image.ts                    # urlFor() builder
  structure.ts                # Studio desk config (singletons pinned at top)
  schemas/
    homepage.ts               # Singleton — homepage copy & images
    simplePage.ts             # Singleton schema — about, mission, letters
    howToJoinPage.ts          # Singleton — how-to-join steps + info cards
    anniversaryPage.ts        # Singleton — /maul20 hero/tickets/hotel
    externalLink.ts           # Collection — clubs + vendors (split by kind)
    event.ts                  # Collection — events
    anniversaryEvent.ts       # Collection — 20th anniversary schedule items
    amccClub.ts               # Collection — AMCC member clubs
    gallery.ts                # Collection — photo galleries
    leadership.ts             # Collection — officer bios
sanity.config.ts              # Studio config (singletons blocked from "+ Create")
sanity.cli.ts                 # CLI config
scripts/import-from-csv.ts    # Webflow CSV → Sanity importer + singleton seeder
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

### 2. Write token

1. Go to <https://sanity.io/manage> → your project → **API** → **Tokens**
2. Create a token with role **Editor**
3. Paste into `.env.local` as `SANITY_API_WRITE_TOKEN`

Needed by `npm run import:csv` to seed CSV data **and** the editable-page singletons.

### 3. Formspree

1. Create a new form at <https://formspree.io>
2. Set `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in `.env.local` to either the full `https://formspree.io/f/xxxxxx` URL or just the form ID — both work

### 4. Seed + run

```bash
npm run import:csv       # Seeds singletons + 5 Webflow collections
npm run dev              # Site at :3000, Studio at :3000/studio
```

`import:csv` is idempotent. Running it again updates CSV-backed text fields only — it uses `createIfNotExists` for singletons and `patch().set()` for collection text fields, so **images uploaded in Studio and edits made to singletons are never overwritten**.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Next.js dev server (includes Studio at `/studio`) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run import:csv` | Seed singletons + import the Webflow CMS CSVs into Sanity (idempotent) |
| `npm run sanity:deploy` | Deploy Studio standalone to `<host>.sanity.studio` (optional — `/studio` route already works) |

## Editing content in Studio

Editors don't need to touch code. Everything below can be changed at `/studio`:

### Pinned singletons (sidebar top)

| Studio item | What it controls |
|---|---|
| **Homepage** | Hero / About / Features / Events intro / Contact sections — copy, button labels+links, key images, 3 feature cards |
| **About** | `/about` heading, subtitle, body (rich text), side image |
| **Our Mission** | `/about/our-mission` — same shape |
| **Letter from the Chief** | Heading, subtitle, body, side image, signature name + title |
| **Letter from the Colonel** | Same shape as the Chief |
| **How to Join** | `/membership/how-to-join` — accordion steps (title + rich-text body), info cards, sidebar image, contact card |
| **20th Anniversary page** | `/maul20` — hero heading/dates/location/body/countdown target/background image, Tickets card (heading/body/button label/URL), Host Hotel card, schedule heading |

### Collections

| Studio item | URL(s) |
|---|---|
| **Events** | `/events` + detail pages, plus the homepage "Where to find us" strip |
| **20th Anniversary Events** | Daily schedule on `/maul20` |
| **AMCC Clubs** | `/resources/amcc-clubs` |
| **Galleries** | `/gallery` + detail (with lightbox) |
| **Leadership** | `/leadership` + detail |
| **External Links** | `/resources/other-clubs` and `/resources/gear-vendors` (the `kind` field determines which page). Entries group by the `category` string |

Every editable field has a fallback to the previous hardcoded copy baked into the code — an empty field never breaks the page, it just shows the original text.

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
| `/` | Sanity `homepage` + Sanity `event` | Navy gradient wrapper, gold nav logo. Inline Formspree form (React) |
| `/about` | Sanity `simplePage` (id `aboutPage`) | About MAUL |
| `/about/our-mission` | Sanity `simplePage` (id `missionPage`) | |
| `/about/letter-from-the-chief` | Sanity `simplePage` (id `letterChiefPage`) | Chief Brad Garbert |
| `/about/letter-from-the-colonel` | Sanity `simplePage` (id `letterColonelPage`) | Colonel William F. Buckley, Jr. |
| `/events` + `/events/[slug]` | Sanity `event` | Split into Upcoming / Past; detail page with full info |
| `/gallery` + `/gallery/[slug]` | Sanity `gallery` | Cover grid → photo grid with click-to-enlarge lightbox |
| `/leadership` + `/leadership/[slug]` | Sanity `leadership` | Card grid → bio detail |
| `/resources/amcc-clubs` | Sanity `amccClub` | Logo grid |
| `/resources/other-clubs` | Sanity `externalLink` (kind=club) | Grouped by category |
| `/resources/gear-vendors` | Sanity `externalLink` (kind=vendor) | Grouped by category |
| `/membership/how-to-join` | Sanity `howToJoinPage` | Accordion steps + info cards |
| `/contact` | Sanity-free + Formspree | Client form with inline success/error |
| `/maul20` | Sanity `anniversaryPage` + `anniversaryEvent` | Live countdown + daily schedule accordion |
| `/studio[/*]` | Sanity Studio | Embedded Studio for editors |

## Visual system

- **Homepage:** navy gradient page-wrapper (`background-gradient`), transparent nav, gold footer
- **Inner pages:** plain wrapper, navy nav, blue footer with gold text
- **Fonts:** IBM Plex Sans (body + headings) + Red Hat Text (accents) via `next/font/google` — no local font files
- **Colors:** `--maul-blue: #282763`, `--maul-gold: #f4d70f`

## Post-launch nice-to-haves

- [ ] `robots.txt` + `sitemap.xml` (Next.js has `app/sitemap.ts` / `app/robots.ts` conventions)
- [ ] Analytics — Vercel Analytics or Plausible (site currently has none)
- [ ] `<Image>` + Sanity image loader instead of `<img>` for auto-optimization on Sanity assets
- [ ] Custom `/not-found.tsx` page in the MAUL style
- [ ] Click-outside-to-close on the mobile nav
- [ ] Focus trap in the mobile nav for keyboard a11y
- [ ] OG images for each route (Next.js `opengraph-image.tsx` convention)
- [ ] Incremental Static Regeneration webhook from Sanity → Vercel on content change (currently `revalidate: 60s` is fine but instant is better)
