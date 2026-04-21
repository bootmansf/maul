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

// Builds a PortableText paragraph block from a plain string.
function para(text: string, style: "normal" | "h2" | "h3" = "normal") {
  return {
    _type: "block",
    _key: randomKey(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: randomKey(), text, marks: [] }],
  };
}

async function ensureSimplePages() {
  const pages = [
    {
      _id: "aboutPage",
      title: "About MAUL",
      subtitle: "Serving since 2007",
      body: [
        para(
          "The Mid-Atlantic Uniform League, or MAUL, is a uniform organization formed in late 2006 and inaugurated in January 2007 with 18 original members."
        ),
        para(
          "Officers of the club assemble at several events during the year including DC Police Week, local police parades, motorcycle rodeos, and other law enforcement events throughout the year."
        ),
        para(
          "MAUL membership is distributed across the USA and isn\u2019t limited to men living in the Mid-Atlantic region. Although our membership largely consists of men with Law Enforcement and Military backgrounds, we welcome all men who are able to attend our regular events, wherever you happen to live."
        ),
        para(
          "If you are interested in learning more about becoming a member, see the How to Join page. We appreciate your interest in MAUL!"
        ),
      ],
    },
    {
      _id: "missionPage",
      title: "Our Mission",
      subtitle: "Who we are",
      body: [
        para(
          "The Mid-Atlantic Uniform League (MAUL) is an Honor Guard unit created as a fraternal network of gay men, largely with Law Enforcement and Military backgrounds, with an interest in uniforms in the Mid-Atlantic and surrounding regions."
        ),
        para(
          "To promote, organize and attend appropriate uniform-themed events, celebratory parades, and to encourage a uniformed presence at regional gay events."
        ),
        para(
          "To promote education and understanding of the uniform fetish among the larger gay community."
        ),
        para(
          "To support and assist appropriate charities and community services, particularly those related to gay, fetish or public safety issues."
        ),
      ],
    },
    {
      _id: "letterChiefPage",
      title: "Letter From The Chief",
      subtitle: "Chief Brad Garbert",
      signatureName: "Brad Garbert",
      signatureTitle: "Chief",
      body: [
        para("Welcome!"),
        para(
          "When I first encountered MAUL at the Mid-Atlantic Leather event in 2009, I was rapt. As a gay man who has always had an interest in men in uniform, I was enthralled by the group of men I saw. Their uniforms were so crisp and sharp, they owned the lobby of the hotel and commanded everyone\u2019s attention. \u201CFinally\u201D, I thought, \u201Chere is a group through which I can fulfill my interest and meet like-minded men.\u201D While I had heard of other uniform-related groups, MAUL was the first one I had encountered that had its own, unique, and breathtaking club uniform; a uniform that I could call my own if I was fortunate enough to be able to join. I submitted a membership petition and took the club oath of office in 2013. In January 2026, I was elected Chief."
        ),
        para(
          "Since I joined 13 years ago MAUL has become much more than a social club for gay men in the Mid-Atlantic region with an interest in uniforms. MAUL has grown to embrace members from all across North America, and even some in Europe. While we are widely dispersed, technology allows us to stay in touch and strengthen our camaraderie. MAUL has become a brotherhood through which its members support each other, and the larger community, aligning itself under the AMCC umbrella. My goal as Chief is to continue to strengthen our internal and external bonds and expand MAUL into a vehicle of not only brotherhood, but of service. I will also strive to maintain and increase MAUL\u2019s commitment to being a responsible, ethical, and respectful organization that supports our members and the larger community effectively."
        ),
        para(
          "2026 marks MAUL\u2019s 20th Anniversary, which we are celebrating with our first ever club run on September 17-20, 2026, in Providence, RI. Please join our celebration \u2014 details are available at /maul20."
        ),
        para(
          "Please feel free to peruse our website, and if you\u2019re interested in joining or just have questions, feel free to reach out using the contact page at /contact."
        ),
        para(
          "Thank you for your interest in the Mid-Atlantic Uniform League (MAUL)."
        ),
      ],
    },
    {
      _id: "letterColonelPage",
      title: "Letter From The Colonel",
      subtitle: "Colonel William F. Buckley, Jr.",
      signatureName: "William F. Buckley, Jr.",
      signatureTitle: "Colonel",
      body: [
        para(
          "Whenever I\u2019m asked to comment on why I so passionately believe in the Mid-Atlantic Uniform League, I focus on the core foundations and values that help propel our overall success and well-being. I believe best serving our member base and providing an engaging and rewarding environment ultimately creates long term value and a strong sense of pride and comradery."
        ),
        para(
          "As the former Chief of MAUL (now retired to the rank of Colonel), I was entrusted with the care and the direction of the club during my term of office. Chief of MAUL is an elected position in which he is entrusted with the care and the direction of the club during his term of office. Having served in this role, I can report there are no shortcuts if you want to create enduring value. One of my goals has been to establish a commitment to being a responsible, ethical, and respectful. Through teamwork and a respect for the observance of a military-style chain of command sets the bar high for excellence work that starts at the top of the organization and extends to all our members across the country. I also want to take a moment to express my sincere gratitude for the ongoing dedication and hard work of the MAUL Executive Board."
        ),
        para(
          "Our approach to serving within our larger community is also enduring and integral to our values. This is evident in our efforts to align with other clubs and organizations, especially those under the AMCC umbrella."
        ),
        para(
          "I believe that the brotherhood which exists through our collective passion and focus, we will continue to challenge expectations and build towards a brighter future for our group. But we in MAUL are neither finished nor content with where we stand currently. We will remain committed to building on our already strong foundation of integrity and responsibility so we can take actionable steps and create meaningful impact as we move forward with purpose for all."
        ),
        para("Thank you for your interest in the Mid-Atlantic Uniform League."),
      ],
    },
  ];

  for (const p of pages) {
    const doc = { _type: "simplePage", ...p } as Parameters<
      typeof client.createIfNotExists
    >[0];
    await client.createIfNotExists(doc);
  }
  console.log(`✓ Simple pages: ${pages.length} ensured`);
}

async function ensureHowToJoinPage() {
  await client.createIfNotExists({
    _id: "howToJoinPage",
    _type: "howToJoinPage",
    title: "How To Join",
    subtitle: "We\u2019re looking for a few good men!",
    steps: [
      {
        _key: randomKey(),
        _type: "step",
        title: "Step One: Come and meet us",
        body: [
          para(
            "The first step toward becoming a MAUL Officer is to attend an event and meet the officers. We want to meet you and hear about your uniform experience! This also gives you a chance to see what we are about too! You must attend at least one in-person event before becoming a MAUL Cadet. MAUL hosts uniform events at both MAL and CLAW in addition to attending other events. Upcoming events are listed on the main page of the MAUL website."
          ),
        ],
      },
      {
        _key: randomKey(),
        _type: "step",
        title: "Step Two: Membership Petition",
        body: [
          para(
            "Any gay male wishing to become an officer in the Mid-Atlantic Uniform League should submit a Membership Petition (via our online form) to the Deputy Chief/Membership Officer. This email should tell us a bit about you and your interest in the club. In addition, three Active Duty MAUL officers must endorse the petition before it is sent to the Chief for approval. You\u2019ll get these endorsements while attending one of our events. You can submit your Membership Petition email via our Contact Us page at /contact."
          ),
        ],
      },
      {
        _key: randomKey(),
        _type: "step",
        title: "Step Three: Cadet Training",
        body: [
          para(
            "Upon the Chief's approval, the petitioner is granted probationary membership in MAUL and holds the rank of Cadet. Cadets will complete their training under the supervision of the Deputy Chief and a Training Officer. The Cadet's primary responsibility during their training period will be to familiarize themselves with the club, attend online meetings, and in-person events. Cadets will also need to assemble and wear the MAUL Class B uniform. You must attend at least one in-person event as a Cadet before being considered for full Officer status."
          ),
        ],
      },
      {
        _key: randomKey(),
        _type: "step",
        title: "Step Four: Granting Membership",
        body: [
          para(
            "When the Cadet has finished his training and completed his Class B uniform, the Deputy Chief will certify to the Chief that the requirements of membership have been met. The Chief may then appoint the Cadet to be an Active Duty or Reserve Officer of the Mid-Atlantic Uniform League."
          ),
        ],
      },
    ],
    infoCards: [
      {
        _key: randomKey(),
        _type: "card",
        heading: "Costs of Membership",
        body: "Membership in MAUL is set at $75 annually, payable once a petitioner is appointed as a Cadet. The cost of the uniform will vary depending on how much of it the Cadet already owns.",
      },
      {
        _key: randomKey(),
        _type: "card",
        heading: "Levels of Membership",
        body: "Membership in MAUL is set at $75 annually, payable once a petitioner is appointed as a Cadet. The cost of the uniform will vary depending on how much of it the Cadet already owns.",
      },
    ],
    contactHeading: "Contact",
    contactBody: [
      para(
        "For more information, please contact the Deputy Chief/Membership Officer on our Contact Us page at /contact."
      ),
    ],
  });
  console.log("✓ How to Join page: ensured singleton exists");
}

async function ensureAnniversaryPage() {
  await client.createIfNotExists({
    _id: "anniversaryPage",
    _type: "anniversaryPage",
    heroHeading: "Mid-Atlantic Uniform League\n20th Anniversary",
    heroDates: "September 17-20, 2026",
    heroLocation: "Providence, RI",
    heroBody: "Join us as we celebrate twenty years of legacy, pride, and community.",
    countdownTarget: "2026-09-17T21:00:00",
    ticketsHeading: "Tickets Now Available",
    ticketsBody: "A weekend you won\u2019t want to miss!",
    ticketsCtaLabel: "Buy Tickets",
    ticketsUrl:
      "https://www.eventbrite.com/e/mid-atlantic-uniform-league-20th-anniversary-run-festival-providence-ri-registration-1982476097374",
    hotelHeading: "Host Hotel",
    hotelName: "Hotel Providence",
    hotelAddress: "139 Mathewson St,\nProvidence, RI 02903",
    hotelCtaLabel: "Book Now!",
    hotelUrl:
      "https://secure.webrez.com/hotel/4174/?package_id=341360&date_from=20260918&date_to=20260920",
    scheduleHeading: "Weekend Schedule",
  });
  console.log("✓ Anniversary page: ensured singleton exists");
}

async function ensureExternalLinks() {
  const clubs: { category: string; name: string; url: string; location?: string }[] = [
    { category: "Regional Uniform Clubs", name: "The Regiment of the Black and Tans", url: "https://www.blackandtans.org", location: "Los Angeles, CA" },
    { category: "Regional Uniform Clubs", name: "California B&B Corps", url: "https://bbcorps.com", location: "Los Angeles/San Francisco/Palm Springs, CA" },
    { category: "Online Uniform Clubs", name: "The Breeches and Leather Uniform Fanclub (BLUF)", url: "https://bluf.com/" },
    { category: "Regional Leather Clubs", name: "ONYX", url: "https://www.onyxmen.com", location: "Multiple Chapters" },
    { category: "Regional Leather Clubs", name: "Rhode Island Leather Enthusiasts", url: "https://rileather.com", location: "Providence, RI" },
  ];
  const vendors: { category: string; name: string; url: string }[] = [
    { category: "Cop Gear", name: "Alberta Boots", url: "https://www.albertaboot.ca/pages/law-enforcement" },
    { category: "Cop Gear", name: "All American Boots", url: "https://www.allamericanboot.com/collections/law-enforcement-boots" },
    { category: "Cop Gear", name: "Cycle Cop", url: "https://cyclecop.com/products/" },
    { category: "Cop Gear", name: "Dehner Boots", url: "https://dehner.com/product-category/law-enforcement-boots" },
    { category: "Cop Gear", name: "Embossy Boots", url: "https://store.embossy.eu/gb/14-uniform" },
    { category: "Cop Gear", name: "Galls", url: "http://www.galls.com/" },
    { category: "Cop Gear", name: "LA Police Gear", url: "http://www.lapolicegear.com/" },
    { category: "Cop Gear", name: "Nick's Police Boots", url: "https://www.nickspoliceboots.com/products" },
    { category: "Cop Gear", name: "Police Equipment Worldwide", url: "http://www.police-equipment-worldwide.com/catalog" },
    { category: "Cop Gear", name: "Quartermaster", url: "http://www.qmuniforms.com/" },
    { category: "Firefighter and Other Gear", name: "Paul Conway Shields", url: "https://www.paulconwayshields.com/" },
    { category: "General", name: "Gear Directory", url: "https://geardirectory.notion.site/Gear-Directory-9f9cc24bfc824988946b9c5625f3a4da" },
  ];

  // Keep _id stable per entry so re-running is idempotent.
  const slug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  let n = 0;
  for (const [i, c] of clubs.entries()) {
    await client.createIfNotExists({
      _id: `club-link-${slug(c.name)}`,
      _type: "externalLink",
      kind: "club",
      category: c.category,
      name: c.name,
      url: c.url,
      location: c.location,
      order: i,
    });
    n++;
  }
  for (const [i, v] of vendors.entries()) {
    await client.createIfNotExists({
      _id: `vendor-link-${slug(v.name)}`,
      _type: "externalLink",
      kind: "vendor",
      category: v.category,
      name: v.name,
      url: v.url,
      order: i,
    });
    n++;
  }
  console.log(`✓ External links: ${n} ensured`);
}

async function main() {
  console.log(`Importing into Sanity project ${projectId}/${dataset}\n`);
  await ensureHomepage();
  await ensureSimplePages();
  await ensureHowToJoinPage();
  await ensureAnniversaryPage();
  await ensureExternalLinks();
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
