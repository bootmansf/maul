import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { Countdown } from "../components/Countdown";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";

export const revalidate = 60;

export const metadata = {
  title: "20th Anniversary — Mid-Atlantic Uniform League",
  description:
    "Join us September 17-20, 2026 in Providence, RI as we celebrate MAUL's 20th anniversary.",
};

const ANNIV_QUERY = `*[_type == "anniversaryEvent"] | order(date asc, startTime asc){
  _id, event, "slug": slug.current, date, startTime, endTime, venue, notes
}`;

type AnnivEvent = {
  _id: string;
  event: string;
  slug: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  venue?: string;
  notes?: PortableTextBlock[];
};

const SCHEDULE_DAYS: { key: string; label: string }[] = [
  { key: "2026-09-17", label: "Thursday, September 17" },
  { key: "2026-09-18", label: "Friday, September 18" },
  { key: "2026-09-19", label: "Saturday, September 19" },
  { key: "2026-09-20", label: "Sunday, September 20" },
];

export default async function Maul20Page() {
  const all = isSanityConfigured()
    ? await getClient().fetch<AnnivEvent[]>(ANNIV_QUERY)
    : [];

  const byDay = SCHEDULE_DAYS.map((d) => ({
    ...d,
    items: all.filter((e) => e.date === d.key),
  }));

  return (
    <div className="page-wrapper">
      <SiteNav />

      <main className="main-wrapper">
        <header className="section_header6 text-color-white">
          <div className="padding-global">
            <div className="container-large">
              <div className="header6_content">
                <div className="padding-section-large">
                  <div className="max-width-medium">
                    <div className="margin-bottom margin-small">
                      <div className="div-block-2">
                        <h1 className="heading-style-h1 text-style-allcaps height-one text-color-gold">
                          Mid-Atlantic Uniform League
                          <br />
                          20th Anniversary
                        </h1>
                      </div>
                      <h2 className="heading-style-h4 text-weight-medium height-one">
                        September 17-20, 2026
                        <br />
                        Providence, RI
                      </h2>
                    </div>
                    <p className="text-size-medium">
                      Join us as we celebrate twenty years of legacy, pride, and
                      community.
                    </p>
                    <div className="margin-top margin-medium">
                      <Countdown targetIso="2026-09-17T21:00:00" />
                    </div>
                  </div>
                </div>
                <div className="event-bookinglinks">
                  <div className="anniversaryblock-book text-color-blue align-center">
                    <h3 className="heading-style-h5 text-align-center">
                      Tickets Now Available
                    </h3>
                    <div className="div-block">
                      <div className="margin-top">
                        <div className="text-size-regular text-align-center">
                          A weekend you won&rsquo;t want to miss!
                        </div>
                      </div>
                      <div className="margin-top margin-xsmall">
                        <div className="centerbuttonblock">
                          <a
                            href="https://www.eventbrite.com/e/mid-atlantic-uniform-league-20th-anniversary-run-festival-providence-ri-registration-1982476097374"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button is-alternate w-button"
                          >
                            Buy Tickets
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="anniversaryblock-book text-color-blue align-center">
                    <h3 className="heading-style-h5">Host Hotel</h3>
                    <div className="div-block">
                      <div className="margin-top">
                        <div className="text-size-regular text-align-center">
                          <strong>Hotel Providence</strong>
                          <br />
                          139 Mathewson St,
                          <br />
                          Providence, RI 02903
                        </div>
                      </div>
                      <div className="margin-top margin-xsmall">
                        <div className="centerbuttonblock">
                          <a
                            href="https://secure.webrez.com/hotel/4174/?package_id=341360&date_from=20260918&date_to=20260920"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button is-alternate w-button"
                          >
                            Book Now!
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="header6_background-image-wrapper">
            <div className="image-overlay-layer" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="eager"
              src="/images/MAUL20_PHBG.avif"
              alt=""
              srcSet="/images/MAUL20_PHBG-p-500.avif 500w, /images/MAUL20_PHBG-p-800.avif 800w, /images/MAUL20_PHBG-p-1080.avif 1080w, /images/MAUL20_PHBG-p-1600.avif 1600w, /images/MAUL20_PHBG-p-2000.avif 2000w, /images/MAUL20_PHBG.avif 3200w"
              sizes="100vw"
              className="header6_background-image"
            />
          </div>
        </header>

        <section className="section_event31">
          <div className="padding-global">
            <div className="container-medium">
              <div className="padding-section-large">
                <div className="event31_component">
                  <div className="margin-bottom margin-medium">
                    <div className="max-width-large align-center">
                      <div className="text-align-center">
                        <div className="margin-bottom">
                          <h2 className="heading-style-h2">Weekend Schedule</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="event31_content">
                    {byDay.map((d) => (
                      <details key={d.key} className="event31_accordion" open>
                        <summary className="event31_day">
                          <h3 className="heading-style-h5">{d.label}</h3>
                          <div className="event31_icon-wrapper" aria-hidden="true">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M25.3333 15.667V16.3336C25.3333 16.7018 25.0349 17.0003 24.6667 17.0003H17V24.667C17 25.0351 16.7015 25.3336 16.3333 25.3336H15.6667C15.2985 25.3336 15 25.0351 15 24.667V17.0003H7.3333C6.96511 17.0003 6.66663 16.7018 6.66663 16.3336V15.667C6.66663 15.2988 6.96511 15.0003 7.3333 15.0003H15V7.33365C15 6.96546 15.2985 6.66699 15.6667 6.66699H16.3333C16.7015 6.66699 17 6.96546 17 7.33365V15.0003H24.6667C25.0349 15.0003 25.3333 15.2988 25.3333 15.667Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        </summary>
                        <div className="event31_list-wrapper">
                          <div role="list" className="event31_list">
                            {d.items.length === 0 ? (
                              <div className="w-dyn-empty">
                                <div>
                                  {isSanityConfigured()
                                    ? "No events scheduled for this day yet."
                                    : "Schedule will appear once Sanity is connected."}
                                </div>
                              </div>
                            ) : (
                              d.items.map((item) => (
                                <div
                                  key={item._id}
                                  role="listitem"
                                  className="event31_item"
                                >
                                  <div className="startendtime">
                                    <div className="text-size-large">
                                      {item.startTime || ""}
                                    </div>
                                    {item.endTime ? (
                                      <>
                                        <div className="text-size-large">–</div>
                                        <div className="text-size-large">
                                          {item.endTime}
                                        </div>
                                      </>
                                    ) : null}
                                  </div>
                                  <div className="event31_item-content">
                                    <div className="event31_item-title">
                                      <div className="heading-style-h6">
                                        {item.event}
                                      </div>
                                    </div>
                                    {item.notes?.length ? (
                                      <div className="w-richtext">
                                        <PortableText value={item.notes} />
                                      </div>
                                    ) : null}
                                  </div>
                                  {item.venue ? (
                                    <div className="event31_item-content">
                                      <div className="venueblock">{item.venue}</div>
                                    </div>
                                  ) : null}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </details>
                    ))}
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
