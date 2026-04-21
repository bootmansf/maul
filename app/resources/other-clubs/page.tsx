import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";

export const revalidate = 60;

export const metadata = {
  title: "Other Leather and Uniform Clubs — Mid-Atlantic Uniform League",
};

const CLUBS_QUERY = `*[_type == "externalLink" && kind == "club"] | order(order asc, name asc){
  _id, category, name, url, location
}`;

type ClubEntry = {
  _id: string;
  category: string;
  name: string;
  url: string;
  location?: string;
};

const FALLBACK: { heading: string; entries: { name: string; url: string; location?: string }[] }[] = [
  {
    heading: "Regional Uniform Clubs",
    entries: [
      { name: "The Regiment of the Black and Tans", url: "https://www.blackandtans.org", location: "Los Angeles, CA" },
      { name: "California B&B Corps", url: "https://bbcorps.com", location: "Los Angeles/San Francisco/Palm Springs, CA" },
    ],
  },
  {
    heading: "Online Uniform Clubs",
    entries: [
      { name: "The Breeches and Leather Uniform Fanclub (BLUF)", url: "https://bluf.com/" },
    ],
  },
  {
    heading: "Regional Leather Clubs",
    entries: [
      { name: "ONYX", url: "https://www.onyxmen.com", location: "Multiple Chapters" },
      { name: "Rhode Island Leather Enthusiasts", url: "https://rileather.com", location: "Providence, RI" },
    ],
  },
];

function groupByCategory(rows: ClubEntry[]) {
  const map = new Map<string, ClubEntry[]>();
  for (const r of rows) {
    const arr = map.get(r.category) ?? [];
    arr.push(r);
    map.set(r.category, arr);
  }
  return Array.from(map.entries()).map(([heading, entries]) => ({
    heading,
    entries,
  }));
}

export default async function OtherClubsPage() {
  const rows = isSanityConfigured()
    ? await getClient().fetch<ClubEntry[]>(CLUBS_QUERY)
    : [];

  const sections =
    rows.length > 0
      ? groupByCategory(rows)
      : FALLBACK.map((s) => ({
          heading: s.heading,
          entries: s.entries.map((e, i) => ({
            _id: `fallback-${s.heading}-${i}`,
            category: s.heading,
            name: e.name,
            url: e.url,
            location: e.location,
          })),
        }));

  return (
    <div className="page-wrapper">
      <SiteNav />

      <main className="main-wrapper">
        <header className="section_header46">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-small">
                <div className="header46_component">
                  <div className="max-width-large">
                    <div className="margin-bottom margin-xsmall">
                      <h1 className="heading-style-h2">
                        Other Leather and Uniform Clubs
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="section_layout3">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-small">
                <div className="layout396_component">
                  <div className="w-layout-grid layout396_grid-list">
                    <div className="w-layout-grid layout396_row">
                      {sections.map((s) => (
                        <div key={s.heading} className="layout396_card">
                          <div className="layout396_card-content">
                            <div className="layout396_card-content-top">
                              <div className="margin-bottom margin-xsmall">
                                <h2 className="heading-style-h5 text-color-blue">
                                  {s.heading}
                                </h2>
                              </div>
                              <ul role="list">
                                {s.entries.map((e) => (
                                  <li key={e._id}>
                                    <a
                                      href={e.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="club_link_other"
                                    >
                                      {e.name}
                                    </a>
                                    {e.location ? (
                                      <>
                                        <br />
                                        {e.location}
                                      </>
                                    ) : null}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="blue" />
    </div>
  );
}
