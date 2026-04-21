import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata = {
  title: "Other Leather and Uniform Clubs — Mid-Atlantic Uniform League",
};

type ClubEntry = { name: string; href: string; location?: string };

const SECTIONS: { heading: string; entries: ClubEntry[] }[] = [
  {
    heading: "Regional Uniform Clubs",
    entries: [
      {
        name: "The Regiment of the Black and Tans",
        href: "https://www.blackandtans.org",
        location: "Los Angeles, CA",
      },
      {
        name: "California B&B Corps",
        href: "https://bbcorps.com",
        location: "Los Angeles/San Francisco/Palm Springs, CA",
      },
    ],
  },
  {
    heading: "Online Uniform Clubs",
    entries: [
      {
        name: "The Breeches and Leather Uniform Fanclub (BLUF)",
        href: "https://bluf.com/",
      },
    ],
  },
  {
    heading: "Regional Leather Clubs",
    entries: [
      {
        name: "ONYX",
        href: "https://www.onyxmen.com",
        location: "Multiple Chapters",
      },
      {
        name: "Rhode Island Leather Enthusiasts",
        href: "https://rileather.com",
        location: "Providence, RI",
      },
    ],
  },
];

export default function OtherClubsPage() {
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
                      {SECTIONS.map((s) => (
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
                                  <li key={e.href}>
                                    <a
                                      href={e.href}
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
