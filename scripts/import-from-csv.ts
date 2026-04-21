/**
 * Imports the 5 Webflow CMS CSVs into Sanity.
 *
 * Prerequisites:
 *   1. Create a Sanity project and set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local
 *   2. Create a write token at sanity.io/manage → API → Tokens (role: Editor)
 *      and set SANITY_API_WRITE_TOKEN in .env.local
 *   3. Run: npm run import:csv
 *
 * Note: image fields (Event Picture, Logo, Cover Image, Images, Picture) are
 * left blank — Webflow CSVs give URLs to Webflow-hosted CDN images. Easiest
 * path is to upload images by hand in Studio after import. If you want to
 * automate that, we can extend this script to fetch + upload.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";
import { createClient } from "@sanity/client";
import "dotenv/config";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID missing");
if (!token) throw new Error("SANITY_API_WRITE_TOKEN missing");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const CSV_DIR = resolve(process.cwd(), "reference/cms-csv");

type Row = Record<string, string>;

function readCsv(filename: string): Row[] {
  const raw = readFileSync(resolve(CSV_DIR, filename), "utf8");
  return parse(raw, { columns: true, skip_empty_lines: true, trim: true });
}

function randomKey() {
  return Math.random().toString(36).slice(2, 10);
}

function textToBlock(text: string) {
  return {
    _type: "block",
    _key: randomKey(),
    style: "normal",
    markDefs: [],
    children: [
      { _type: "span", _key: randomKey(), text, marks: [] },
    ],
  };
}

function decodeEntities(s: string) {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&ldquo;/g, "\u201C");
}

// Webflow CSV description/notes columns contain raw HTML like
// "<p>first para</p><p>second</p>". Convert to Sanity PortableText blocks.
function descriptionBlock(raw: string) {
  if (!raw) return undefined;
  const decoded = decodeEntities(raw).replace(/\s+/g, " ").trim();

  const paragraphs = decoded.includes("</p>")
    ? decoded
        .split(/<\/p>/i)
        .map((p) => p.replace(/<[^>]+>/g, "").trim())
        .filter(Boolean)
    : [decoded.replace(/<[^>]+>/g, "").trim()].filter(Boolean);

  if (paragraphs.length === 0) return undefined;
  return paragraphs.map(textToBlock);
}

// Upsert that leaves fields not in `fields` untouched — crucial for image
// fields uploaded in Studio, which the CSV can't provide.
function upsert(
  tx: ReturnType<typeof client.transaction>,
  id: string,
  type: string,
  fields: Record<string, unknown>
) {
  tx.createIfNotExists({ _id: id, _type: type });
  tx.patch(id, (p) => p.set(fields));
}

async function importEvents() {
  const rows = readCsv(
    "Mid-Atlantic Uniform League - Events - 6761e66934fa35b9999102e5.csv"
  );
  const tx = client.transaction();
  for (const r of rows) {
    if (r.Archived === "true") continue;
    upsert(tx, `event-${r["Item ID"]}`, "event", {
      title: r["Event Title"],
      slug: { _type: "slug", current: r.Slug },
      dateTime: new Date(r["Date & Time"]).toISOString(),
      locationVenue: r["Location/Venue"] || undefined,
      venueAddress: r["Venue Address"] || undefined,
      description: descriptionBlock(r.Description),
      infoLink: r["Info Link"] || undefined,
    });
  }
  await tx.commit();
  console.log(`✓ Events: ${rows.length} rows`);
}

// CSV "Date" column is a weekday label like "Saturday, September 19" (no year).
// Map to the real 2026 dates for the anniversary weekend.
const ANNIV_WEEKDAY_TO_DATE: Record<string, string> = {
  thursday: "2026-09-17",
  friday: "2026-09-18",
  saturday: "2026-09-19",
  sunday: "2026-09-20",
};

function parseAnnivDate(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const weekday = raw.split(",")[0].trim().toLowerCase();
  return ANNIV_WEEKDAY_TO_DATE[weekday];
}

async function importAnniversaryEvents() {
  const rows = readCsv(
    "Mid-Atlantic Uniform League - 20th Anniversary Events - 69850801b974f7bfb8191b64.csv"
  );
  const tx = client.transaction();
  for (const r of rows) {
    if (r.Archived === "true") continue;
    upsert(tx, `anniv-${r["Item ID"]}`, "anniversaryEvent", {
      event: r.Event,
      slug: { _type: "slug", current: r.Slug },
      date: parseAnnivDate(r.Date),
      startTime: r["Event Start Time"] || undefined,
      endTime: r["Event End Time"] || undefined,
      venue: r.Venue || undefined,
      notes: descriptionBlock(r.Notes),
    });
  }
  await tx.commit();
  console.log(`✓ Anniversary Events: ${rows.length} rows`);
}

async function importAmccClubs() {
  const rows = readCsv(
    "Mid-Atlantic Uniform League - AMCC Clubs - 66cf597b75dfab24cff9dba6.csv"
  );
  const tx = client.transaction();
  for (const r of rows) {
    if (r.Archived === "true") continue;
    upsert(tx, `club-${r["Item ID"]}`, "amccClub", {
      name: r.Name,
      slug: { _type: "slug", current: r.Slug },
      websiteLink: r["Website Link"] || undefined,
      location: r["Location (City, State)"] || undefined,
    });
  }
  await tx.commit();
  console.log(`✓ AMCC Clubs: ${rows.length} rows`);
}

async function importGalleries() {
  const rows = readCsv(
    "Mid-Atlantic Uniform League - Galleries - 6761d2c706ad3ba8520ccc1d.csv"
  );
  const tx = client.transaction();
  for (const r of rows) {
    if (r.Archived === "true") continue;
    upsert(tx, `gallery-${r["Item ID"]}`, "gallery", {
      name: r.Name,
      slug: { _type: "slug", current: r.Slug },
      date: r.Date ? new Date(r.Date).toISOString().slice(0, 10) : undefined,
      description: descriptionBlock(r.Description),
    });
  }
  await tx.commit();
  console.log(`✓ Galleries: ${rows.length} rows`);
}

async function importLeadership() {
  const rows = readCsv(
    "Mid-Atlantic Uniform League - Leadership - 67697936a44a3f0c8a40d953.csv"
  );
  const tx = client.transaction();
  rows.forEach((r, idx) => {
    if (r.Archived === "true") return;
    upsert(tx, `leader-${r["Item ID"]}`, "leadership", {
      position: r.Position,
      slug: { _type: "slug", current: r.Slug },
      fullName: r["Full Name"],
      bio: descriptionBlock(r.Bio),
      instagram: r.Instagram || undefined,
      facebook: r.Facebook || undefined,
      bluesky: r.Bluesky || undefined,
      order: idx,
    });
  });
  await tx.commit();
  console.log(`✓ Leadership: ${rows.length} rows`);
}

// Seed the homepage singleton with the text the site currently ships
// hardcoded, so editors see the live copy and can edit it in place
// rather than staring at an empty form. Uses createIfNotExists — safe
// to re-run; never overwrites editor changes.
async function ensureHomepage() {
  await client.createIfNotExists({
    _id: "homepage",
    _type: "homepage",
    heroHeading: "Serving since 2007",
    heroBody:
      "Mid-Atlantic Uniform League (MAUL) is a gay uniform club. Founded in January 2007, we aim to promote, organize and attend uniform-themed events in the mid-atlantic and surrounding regions.",
    heroCtaLabel: "Learn More",
    heroCtaLink: "/about",
    aboutHeading: "Mid-Atlantic & Beyond",
    aboutBody:
      "While our officers attend to many events in the Mid-Atlantic, MAUL membership is open to anyone who is proud to openly identify as a gay adult male with a uniform fetish, regardless of age, race, creed, religion, or any other such classification.",
    aboutCtaLabel: "How to Join",
    aboutCtaLink: "/membership/how-to-join",
    featuresHeading: "What we\u2019re all about!",
    featureCards: [
      {
        _key: "brotherhood",
        _type: "card",
        title: "Brotherhood",
        body: "We are a social and fraternal association for gay adult male with affinity or fetish for uniforms.",
        ctaLabel: "Learn More",
        ctaLink: "/about/our-mission",
      },
      {
        _key: "community",
        _type: "card",
        title: "Community",
        body: "We conduct outreach with other queer leather and uniform clubs and attend leather events throughout the year.",
        ctaLabel: "Learn More",
        ctaLink: "/about/our-mission",
      },
      {
        _key: "service",
        _type: "card",
        title: "Service",
        body: "We support and assist appropriate charities and community services, particularly those related to gay, fetish or public safety issues.",
        ctaLabel: "Learn More",
        ctaLink: "/about/our-mission",
      },
    ],
    eventsHeading: "Where to find us",
    eventsBody:
      "Officers of the club assemble at several events during the year including local police parades, motorcycle rodeos, and other law enforcement events throughout the year.",
    eventsPartnerHeading: "Looking to partner with us for an event?",
    eventsPartnerBody: "Contact our Events Officer or use the form below.",
    contactHeading: "Contact us",
    contactBody: "For general inquiries, use this form to reach us.",
    contactEmail: "contact@uniformleague.org",
    contactMembershipHeading: "Interested in joining MAUL?",
  });
  console.log("✓ Homepage: ensured singleton exists");
}

async function main() {
  console.log(`Importing into Sanity project ${projectId}/${dataset}\n`);
  await ensureHomepage();
  await importEvents();
  await importAnniversaryEvents();
  await importAmccClubs();
  await importGalleries();
  await importLeadership();
  console.log("\nDone. Upload images by hand in Studio (/studio).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
