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

function descriptionBlock(text: string) {
  if (!text) return undefined;
  return [
    {
      _type: "block",
      _key: Math.random().toString(36).slice(2, 10),
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: Math.random().toString(36).slice(2, 10),
          text,
          marks: [],
        },
      ],
    },
  ];
}

async function importEvents() {
  const rows = readCsv(
    "Mid-Atlantic Uniform League - Events - 6761e66934fa35b9999102e5.csv"
  );
  const tx = client.transaction();
  for (const r of rows) {
    if (r.Archived === "true") continue;
    const doc = {
      _id: `event-${r["Item ID"]}`,
      _type: "event",
      title: r["Event Title"],
      slug: { _type: "slug", current: r.Slug },
      dateTime: new Date(r["Date & Time"]).toISOString(),
      locationVenue: r["Location/Venue"] || undefined,
      venueAddress: r["Venue Address"] || undefined,
      description: descriptionBlock(r.Description),
      infoLink: r["Info Link"] || undefined,
    };
    tx.createOrReplace(doc);
  }
  await tx.commit();
  console.log(`✓ Events: ${rows.length} rows`);
}

async function importAnniversaryEvents() {
  const rows = readCsv(
    "Mid-Atlantic Uniform League - 20th Anniversary Events - 69850801b974f7bfb8191b64.csv"
  );
  const tx = client.transaction();
  for (const r of rows) {
    if (r.Archived === "true") continue;
    const doc = {
      _id: `anniv-${r["Item ID"]}`,
      _type: "anniversaryEvent",
      event: r.Event,
      slug: { _type: "slug", current: r.Slug },
      date: r.Date ? new Date(r.Date).toISOString().slice(0, 10) : undefined,
      startTime: r["Event Start Time"] || undefined,
      endTime: r["Event End Time"] || undefined,
      venue: r.Venue || undefined,
      notes: descriptionBlock(r.Notes),
    };
    tx.createOrReplace(doc);
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
    const doc = {
      _id: `club-${r["Item ID"]}`,
      _type: "amccClub",
      name: r.Name,
      slug: { _type: "slug", current: r.Slug },
      websiteLink: r["Website Link"] || undefined,
      location: r["Location (City, State)"] || undefined,
    };
    tx.createOrReplace(doc);
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
    const doc = {
      _id: `gallery-${r["Item ID"]}`,
      _type: "gallery",
      name: r.Name,
      slug: { _type: "slug", current: r.Slug },
      date: r.Date ? new Date(r.Date).toISOString().slice(0, 10) : undefined,
      description: descriptionBlock(r.Description),
    };
    tx.createOrReplace(doc);
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
    const doc = {
      _id: `leader-${r["Item ID"]}`,
      _type: "leadership",
      position: r.Position,
      slug: { _type: "slug", current: r.Slug },
      fullName: r["Full Name"],
      bio: descriptionBlock(r.Bio),
      instagram: r.Instagram || undefined,
      facebook: r.Facebook || undefined,
      bluesky: r.Bluesky || undefined,
      order: idx,
    };
    tx.createOrReplace(doc);
  });
  await tx.commit();
  console.log(`✓ Leadership: ${rows.length} rows`);
}

async function main() {
  console.log(`Importing into Sanity project ${projectId}/${dataset}\n`);
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
